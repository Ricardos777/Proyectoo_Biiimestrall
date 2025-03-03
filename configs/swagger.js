import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Sales Management API",
            version: "1.0.0",
            description: "API para la gestión de ventas y usuarios",
            contact: {
                name: "Soporte de Proyecto Bimestral",
                email: "soporte@bimestral.org"
            }
        },
        servers: [
            {
                url: "http://127.0.0.1:3000/salesSystem/v1"
            }
        ]
    },
    apis: [
        "./src/auth/*.js",
        "./src/user/*.js"
    ]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)

export { swaggerDocs, swaggerUi }
