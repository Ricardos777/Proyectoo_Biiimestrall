import { Schema, model } from "mongoose"

/*
  En este esquema defino la estructura de una categoría.
  Cada categoría tiene un nombre, una descripción opcional y un flag 'default'
  que indica si es la categoría predeterminada. Solo debe existir una categoría predeterminada.
*/
const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true
  },
  description: {
    type: String,
    default: ""
  },
  default: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false,
  timestamps: true
})

export default model("Category", categorySchema)