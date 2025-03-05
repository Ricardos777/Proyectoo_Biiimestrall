import Cart from "./cart.model.js"
import Product from "../product/product.model.js"

/*
  En este controlador defino la lógica para:
  - Obtener el carrito del usuario
  - Agregar un producto al carrito
  - Actualizar la cantidad de un producto
  - Eliminar un producto del carrito
*/

export const getCart = async (req, res) => {
  try {
    // El usuario que hace la petición está en req.user (gracias a validateJWT)
    const userId = req.user._id

    // Busco el carrito asociado a ese usuario
    let cart = await Cart.findOne({ user: userId }).populate("items.product", "name price")

    // Si no existe, devuelvo un arreglo vacío
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          user: userId,
          items: []
        }
      })
    }

    return res.status(200).json({
      success: true,
      cart
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el carrito",
      error: error.message
    })
  }
}

export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user._id
    const { productId, quantity } = req.body

    // Verifico si existe el producto
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      })
    }

    // Busco o creo el carrito del usuario
    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] })
    }

    // Verifico si el producto ya existe en el carrito
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId)
    if (existingItemIndex >= 0) {
      // Si existe, incremento la cantidad
      cart.items[existingItemIndex].quantity += quantity || 1
    } else {
      // Si no existe, lo agrego con la cantidad indicada
      cart.items.push({ product: productId, quantity: quantity || 1 })
    }

    await cart.save()

    return res.status(200).json({
      success: true,
      message: "Producto agregado al carrito",
      cart
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al agregar producto al carrito",
      error: error.message
    })
  }
}

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id
    const { productId, newQuantity } = req.body

    // Verifico si el producto existe
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      })
    }

    // Busco el carrito
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "El usuario no tiene un carrito aún"
      })
    }

    // Busco el item en el carrito
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId)
    if (existingItemIndex < 0) {
      return res.status(404).json({
        success: false,
        message: "El producto no se encuentra en el carrito"
      })
    }

    // Actualizo la cantidad
    cart.items[existingItemIndex].quantity = newQuantity

    // Si la cantidad es 0, remuevo el producto del carrito
    if (newQuantity <= 0) {
      cart.items.splice(existingItemIndex, 1)
    }

    await cart.save()

    return res.status(200).json({
      success: true,
      message: "Carrito actualizado",
      cart
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el carrito",
      error: error.message
    })
  }
}

export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user._id
    const { productId } = req.body

    // Verifico si el producto existe
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      })
    }

    // Busco el carrito
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "El usuario no tiene un carrito aún"
      })
    }

    // Remuevo el producto del arreglo
    cart.items = cart.items.filter(item => item.product.toString() !== productId)

    await cart.save()

    return res.status(200).json({
      success: true,
      message: "Producto eliminado del carrito",
      cart
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el producto del carrito",
      error: error.message
    })
  }
}
