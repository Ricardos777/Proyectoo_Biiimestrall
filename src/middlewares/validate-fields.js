/*
  Este middleware revisa si existen errores provenientes de express-validator
  y si los hay, los pasa a la siguiente función para que se manejen.
*/

import { validationResult } from "express-validator"

export const validateFields = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors)
    }
    next()
}
