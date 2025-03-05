import { Router } from "express"
import { checkout } from "./invoice.controller.js"
import { validateJWT } from "../middlewares/validate-jwt.js"
import { hasRoles } from "../middlewares/validate-roles.js"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Invoice
 *   description: Proceso de compra (CLIENT)
 */

/**
 * @swagger
 * /invoice/checkout:
 *   post:
 *     summary: Realiza el proceso de compra y genera la factura en PDF
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna un archivo PDF con la factura
 *       400:
 *         description: Error en la solicitud o stock insuficiente
 */
router.post("/checkout", validateJWT, hasRoles("CLIENT"), checkout)

export default router
