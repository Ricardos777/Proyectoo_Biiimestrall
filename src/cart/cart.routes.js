import { Router } from "express"
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart
} from "./cart.controller.js"
import { validateJWT } from "../middlewares/validate-jwt.js"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Gestión del Carrito de Compras (Cliente)
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtiene el carrito del usuario autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito del usuario
 *       400:
 *         description: Error en la solicitud
 */
router.get("/", validateJWT, getCart)

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Agrega un producto al carrito del usuario autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto agregado o actualizado en el carrito
 *       400:
 *         description: Error en la solicitud
 */
router.post("/add", validateJWT, addItemToCart)

/**
 * @swagger
 * /cart/update:
 *   patch:
 *     summary: Actualiza la cantidad de un producto en el carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               newQuantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *       400:
 *         description: Error en la solicitud
 */
router.patch("/update", validateJWT, updateCartItem)

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Elimina un producto del carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       400:
 *         description: Error en la solicitud
 */
router.delete("/remove", validateJWT, removeItemFromCart)

export default router
