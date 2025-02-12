/*
  En este controlador tengo las funciones CRUD para el usuario:
  obtener uno por id, obtener lista, eliminar (cambiar status), 
  actualizar contraseña, actualizar datos y actualizar la foto de perfil.
*/

import { hash, verify } from "argon2"
import User from "./user.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

// Obtengo la ruta actual para poder eliminar archivos
const __dirname = dirname(fileURLToPath(import.meta.url))

export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params
        const user = await User.findById(uid)

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        })
    }
}

export const getUsers = async (req, res) => {
    /*
      Aquí obtengo la lista de usuarios paginada (con límite y desde).
      Por defecto uso 5 y 0, pero puedo cambiarlo vía query params.
      Solo muestro usuarios con status: true.
    */
    try {
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [ total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}

export const deleteUser = async (req, res) => {
    /*
      En esta parte, en lugar de borrar al usuario de la DB,
      simplemente cambio su status a false, para conservar su registro.
    */
    try {
        const { uid } = req.params
        const user = await User.findByIdAndUpdate(uid, { status: false }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            user
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        })
    }
}

export const updatePassword = async (req, res) => {
    /*
      Aquí actualizo la contraseña de un usuario, validando que la nueva
      no sea la misma que la anterior.
    */
    try {
        const { uid } = req.params
        const { newPassword } = req.body

        const user = await User.findById(uid)

        // Verifico si la nueva contraseña es igual a la anterior
        const matchOldAndNewPassword = await verify(user.password, newPassword)

        if(matchOldAndNewPassword){
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior"
            })
        }

        // Encripto la nueva contraseña
        const encryptedPassword = await hash(newPassword)
        await User.findByIdAndUpdate(uid, { password: encryptedPassword }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada"
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar contraseña",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    /*
      Aquí actualizo los datos de un usuario. 
      La idea es que solo ciertos campos sean modificables según rol y lógica de negocio.
    */
    try {
        const { uid } = req.params
        const data = req.body

        const user = await User.findByIdAndUpdate(uid, data, { new: true })

        return res.status(200).json({
            success: true,
            msg: "Usuario actualizado",
            user
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar usuario",
            error: err.message
        })
    }
}

export const updateProfilePicture = async (req, res) => {
    /*
      Aquí actualizo la foto de perfil, eliminando la anterior si existe.
    */
    try {
        const { uid } = req.params
        let newProfilePicture = req.file ? req.file.filename : null

        if(!newProfilePicture){
            return res.status(400).json({
                success: false,
                message: "No hay archivo en la petición"
            })
        }

        const user = await User.findById(uid)

        // Si ya tiene una foto de perfil, la borro del sistema de archivos
        if(user.profilePicture){
            const oldProfilePicture = join(__dirname, "../../public/uploads/profile-pictures", user.profilePicture)
            await fs.unlink(oldProfilePicture)
        }

        // Guardo la nueva foto en la BD
        user.profilePicture = newProfilePicture
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Foto de perfil actualizada",
            profilePicture: user.profilePicture
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la foto",
            error: err.message
        })
    }
}
