import Invoice from "./invoice.model.js"
import Cart from "../cart/cart.model.js"
import Product from "../product/product.model.js"
import PDFDocument from "pdfkit"

/*
  Función checkout:
  - Obtiene el carrito del usuario autenticado.
  - Valida stock de cada producto.
  - Descuenta el inventario e incrementa 'sold'.
  - Crea la factura en la base de datos.
  - Genera y envía un PDF con la factura.
*/
export const checkout = async (req, res) => {
  try {
    const userId = req.user._id
    const cart = await Cart.findOne({ user: userId }).populate("items.product", "name price inventory sold")
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "El carrito está vacío o no existe" })
    }
    let invoiceItems = []
    let totalAmount = 0
    for (let item of cart.items) {
      const productDoc = item.product
      if (!productDoc) {
        return res.status(404).json({ success: false, message: "Un producto del carrito no existe en la base de datos" })
      }
      if (productDoc.inventory < item.quantity) {
        return res.status(400).json({ success: false, message: `No hay suficiente stock del producto: ${productDoc.name}` })
      }
      const subtotal = productDoc.price * item.quantity
      totalAmount += subtotal
      invoiceItems.push({
        productId: productDoc._id,
        name: productDoc.name,
        price: productDoc.price,
        quantity: item.quantity,
        subtotal
      })
    }
    for (let item of cart.items) {
      const productDoc = item.product
      productDoc.inventory -= item.quantity
      productDoc.sold += item.quantity
      await productDoc.save()
    }
    const invoice = await Invoice.create({
      user: userId,
      items: invoiceItems,
      total: totalAmount
    })
    // Limpio el carrito (según la lógica de negocio)
    cart.items = []
    await cart.save()
    
    // Genero el PDF usando pdfkit
    const doc = new PDFDocument({ margin: 50 })
    let chunks = []
    doc.on("data", chunk => chunks.push(chunk))
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks)
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename=factura_${invoice._id}.pdf`)
      return res.send(pdfBuffer)
    })
    
    // Cabecera de la factura
    doc.fontSize(20).text("Factura de Compra", { align: "center" })
    doc.moveDown()
    doc.fontSize(12).text(`Factura ID: ${invoice._id}`)
    doc.text(`Fecha: ${invoice.createdAt.toLocaleString()}`)
    doc.text(`Cliente (UserID): ${userId}`)
    doc.moveDown()
    doc.text("Detalle de productos:", { underline: true })
    invoiceItems.forEach(item => {
      doc.text(`- ${item.name} (cant: ${item.quantity}) - Q${item.price} c/u  => Subtotal: Q${item.subtotal}`)
    })
    doc.moveDown()
    doc.fontSize(14).text(`Total: Q${invoice.total}`, { bold: true })
    
    doc.end()
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al confirmar la compra", error: error.message })
  }
}

/*
  Función getInvoicesByUser:
  - Obtiene todas las facturas de un usuario.
  - Si el usuario autenticado es CLIENT, solo puede ver sus propias facturas.
  - Los ADMIN pueden ver las facturas de cualquier usuario.
*/
export const getInvoicesByUser = async (req, res) => {
  try {
    const { userId } = req.params
    const requester = req.user
    if (requester.role !== "ADMIN" && requester._id.toString() !== userId) {
      return res.status(401).json({ success: false, message: "No tienes permiso para ver las facturas de otro usuario" })
    }
    const invoices = await Invoice.find({ user: userId })
    return res.status(200).json({ success: true, invoices })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al obtener las facturas", error: error.message })
  }
}

/*
  Función getInvoiceById:
  - Obtiene los detalles de una factura específica.
  - Los CLIENT solo pueden ver su propia factura; ADMIN pueden ver cualquier factura.
*/
export const getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params
    const invoice = await Invoice.findById(invoiceId)
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Factura no encontrada" })
    }
    const requester = req.user
    if (requester.role !== "ADMIN" && invoice.user.toString() !== requester._id.toString()) {
      return res.status(401).json({ success: false, message: "No tienes permiso para ver esta factura" })
    }
    return res.status(200).json({ success: true, invoice })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al obtener la factura", error: error.message })
  }
}

/*
  Función updateInvoice (solo ADMIN):
  - Permite actualizar una factura.
  - Para cada item, se valida stock y se ajusta el inventario y 'sold' según la diferencia.
  - Se recalcula el total de la factura.
*/
export const updateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params
    const newItems = req.body.items
    if (!newItems || !Array.isArray(newItems)) {
      return res.status(400).json({ success: false, message: "Se requiere un arreglo de items para actualizar la factura" })
    }
    const requester = req.user
    if (requester.role !== "ADMIN") {
      return res.status(401).json({ success: false, message: "Solo administradores pueden actualizar facturas" })
    }
    const invoice = await Invoice.findById(invoiceId)
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Factura no encontrada" })
    }
    for (let newItem of newItems) {
      const { productId, quantity: newQuantity } = newItem
      const productDoc = await Product.findById(productId)
      if (!productDoc) {
        return res.status(404).json({ success: false, message: `Producto con ID ${productId} no encontrado` })
      }
      const index = invoice.items.findIndex(item => item.productId.toString() === productId)
      if (index === -1) {
        // Agrego el producto si no existe en la factura
        if (productDoc.inventory < newQuantity) {
          return res.status(400).json({ success: false, message: `No hay suficiente stock para el producto ${productDoc.name}` })
        }
        productDoc.inventory -= newQuantity
        productDoc.sold += newQuantity
        await productDoc.save()
        const subtotal = productDoc.price * newQuantity
        invoice.items.push({ productId: productDoc._id, name: productDoc.name, price: productDoc.price, quantity: newQuantity, subtotal })
      } else {
        // Si el item ya existe, actualizo la cantidad y subtotal
        const oldItem = invoice.items[index]
        const diff = newQuantity - oldItem.quantity
        if (diff > 0) {
          if (productDoc.inventory < diff) {
            return res.status(400).json({ success: false, message: `No hay suficiente stock para aumentar la cantidad del producto ${productDoc.name}` })
          }
          productDoc.inventory -= diff
          productDoc.sold += diff
        } else if (diff < 0) {
          productDoc.inventory += (-diff)
          productDoc.sold -= (-diff)
        }
        await productDoc.save()
        oldItem.quantity = newQuantity
        oldItem.subtotal = productDoc.price * newQuantity
        invoice.items[index] = oldItem
      }
    }
    let newTotal = 0
    invoice.items.forEach(item => {
      newTotal += item.subtotal
    })
    invoice.total = newTotal
    await invoice.save()
    return res.status(200).json({ success: true, message: "Factura actualizada correctamente", invoice })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al actualizar la factura", error: error.message })
  }
}

/*
  Función getPurchaseHistory:
  - Obtiene el historial de compras del usuario autenticado (facturas).
*/
export const getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user._id
    const invoices = await Invoice.find({ user: userId })
    return res.status(200).json({
      success: true,
      invoices
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el historial de compras",
      error: error.message
    })
  }
}
