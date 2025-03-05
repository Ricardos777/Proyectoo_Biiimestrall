import Product from "./product.model.js"

/*
  En este controlador implemento la exploración de productos para el cliente.
  Permito filtrar por categoría y buscar por nombre (usando una búsqueda case-insensitive).
  También se implementa la paginación mediante 'limite' y 'desde'.
*/
export const exploreProducts = async (req, res) => {
  try {
    const { category, search, limite = 10, desde = 0 } = req.query;
    let query = {};

    // Filtrar por categoría, si se envía
    if (category) {
      query.category = category;
    }

    // Buscar productos por nombre (búsqueda case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .skip(Number(desde))
      .limit(Number(limite));

    return res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al explorar los productos",
      error: error.message
    });
  }
};

/*
  Función para obtener los productos más vendidos desde la perspectiva del cliente.
  Se ordenan los productos por la cantidad vendida de forma descendente y se limita la cantidad de resultados.
*/
export const getClientMostSoldProducts = async (req, res) => {
  try {
    const { limite = 5 } = req.query;
    const products = await Product.find().sort({ sold: -1 }).limit(Number(limite));
    return res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los productos más vendidos",
      error: error.message
    });
  }
};
