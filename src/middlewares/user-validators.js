/*
  Aquí agrupo varias validaciones de express-validator para 
  registro, login y acciones específicas sobre usuarios.
*/

import { body, param } from "express-validator"
import { emailExists, usernameExists, userExists } from "../helpers/db-validators.js"
import { validarCampos } from "./validate-fields.js"
import { deleteFileOnError } from "./delete-file-on-error.js"
import { handleErrors } from "./handle-errors.js"
import { validateJWT } from "./validate-jwt.js"
import { hasRoles } from "./validate-roles.js"

export const registerValidator = [
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("surname").notEmpty().withMessage("El apellido es requerido"),
    body("username").notEmpty().withMessage("El username es requerido"),
    body("email").notEmpty().withMessage("El email es requerido"),
    body("email").isEmail().withMessage("No es un email válido"),
    body("email").custom(emailExists),
    body("username").custom(usernameExists),
    body("password").isStrongPassword({
        minLength: 8,
        minLowercase:1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("La contraseña no cumple con los requisitos mínimos"),
    body("phone").isLength({min:8, max:8}).withMessage("El teléfono debe tener 8 dígitos"),
    validarCampos,
    deleteFileOnError,
    handleErrors
]

export const loginValidator = [
    // Para el login puedo recibir email o username
    body("email").optional().isEmail().withMessage("No es un email válido"),
    body("username").optional().isString().withMessage("El username no es válido"),
    body("password").isLength({min: 4}).withMessage("La contraseña debe contener al menos 4 caracteres"),
    validarCampos,
    handleErrors
]

// Valido cuando quiero obtener un usuario por su id
export const getUserByIdValidator = [
    validateJWT,
    // Para este ejemplo, asumo que solo ADMIN y CLIENT pueden ver datos, ajusto según la lógica de negocio
    hasRoles("ADMIN","CLIENT"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    validarCampos,
    handleErrors
]

// Valido cuando quiero eliminar un usuario
export const deleteUserValidator = [
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    validarCampos,
    handleErrors
]

// Valido cuando quiero actualizar la contraseña
export const updatePasswordValidator = [
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    body("newPassword").isLength({min: 8}).withMessage("El password debe contener al menos 8 caracteres"),
    validarCampos,
    handleErrors
]

// Valido cuando quiero actualizar datos de un usuario
export const updateUserValidator = [
    param("uid", "No es un ID válido").isMongoId(),
    param("uid").custom(userExists),
    validarCampos,
    handleErrors
]

// Valido cuando quiero actualizar la foto de perfil
export const updateProfilePictureValidator = [
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    validarCampos,
    deleteFileOnError,
    handleErrors
]
