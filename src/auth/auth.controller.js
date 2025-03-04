/*
  En este controlador manejo las funcionalidades de registro e inicio de sesión de usuarios.
  Uso la librería 'argon2' para encriptar la contraseña y 'jsonwebtoken' para generar tokens.
*/

import { hash, verify } from "argon2"
import User from "../user/user.model.js"
import { generateJWT } from "../helpers/generate-jwt.js"

export const register = async (req, res) => {
    try {
        // Tomo la información del cuerpo de la petición
        const data = req.body
        
        // Verifico si viene un archivo de imagen para perfil
        let profilePicture = req.file ? req.file.filename : null

        // Encripto la contraseña usando argon2
        const encryptedPassword = await hash(data.password)
        data.password = encryptedPassword
        data.profilePicture = profilePicture

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
    /*
      En esta parte manejo la lógica de inicio de sesión.  
      Verifico si el usuario existe por email o username,
      comparo la contraseña encriptada y genero un token.
    */
    const { email, username, password } = req.body
    try {
        const user = await User.findOne({
            $or:[{email: email}, {username: username}]
        })

        if(!user){
            return res.status(400).json({
                message: "Credenciales inválidas",
                error:"No existe el usuario o correo ingresado"
            })
        }

        const validPassword = await verify(user.password, password)

        if(!validPassword){
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
    } catch(err) {
        return res.status(500).json({
            message: "login fallido, error del servidor, comuniquese al PBX: 5449-8235",
            error: err.message
        })
    }
}
