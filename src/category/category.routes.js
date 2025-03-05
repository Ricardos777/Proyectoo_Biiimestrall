import { Router } from "express"
import { createCategory, getCategories, updateCategory, deleteCategory } from "./category.controller.js"
import { createCategoryValidator, updateCategoryValidator } from "../middlewares/category-validators.js"
import { validateJWT } from "../middlewares/validate-jwt.js"
import { hasRoles } from "../middlewares/validate-roles.js"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Gestión de categorías (Solo ADMIN)
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Category]
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
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post("/", validateJWT, hasRoles("ADMIN"), createCategoryValidator, createCategory)

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Lista todas las categorías
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *       400:
 *         description: Error en la solicitud
 */
router.get("/", validateJWT, hasRoles("ADMIN"), getCategories)

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Actualiza una categoría
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a actualizar
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
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       400:
 *         description: Error en la solicitud
 */
router.put("/:id", validateJWT, hasRoles("ADMIN"), updateCategoryValidator, updateCategory)

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Elimina una categoría y reasigna productos a la categoría predeterminada
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada y productos reasignados
 *       400:
 *         description: Error en la solicitud
 */
router.delete("/:id", validateJWT, hasRoles("ADMIN"), deleteCategory)

export default router