/*
  Aquí centralizo el manejo de errores que vengan desde express-validator
  u otros lugares. Si hay errores de validación, devuelvo status 400,
  si no, 500.
*/

export const handleErrors = (err, req, res, next) => {
    if (err.status === 400 || err.errors) {
        return res.status(400).json({
            success: false,
            errors: err.errors
        })
    }
    return res.status(500).json({
        success: false,
        message: err.message
    })
}
