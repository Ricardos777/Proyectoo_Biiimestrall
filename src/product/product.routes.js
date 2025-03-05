import { Router } from "express"
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getMostSoldProducts } from "./product.controller.js"
import { createProductValidator, updateProductValidator } from "../middlewares/product-validators.js"
import { validateJWT } from "../middlewares/validate-jwt.js"
import { hasRoles } from "../middlewares/validate-roles.js"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Gestión de productos (Solo ADMIN)
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               inventory:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post("/", validateJWT, hasRoles("ADMIN"), createProductValidator, createProduct)

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Obtiene la lista de productos
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: soldOut
 *         schema:
 *           type: boolean
 *         description: Filtrar por productos agotados (true/false)
 *       - in: query
 *         name: mostSold
 *         schema:
 *           type: boolean
 *         description: Si se establece true, ordena por productos más vendidos
 *       - in: query
 *         name: limite
 *         schema:
 *           type: number
 *         description: Número máximo de resultados
 *       - in: query
 *         name: desde
 *         schema:
 *           type: number
 *         description: Número de resultados a saltar (paginación)
 *     responses:
 *       200:
 *         description: Lista de productos
 *       400:
 *         description: Error en la solicitud
 */
router.get("/", validateJWT, hasRoles("ADMIN"), getProducts)

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", validateJWT, hasRoles("ADMIN"), getProductById)

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Actualiza un producto por ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               inventory:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", validateJWT, hasRoles("ADMIN"), updateProductValidator, updateProduct)

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Elimina un producto por ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", validateJWT, hasRoles("ADMIN"), deleteProduct)

/**
 * @swagger
 * /product/mostSold:
 *   get:
 *     summary: Obtiene los productos más vendidos
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: number
 *         description: Número máximo de productos a retornar
 *     responses:
 *       200:
 *         description: Lista de productos más vendidos
 *       400:
 *         description: Error en la solicitud
 */
router.get("/mostSold", validateJWT, hasRoles("ADMIN"), getMostSoldProducts)

export default router