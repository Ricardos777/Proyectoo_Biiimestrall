import { body, param } from "express-validator"
import { validateFields } from "./validate-fields.js"

/*
  Validaciones para la gestión de productos.
*/

export const createProductValidator = [
  body("name").notEmpty().withMessage("El nombre del producto es obligatorio"),
  body("price").isNumeric().withMessage("El precio debe ser un número"),
  body("inventory").isNumeric().withMessage("El inventario debe ser un número"),
  // La descripción y category son opcionales
  validateFields
]

export const updateProductValidator = [
  param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
  body("name").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
  body("price").optional().isNumeric().withMessage("El precio debe ser un número"),
  body("inventory").optional().isNumeric().withMessage("El inventario debe ser un número"),
  // La descripción y category son opcionales
  validateFields
]
