import Invoice from "./invoice.model.js"
import Cart from "../cart/cart.model.js"
import Product from "../product/product.model.js"
import PDFDocument from "pdfkit"
import { Readable } from "stream"

/*
  Función para confirmar la compra y generar la factura en PDF.
  Pasos:
  1. Obtener el carrito del usuario.
  2. Validar stock de cada producto en el carrito.
  3. Descontar del inventario e incrementar 'sold'.
  4. Crear registro de factura en DB.
  5. Generar PDF y enviarlo en la respuesta.
*/
export const checkout = async (req, res) => {
  try {
    // Obtengo el ID del usuario autenticado
    const userId = req.user._id

    // Obtengo el carrito del usuario
    const cart = await Cart.findOne({ user: userId }).populate("items.product", "name price inventory sold")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El carrito está vacío o no existe"
      })
    }

    // Array para almacenar los detalles de la compra
    let invoiceItems = []
    let totalAmount = 0

    // Validar stock y preparar datos para la factura
    for (let item of cart.items) {
      const productDoc = item.product
      if (!productDoc) {
        return res.status(404).json({
          success: false,
          message: "Un producto del carrito no existe en la base de datos"
        })
      }
      // Verifico si hay suficiente stock
      if (productDoc.inventory < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `No hay suficiente stock del producto: ${productDoc.name}`
        })
      }
      // Calculo subtotal
      const subtotal = productDoc.price * item.quantity
      totalAmount += subtotal

      // Añado a la lista de items para la factura
      invoiceItems.push({
        productId: productDoc._id,
        name: productDoc.name,
        price: productDoc.price,
        quantity: item.quantity,
        subtotal
      })
    }

    // Si todo está OK, actualizo inventario y sold
    for (let item of cart.items) {
      const productDoc = item.product
      productDoc.inventory -= item.quantity
      productDoc.sold += item.quantity
      await productDoc.save()
    }

    // Creo la factura en la base de datos
    const invoice = await Invoice.create({
      user: userId,
      items: invoiceItems,
      total: totalAmount
    })

    // Limpio el carrito (opcional, depende de la lógica de negocio)
    cart.items = []
    await cart.save()

    // Genero el PDF
    const doc = new PDFDocument({ margin: 50 })

    // Convertir el documento a un buffer o stream
    let chunks = []
    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks)
      // Configuro cabeceras y envío el PDF
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename=factura_${invoice._id}.pdf`)
      return res.send(pdfBuffer)
    })

    // Cabecera de la factura
    doc.fontSize(20).text("Factura de Compra", { align: "center" })
    doc.moveDown()

    // Info general
    doc.fontSize(12).text(`Factura ID: ${invoice._id}`)
    doc.text(`Fecha: ${invoice.createdAt.toLocaleString()}`)
    doc.text(`Cliente (UserID): ${userId}`)
    doc.moveDown()

    // Detalle de productos
    doc.text("Detalle de productos:", { underline: true })
    invoiceItems.forEach((item) => {
      doc.text(`- ${item.name} (cant: ${item.quantity}) - Q${item.price} c/u  => Subtotal: Q${item.subtotal}`)
    })

    doc.moveDown()
    doc.fontSize(14).text(`Total: Q${invoice.total}`, { bold: true })

    doc.end()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al confirmar la compra",
      error: error.message
    })
  }
}
