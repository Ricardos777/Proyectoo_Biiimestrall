import { body, param } from "express-validator"
import { validateFields } from "./validate-fields.js"

/*
  Validaciones para la gestión de categorías.
*/

export const createCategoryValidator = [
  body("name").notEmpty().withMessage("El nombre de la categoría es obligatorio"),
  body("description").optional().isString().withMessage("La descripción debe ser un texto"),
  validateFields
]

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
  body("name").optional().notEmpty().withMessage("El nombre no puede ser vacío"),
  body("description").optional().isString().withMessage("La descripción debe ser un texto"),
  validateFields
]