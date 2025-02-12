/*
  Este middleware se encarga de eliminar el archivo que se subió
  en caso de que ocurra un error posterior en la cadena de middlewares.
*/

import fs from "fs/promises"
import { join } from "path"

export const deleteFileOnError = async (err, req, res, next) => {
    if (req.file && req.filePath) {
        const filePath = join(req.filePath, req.file.filename)
        try {
            await fs.unlink(filePath)
        } catch (unlinkErr) {
            console.log(`Error deleting file: ${unlinkErr}`)
        }
    }
    next(err)
}
