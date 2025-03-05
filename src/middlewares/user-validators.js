import { body, param } from "express-validator"
import { emailExists, usernameExists, userExists } from "../helpers/db-validators.js"
import { validateFields } from "./validate-fields.js"
import { deleteFileOnError } from "./delete-file-on-error.js"
import { handleErrors } from "./handle-errors.js"
import { validateJWT } from "./validate-jwt.js"
import { hasRoles } from "./validate-roles.js"

/*
  Aquí agrupo varias validaciones de express-validator para 
  registro, login y acciones específicas sobre usuarios.
*/

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
    validateFields,
    deleteFileOnError,
    handleErrors
]

export const loginValidator = [
    // Para el login puedo recibir email o username
    body("email").optional().isEmail().withMessage("No es un email válido"),
    body("username").optional().isString().withMessage("El username no es válido"),
    body("password").isLength({min: 4}).withMessage("La contraseña debe contener al menos 4 caracteres"),
    validateFields,
    handleErrors
]

export const getUserByIdValidator = [
    validateJWT,
    hasRoles("ADMIN","CLIENT"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    validateFields,
    handleErrors
]

export const deleteUserValidator = [
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    validateFields,
    handleErrors
]

export const updatePasswordValidator = [
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    body("newPassword").isLength({min: 8}).withMessage("El password debe contener al menos 8 caracteres"),
    validateFields,
    handleErrors
]

export const updateUserValidator = [
    param("uid", "No es un ID válido").isMongoId(),
    param("uid").custom(userExists),
    validateFields,
    handleErrors
]

export const updateProfilePictureValidator = [
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    validateFields,
    deleteFileOnError,
    handleErrors
]
