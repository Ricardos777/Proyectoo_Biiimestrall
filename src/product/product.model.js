import { Schema, model } from "mongoose"

/*
  En este esquema defino la estructura de un producto.
  Los campos incluyen:
  - name: Nombre del producto (obligatorio).
  - description: Descripción del producto.
  - price: Precio del producto (obligatorio, numérico).
  - inventory: Cantidad en inventario (por defecto 0).
  - sold: Número de unidades vendidas (por defecto 0).
  - category: Referencia a la categoría del producto (opcional).
  - isSoldOut: Flag que indica si el producto está agotado (se marca automáticamente si el inventario es 0).
*/
const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre del producto es obligatorio"]
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: [true, "El precio es obligatorio"]
  },
  inventory: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  isSoldOut: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false,
  timestamps: true
})

export default model("Product", productSchema)
