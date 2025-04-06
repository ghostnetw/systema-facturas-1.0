import type { Invoice } from "@/types/schema"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function generateInvoicePDF(invoice: Invoice) {
  // Crear un nuevo documento PDF
  const doc = new jsPDF()

  // Añadir información de la empresa
  doc.setFontSize(20)
  doc.text("RESINA ROSARIO, S.L.", 14, 22)

  doc.setFontSize(10)
  doc.text("CIF: B12345678", 14, 30)
  doc.text("Calle Ejemplo, 123", 14, 35)
  doc.text("28001 Madrid", 14, 40)
  doc.text("Tel: 912345678", 14, 45)
  doc.text("Email: info@resinarosario.com", 14, 50)

  // Añadir información de la factura
  doc.setFontSize(16)
  doc.text(`Factura: ${invoice.id}`, 140, 30)

  doc.setFontSize(10)
  doc.text(`Fecha: ${invoice.date}`, 140, 38)
  doc.text(`Vencimiento: ${invoice.dueDate}`, 140, 43)

  // Estado de la factura
  let statusColor = [0, 0, 0] // Negro por defecto
  if (invoice.status === "Pagada") {
    statusColor = [0, 128, 0] // Verde
  } else if (invoice.status === "Vencida") {
    statusColor = [255, 0, 0] // Rojo
  } else {
    statusColor = [255, 165, 0] // Naranja para pendiente
  }

  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
  doc.text(`Estado: ${invoice.status}`, 140, 48)
  doc.setTextColor(0, 0, 0) // Volver a negro

  // Línea separadora
  doc.line(14, 55, 196, 55)

  // Información del cliente
  doc.setFontSize(12)
  doc.text("Cliente:", 14, 65)

  doc.setFontSize(10)
  doc.text(invoice.client, 14, 72)
  doc.text(`CIF: ${invoice.cif}`, 14, 77)

  // Tabla de conceptos
  doc.setFontSize(12)
  doc.text("Conceptos:", 14, 90)

  if (invoice.items && invoice.items.length > 0) {
    const tableColumn = ["Descripción", "Precio (€)", "IVA (%)", "Total (€)"]
    const tableRows = invoice.items.map((item) => {
      // Handle both old and new format items
      const price = "price" in item ? item.price : (item as any).price
      const tax = "tax" in item ? item.tax : (item as any).tax

      return [item.description, price.toFixed(2), `${tax}%`, (price * (1 + tax / 100)).toFixed(2)]
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 95,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    })
  } else {
    // Si no hay items, crear una tabla con datos de la factura
    const baseAmount = invoice.amount.replace("€", "").trim()
    const taxAmount = invoice.tax.replace("€", "").trim()

    autoTable(doc, {
      head: [["Descripción", "Base Imponible", "IVA (21%)", "Total"]],
      body: [["Servicios prestados", baseAmount, taxAmount, invoice.total.replace("€", "").trim()]],
      startY: 95,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    })
  }

  // Calcular la posición Y después de la tabla
  const finalY = (doc as any).lastAutoTable.finalY + 10

  // Totales
  doc.setFontSize(10)
  doc.text("Base Imponible:", 130, finalY + 10)
  doc.text(invoice.amount, 180, finalY + 10, { align: "right" })

  doc.text("IVA:", 130, finalY + 15)
  doc.text(invoice.tax, 180, finalY + 15, { align: "right" })

  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text("Total:", 130, finalY + 25)
  doc.text(invoice.total, 180, finalY + 25, { align: "right" })
  doc.setFont(undefined, "normal")

  // Información de pago
  doc.setFontSize(10)
  doc.text("Forma de pago: Transferencia Bancaria", 14, finalY + 40)
  doc.text("IBAN: ES12 3456 7890 1234 5678 9012", 14, finalY + 45)

  // Notas
  doc.setFontSize(9)
  doc.text("Gracias por confiar en RESINA ROSARIO, S.L.", 14, finalY + 60)

  // Guardar el PDF
  return doc
}

export function downloadInvoicePDF(invoice: Invoice) {
  const doc = generateInvoicePDF(invoice)
  doc.save(`Factura_${invoice.id}.pdf`)
}

