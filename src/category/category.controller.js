import Category from "./category.model.js"
// Se asume que existe un modelo Product en ../product/product.model.js
// que tiene un campo "category" para referenciar la categoría del producto.
import Product from "../product/product.model.js" 

/*
  Función para crear la categoría predeterminada.
  La llamo al iniciar el servidor para asegurarme de que exista una categoría 'General'
  a la cual se reasignarán productos en caso de eliminar otra categoría.
*/
export const createDefaultCategory = async () => {
  try {
    const defaultCat = await Category.findOne({ default: true })
    if (!defaultCat) {
      await Category.create({
        name: "General",
        description: "Categoría predeterminada",
        default: true
      })
      console.log("Default category created.")
    } else {
      console.log("Default category already exists.")
    }
  } catch (error) {
    console.error("Error creating default category: ", error)
  }
}

/*
  Función para crear una nueva categoría.
  Si se intenta crear una categoría con 'default: true' y ya existe una predeterminada,
  se forzará a false para evitar duplicados.
*/
export const createCategory = async (req, res) => {
  try {
    const data = req.body
    if(data.default === true) {
      const existingDefault = await Category.findOne({ default: true })
      if(existingDefault) {
        data.default = false
      }
    }
    const category = await Category.create(data)
    return res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      category
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al crear la categoría",
      error: error.message
    })
  }
}

/*
  Función para obtener la lista de todas las categorías.
*/
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    return res.status(200).json({
      success: true,
      categories
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      error: error.message
    })
  }
}

/*
  Función para actualizar una categoría.
  Se permite modificar el nombre y la descripción, pero no el flag 'default'
  mediante este endpoint.
*/
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body
    // Evito actualizar el flag 'default' desde este endpoint
    delete data.default

    const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true })
    if(!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Categoría actualizada",
      category: updatedCategory
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la categoría",
      error: error.message
    })
  }
}

/*
  Función para eliminar una categoría.
  Antes de eliminarla, si existen productos asignados a la categoría,
  se actualizan para asignarlos a la categoría predeterminada.
  No se permite eliminar la categoría predeterminada.
*/
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const categoryToDelete = await Category.findById(id)
    if (!categoryToDelete) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      })
    }
    if (categoryToDelete.default) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar la categoría predeterminada"
      })
    }
    // Busco la categoría predeterminada
    const defaultCategory = await Category.findOne({ default: true })
    if (!defaultCategory) {
      return res.status(500).json({
        success: false,
        message: "No existe una categoría predeterminada para reasignar productos"
      })
    }
    // Actualizo todos los productos que tienen la categoría a eliminar para asignarles la predeterminada
    await Product.updateMany({ category: id }, { category: defaultCategory._id })
    // Elimino la categoría
    await Category.findByIdAndDelete(id)
    return res.status(200).json({
      success: true,
      message: "Categoría eliminada y productos reasignados a la categoría predeterminada"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la categoría",
      error: error.message
    })
  }
}