import { config } from "dotenv"
import { initServer } from "./configs/server.js"

// Aquí cargo las variables de entorno antes de inicializar el servidor
config()

// Inicio el servidor llamando a mi función initServer
initServer()

// Agrego este console.log para verificar que se está ejecutando el archivo principal
console.log("Estoy ejecutando este archivo de inicio del proyecto bimestral")
