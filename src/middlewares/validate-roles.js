/*
  En este middleware verifico que el usuario tenga alguno de los roles permitidos.
  Para este proyecto defino ADMIN y CLIENT como roles válidos.
*/

export const hasRoles = (...roles) => {
    return(req, res, next) => {
        if(!req.usuario){
            return res.status(500).json({
                success: false,
                message: "Se requiere validar el role después de validar el token"
            })
        }


        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                success: false,
                message: `Usuario no autorizado, el recurso requiere uno de los siguientes roles: ${roles}`
            })
        }
        next()
    }
}