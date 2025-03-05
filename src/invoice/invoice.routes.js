import { Router } from "express"
import { checkout, getInvoicesByUser, getInvoiceById, updateInvoice, getPurchaseHistory } from "./invoice.controller.js"
import { validateJWT } from "../middlewares/validate-jwt.js"
import { hasRoles } from "../middlewares/validate-roles.js"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Invoice
 *   description: Gestión de facturas (ADMIN/CLIENT)
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

/**
 * @swagger
 * /invoice/user/{userId}:
 *   get:
 *     summary: Obtiene todas las facturas de un usuario
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de facturas del usuario
 *       400:
 *         description: Error en la solicitud
 */
router.get("/user/:userId", validateJWT, getInvoicesByUser)

/**
 * @swagger
 * /invoice/{invoiceId}:
 *   get:
 *     summary: Obtiene los detalles de una factura
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Detalles de la factura
 *       400:
 *         description: Error en la solicitud
 */
router.get("/:invoiceId", validateJWT, getInvoiceById)

/**
 * @swagger
 * /invoice/{invoiceId}:
 *   put:
 *     summary: Actualiza una factura (solo ADMIN)
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la factura a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Factura actualizada
 *       400:
 *         description: Error en la solicitud
 */
router.put("/:invoiceId", validateJWT, hasRoles("ADMIN"), updateInvoice)

/**
 * @swagger
 * /invoice/history:
 *   get:
 *     summary: Obtiene el historial de compras del usuario autenticado
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de facturas (historial de compras)
 *       400:
 *         description: Error en la solicitud
 */
router.get("/history", validateJWT, getPurchaseHistory)

export default router