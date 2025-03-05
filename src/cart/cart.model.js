import { Schema, model } from "mongoose"

/*
  Defino el esquema de Carrito:
  - user: Referencia al usuario que posee el carrito. Es único para cada usuario (1 usuario = 1 carrito).
  - items: Arreglo de objetos con:
    - product: Referencia al producto
    - quantity: Cantidad de ese producto en el carrito
*/
const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
}, {
  timestamps: true,
  versionKey: false
})

export default model("Cart", cartSchema)