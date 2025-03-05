import { hash, verify } from "argon2"
import User from "./user.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params
    const user = await User.findById(uid)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      })
    }

    return res.status(200).json({
      success: true,
      user
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el usuario",
      error: err.message
    })
  }
}

export const getUsers = async (req, res) => {
  try {
    const { limite = 5, desde = 0 } = req.query
    const query = { status: true }

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(Number(desde)).limit(Number(limite))
    ])

    return res.status(200).json({
      success: true,
      total,
      users
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: err.message
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params

    // Verifico que el usuario que realiza la acción esté autorizado
    // Un CLIENT solo puede eliminarse a sí mismo
    // Un ADMIN puede eliminar solo usuarios CLIENT (no a otros ADMIN)
    const requester = req.user
    const targetUser = await User.findById(uid)
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      })
    }
    if (requester.role !== "ADMIN" && requester._id.toString() !== uid) {
      return res.status(401).json({
        success: false,
        message: "No tienes permiso para eliminar este usuario"
      })
    }
    if (requester.role === "ADMIN" && targetUser.role === "ADMIN") {
      return res.status(401).json({
        success: false,
        message: "Un administrador no puede eliminar a otro administrador"
      })
    }

    const user = await User.findByIdAndUpdate(uid, { status: false }, { new: true })

    return res.status(200).json({
      success: true,
      message: "Usuario eliminado",
      user
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el usuario",
      error: err.message
    })
  }
}

export const updatePassword = async (req, res) => {
  try {
    const { uid } = req.params
    const { newPassword } = req.body

    const user = await User.findById(uid)

    const matchOldAndNewPassword = await verify(user.password, newPassword)

    if (matchOldAndNewPassword) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña no puede ser igual a la anterior"
      })
    }

    const encryptedPassword = await hash(newPassword)
    await User.findByIdAndUpdate(uid, { password: encryptedPassword }, { new: true })

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada"
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar contraseña",
      error: err.message
    })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params
    const data = req.body

    // Obtengo el usuario que hace la petición y el usuario objetivo
    const requester = req.user
    const targetUser = await User.findById(uid)
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      })
    }

    // Validación de permisos:
    // - Si el que hace la petición es CLIENT, solo puede actualizar su propio registro
    if (requester.role !== "ADMIN" && requester._id.toString() !== uid) {
      return res.status(401).json({
        success: false,
        message: "No tienes permiso para actualizar este usuario"
      })
    }

    // - Si el que hace la petición es ADMIN, no puede actualizar a otro ADMIN
    if (requester.role === "ADMIN" && targetUser.role === "ADMIN") {
      return res.status(401).json({
        success: false,
        message: "Un administrador no puede actualizar a otro administrador"
      })
    }

    // Si se envía password, se encripta antes de actualizar
    if (data.password) {
      data.password = await hash(data.password)
    }

    const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true })

    return res.status(200).json({
      success: true,
      msg: "Usuario actualizado",
      user: updatedUser
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
  try {
    const { uid } = req.params
    let newProfilePicture = req.file ? req.file.filename : null

    if (!newProfilePicture) {
      return res.status(400).json({
        success: false,
        message: "No hay archivo en la petición"
      })
    }

    const user = await User.findById(uid)

    if (user.profilePicture) {
      const oldProfilePicture = join(__dirname, "../../public/uploads/profile-pictures", user.profilePicture)
      await fs.unlink(oldProfilePicture)
    }

    user.profilePicture = newProfilePicture
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Foto de perfil actualizada",
      profilePicture: user.profilePicture
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la foto",
      error: err.message
    })
  }
}

/*
  Función deleteAccount:
  Permite que el usuario autenticado (CLIENT) elimine su propia cuenta.
  Se requiere enviar la contraseña de confirmación en el body.
*/
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Se requiere confirmar la contraseña para eliminar la cuenta"
      })
    }
    // El usuario autenticado se obtiene de req.user
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      })
    }
    const isValid = await verify(user.password, password)
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "La contraseña de confirmación es incorrecta"
      })
    }
    // Marco la cuenta como eliminada (status false)
    user.status = false
    await user.save()
    return res.status(200).json({
      success: true,
      message: "Cuenta eliminada correctamente"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la cuenta",
      error: error.message
    })
  }
}
