import { hash, verify } from "argon2"
import User from "../user/user.model.js"
import { generateJWT } from "../helpers/generate-jwt.js"

/*
  Función para crear el usuario administrador por defecto.
  La creo solo si no existe ya uno con rol ADMIN.
*/
export const createDefaultAdmin = async () => {
  try {
    // Busco si ya existe un usuario con rol ADMIN
    const admin = await User.findOne({ role: "ADMIN" })
    if (!admin) {
      const defaultAdminData = {
        name: "Admin Default",
        surname: "Coperex",
        username: "admin",
        email: "admin@coperex.org",
        password: await hash("Admin123!"), // contraseña por defecto; se recomienda cambiarla
        phone: "12345678",
        role: "ADMIN",
        status: true
      }
      await User.create(defaultAdminData)
      console.log("Default admin user created.")
    } else {
      console.log("Default admin already exists.")
    }
  } catch (error) {
    console.error("Error creating default admin: ", error)
  }
}

/*
  Registro de usuarios.
  Modifico esta función para que, al registrar un usuario, el rol se fije siempre en CLIENT.
*/
export const register = async (req, res) => {
  try {
    // Tomo la información del cuerpo de la petición
    const data = req.body

    // Si se envía una imagen para el perfil, la asigno; sino, null
    let profilePicture = req.file ? req.file.filename : null

    // Encripto la contraseña usando argon2
    const encryptedPassword = await hash(data.password)
    data.password = encryptedPassword
    data.profilePicture = profilePicture

    // Forzo el rol a "CLIENT" para cualquier registro normal
    data.role = "CLIENT"

    // Creo el usuario en la base de datos
    const user = await User.create(data)

    return res.status(201).json({
      message: "User has been created",
      name: user.name,
      email: user.email
    })
  } catch (err) {
    return res.status(500).json({
      message: "User registration failed",
      error: err.message
    })
  }
}

export const login = async (req, res) => {
  const { email, username, password } = req.body
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }]
    })

    if (!user) {
      return res.status(400).json({
        message: "Credenciales inválidas",
        error: "No existe el usuario o correo ingresado"
      })
    }

    const validPassword = await verify(user.password, password)

    if (!validPassword) {
      return res.status(400).json({
        message: "Credenciales inválidas",
        error: "Contraseña incorrecta"
      })
    }

    // Genero el JWT
    const token = await generateJWT(user.id)

    return res.status(200).json({
      message: "Login completado exitosamente",
      userDetails: {
        token: token,
        profilePicture: user.profilePicture
      }
    })
  } catch (err) {
    return res.status(500).json({
      message: "login fallido, error del servidor, comuniquese al PBX: 5449-8235",
      error: err.message
    })
  }
}