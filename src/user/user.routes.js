import { Router } from "express"
import {
    getUserById,
    getUsers,
    deleteUser,
    updatePassword,
    updateUser,
    updateProfilePicture,
    deleteAccount
} from "./user.controller.js"
import {
    getUserByIdValidator,
    deleteUserValidator,
    updatePasswordValidator,
    updateUserValidator,
    updateProfilePictureValidator
} from "../middlewares/user-validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"
import { validateJWT } from "../middlewares/validate-jwt.js"

const router = Router()

/**
 * @swagger
 * /findUser/{uid}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/findUser/:uid", getUserByIdValidator, getUserById)

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", getUsers)

/**
 * @swagger
 * /deleteUser/{uid}:
 *   delete:
 *     summary: Elimina un usuario por ID (cambia su estado a false)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado (status=false)
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/deleteUser/:uid", deleteUserValidator, deleteUser)

/**
 * @swagger
 * /updatePassword/{uid}:
 *   patch:
 *     summary: Actualiza la contraseña de un usuario
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Error en la solicitud
 */
router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword)

/**
 * @swagger
 * /updateUser/{uid}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
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
 *               surname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Error en la solicitud
 */
router.put("/updateUser/:uid", updateUserValidator, updateUser)

/**
 * @swagger
 * /updateProfilePicture/{uid}:
 *   patch:
 *     summary: Actualiza la foto de perfil de un usuario
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada
 *       400:
 *         description: Error en la solicitud
 */
router.patch("/updateProfilePicture/:uid", uploadProfilePicture.single("profilePicture"), updateProfilePictureValidator, updateProfilePicture)

/**
 * @swagger
 * /deleteAccount:
 *   delete:
 *     summary: Elimina la cuenta del usuario autenticado (requiere confirmación de contraseña)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cuenta eliminada correctamente
 *       400:
 *         description: Error en la solicitud o confirmación incorrecta
 */
router.delete("/deleteAccount", validateJWT, deleteAccount)

export default router