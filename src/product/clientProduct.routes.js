import { Router } from "express";
import { exploreProducts, getClientMostSoldProducts } from "./clientProduct.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

// Defino las rutas de exploración de productos para clientes.
// No se restringe por rol, ya que cualquier usuario autenticado (CLIENT o ADMIN) podrá explorarlos.
const router = Router();

/**
 * @swagger
 * tags:
 *   name: ClientProduct
 *   description: Exploración de productos para clientes
 */

/**
 * @swagger
 * /client/products:
 *   get:
 *     summary: Explora el catálogo de productos
 *     tags: [ClientProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: ID de la categoría para filtrar
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar productos por nombre
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
router.get("/products", validateJWT, exploreProducts);

/**
 * @swagger
 * /client/products/mostSold:
 *   get:
 *     summary: Obtiene los productos más vendidos
 *     tags: [ClientProduct]
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
router.get("/products/mostSold", validateJWT, getClientMostSoldProducts);

export default router;