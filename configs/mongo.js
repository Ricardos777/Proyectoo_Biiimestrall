'use strict'

// En este archivo establezco la conexión a la base de datos de MongoDB
import mongoose from "mongoose"

export const dbConnection = async () => {
    try {
        // Manejo de eventos de conexión para estar al tanto de cada cambio
        mongoose.connection.on("error", () =>{
            console.log("MongoDB | could not be connect to MongoDB")
            mongoose.disconnect()
        })
        mongoose.connection.on("connecting", () =>{
            console.log("MongoDB | trying to connect")
        })
        mongoose.connection.on("connected", () =>{
            console.log("MongoDB | connected to MongoDB")
        })
        mongoose.connection.on("open", () =>{
            console.log("MongoDB | Connected to DataBase")
        })
        mongoose.connection.on("reconnected", () => {
            console.log("MongoDB | reconnected to MongoDB")
        })
        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB | disconnected from MongoDB")
        })

        // Aquí realizo la conexión usando las variables de entorno
        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        })
        
    } catch(err) {
        console.log(`Database connection failed: ${err}`)
    }
}
