import Product from "./product.model.js"

/*
  Función para crear un producto.
  Si el inventario es 0, marco el producto como agotado.
*/
export const createProduct = async (req, res) => {
  try {
    const data = req.body

    // Calculo el flag de agotado según el inventario
    data.isSoldOut = Number(data.inventory) === 0

    const product = await Product.create(data)

    return res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      product
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al crear el producto",
      error: error.message
    })
  }
}

/*
  Función para obtener la lista de productos.
  Permite filtrar por:
    - soldOut (true/false)
    - ordenar por cantidad vendida si se desea obtener los más vendidos
  También se pueden agregar otros filtros o paginación si se requiere.
*/
export const getProducts = async (req, res) => {
  try {
    const { soldOut, mostSold, limite = 10, desde = 0 } = req.query

    let query = {}
    if (soldOut !== undefined) {
      query.isSoldOut = soldOut === "true"
    }

    let productsQuery = Product.find(query)
      .skip(Number(desde))
      .limit(Number(limite))

    // Si se solicita obtener los productos más vendidos, ordeno por el campo "sold" de forma descendente
    if (mostSold === "true") {
      productsQuery = productsQuery.sort({ sold: -1 })
    }

    const products = await productsQuery

    return res.status(200).json({
      success: true,
      products
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      error: error.message
    })
  }
}

/*
  Función para obtener un producto por su ID.
*/
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      })
    }
    return res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el producto",
      error: error.message
    })
  }
}

/*
  Función para actualizar un producto.
  Si se actualiza el inventario, recalculo el flag isSoldOut.
*/
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    if (data.inventory !== undefined) {
      data.isSoldOut = Number(data.inventory) === 0
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Producto actualizado correctamente",
      product: updatedProduct
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      error: error.message
    })
  }
}

/*
  Función para eliminar un producto.
  Se elimina el producto de la base de datos.
*/
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Producto eliminado correctamente"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el producto",
      error: error.message
    })
  }
}

/*
  Función para obtener los productos más vendidos.
  Se ordenan todos los productos en forma descendente por el campo "sold" y se limitan los resultados.
*/
export const getMostSoldProducts = async (req, res) => {
  try {
    const { limite = 5 } = req.query
    const products = await Product.find().sort({ sold: -1 }).limit(Number(limite))
    return res.status(200).json({
      success: true,
      products
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los productos más vendidos",
      error: error.message
    })
  }
}