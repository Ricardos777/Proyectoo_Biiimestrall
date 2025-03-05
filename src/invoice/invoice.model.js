import { Schema, model } from "mongoose"

/*
  Defino el esquema de la factura (Invoice):
  - user: referencia al usuario que realizó la compra
  - items: arreglo con el detalle de productos comprados (productId, name, price, quantity, subtotal)
  - total: monto total de la factura
  - date: fecha de emisión (se setea automáticamente con timestamps)
*/
const invoiceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      name: String,
      price: Number,
      quantity: Number,
      subtotal: Number
    }
  ],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
})

export default model("Invoice", invoiceSchema)
