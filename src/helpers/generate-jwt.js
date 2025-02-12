/*
  Aquí creo una función para generar el token JWT a partir del uid del usuario
  usando la clave secreta definida en las variables de entorno.
*/

import jwt from "jsonwebtoken"

export const generateJWT = (uid = "") => {
    return new Promise((resolve, reject) => {
        const payload = { uid }

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: "1h"
            },
            (err, token) => {
                if(err){
                    reject({
                        success: false,
                        message: err
                    })
                } else {
                    resolve(token)
                }
            }
        )
    })
}
