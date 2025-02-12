"use strict"

// En este archivo defino la configuración del servidor
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"

// Importo únicamente las rutas que realmente necesito para la gestión de usuarios y autenticación
import authRoutes from "../src/auth/auth.routes.js"
import userRoutes from "../src/user/user.routes.js"

// Importo mi limitador de solicitudes
import apiLimiter from "../src/middlewares/rate-limit-validator.js"

// Importo la configuración de Swagger para la documentación
import { swaggerDocs, swaggerUi } from "./swagger.js"

// Aquí creo mis middlewares de forma modular
const middlewares = (app) => {
    // Uso de urlencoded y json para parsear la data que venga en requests
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())

    // Configuración de CORS para permitir peticiones de diferentes orígenes
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }))

    // Helmet para mayor seguridad, con directivas personalizadas
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", `http://localhost:${process.env.PORT}`],
                connectSrc: ["'self'", `http://localhost:${process.env.PORT}`],
                imgSrc: ["'self'", "data:"],
                styleSrc: ["'self'", "'unsafe-inline'"]
            },
        },
    }))

    // Morgan para el logging de peticiones en consola
    app.use(morgan("dev"))

    // Límite de peticiones (rate limiting)
    app.use(apiLimiter)
}

// Aquí defino las rutas que voy a usar en mi aplicación
const routes = (app) =>{
    // Para el registro y login de usuarios
    app.use("/salesSystem/v1/auth", authRoutes)

    // Para la gestión de usuarios (listar, obtener por id, eliminar, actualizar)
    app.use("/salesSystem/v1/user", userRoutes)

    // Ruta para la documentación generada con Swagger
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}

// Conecto a la base de datos
const conectarDB = async () =>{
    try {
        await dbConnection()
    } catch(err) {
        console.log(`Database connection failed: ${err}`)
        process.exit(1)
    }
}

// Inicializo mi servidor
export const initServer = () => {
    const app = express()
    try {
        middlewares(app)
        conectarDB()
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running on port ${process.env.PORT}`)
    } catch(err) {
        console.log(`Server init failed: ${err}`)
    }
}
