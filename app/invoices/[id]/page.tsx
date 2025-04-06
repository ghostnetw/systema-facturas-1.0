"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Edit, Printer, Trash2 } from "lucide-react"
import Link from "next/link"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import type { Invoice } from "@/types/schema"
import { downloadInvoicePDF } from "@/services/pdf-service"

export default function InvoiceDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { invoices, deleteInvoice, getInvoiceById } = useAppContext()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const foundInvoice = getInvoiceById(params.id as string)
      if (foundInvoice) {
        setInvoice(foundInvoice)
      }
      setLoading(false)
    }
  }, [params.id, getInvoiceById])

  const handleDeleteInvoice = () => {
    if (invoice) {
      deleteInvoice(invoice.id)
      toast({
        title: "Factura eliminada",
        description: `La factura ${invoice.id} ha sido eliminada correctamente.`,
      })
      router.push("/invoices")
    }
  }

  const handleDownloadPDF = () => {
    if (invoice) {
      try {
        downloadInvoicePDF(invoice)
        toast({
          title: "PDF generado",
          description: `La factura ${invoice.id} se ha descargado correctamente.`,
        })
      } catch (error) {
        console.error("Error al generar el PDF:", error)
        toast({
          title: "Error",
          description: "Ha ocurrido un error al generar el PDF.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePrint = () => {
    if (invoice) {
      try {
        const printWindow = window.open("", "_blank")
        if (!printWindow) {
          toast({
            title: "Error",
            description: "No se pudo abrir la ventana de impresión. Comprueba que no esté bloqueada por el navegador.",
            variant: "destructive",
          })
          return
        }

        printWindow.document.write(`
          <html>
            <head>
              <title>Factura ${invoice.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .company { font-size: 24px; font-weight: bold; }
                .invoice-info { text-align: right; }
                .client-info { margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .totals { text-align: right; margin-bottom: 30px; }
                .total { font-weight: bold; font-size: 18px; }
                .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #666; }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <div class="company">RESINA ROSARIO, S.L.</div>
                  <div>CIF: B12345678</div>
                  <div>Calle Ejemplo, 123</div>
                  <div>28001 Madrid</div>
                </div>
                <div class="invoice-info">
                  <div><strong>Factura:</strong> ${invoice.id}</div>
                  <div><strong>Fecha:</strong> ${invoice.date}</div>
                  <div><strong>Vencimiento:</strong> ${invoice.dueDate}</div>
                  <div><strong>Estado:</strong> ${invoice.status}</div>
                </div>
              </div>
              
              <div class="client-info">
                <h3>Cliente:</h3>
                <div>${invoice.client}</div>
                <div>CIF: ${invoice.cif}</div>
              </div>
              
              <h3>Conceptos:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Precio (€)</th>
                    <th>IVA (%)</th>
                    <th>Total (€)</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    invoice.items
                      ? invoice.items
                          .map(
                            (item) => `
                      <tr>
                        <td>${item.description}</td>
                        <td>${"price" in item ? item.price.toFixed(2) : (item as any).price.toFixed(2)}</td>
                        <td>${"tax" in item ? item.tax : (item as any).tax}%</td>
                        <td>${("price" in item ? item.price * (1 + item.tax / 100) : (item as any).price * (1 + (item as any).tax / 100)).toFixed(2)}</td>
                      </tr>
                    `,
                          )
                          .join("")
                      : `<tr>
                      <td colspan="4">No hay conceptos disponibles</td>
                    </tr>`
                  }
                </tbody>
              </table>
              
              <div class="totals">
                <div>Base Imponible: ${invoice.amount}</div>
                <div>IVA: ${invoice.tax}</div>
                <div class="total">Total: ${invoice.total}</div>
              </div>
              
              <div>
                <div>Forma de pago: Transferencia Bancaria</div>
                <div>IBAN: ES12 3456 7890 1234 5678 9012</div>
              </div>
              
              <div class="footer">
                Gracias por confiar en RESINA ROSARIO, S.L.
              </div>
            </body>
          </html>
        `)

        printWindow.document.close()
        printWindow.focus()

        // Esperar a que se cargue el contenido antes de imprimir
        setTimeout(() => {
          printWindow.print()
          // No cerramos la ventana para que el usuario pueda cancelar la impresión
        }, 500)
      } catch (error) {
        console.error("Error al imprimir:", error)
        toast({
          title: "Error",
          description: "Ha ocurrido un error al preparar la impresión.",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/invoices">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Cargando factura...</h1>
          </div>
        </div>
      </LayoutWithSidebar>
    )
  }

  if (!invoice) {
    return (
      <LayoutWithSidebar>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/invoices">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Factura no encontrada</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>La factura que estás buscando no existe o ha sido eliminada.</p>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/invoices">Volver a facturas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/invoices">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Factura {invoice.id}</h1>
            <Badge
              variant={
                invoice.status === "Pagada" ? "success" : invoice.status === "Pendiente" ? "outline" : "destructive"
              }
              className={
                invoice.status === "Pagada"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : invoice.status === "Pendiente"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
              }
            >
              {invoice.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/invoices/${invoice.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente la factura {invoice.id} y no podrá
                    ser recuperada.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteInvoice} className="bg-red-600 hover:bg-red-700">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Datos de Facturación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Datos de tu empresa</h3>
                <div className="rounded-md border p-4 bg-gray-50">
                  <p className="font-medium">RESINA ROSARIO, S.L.</p>
                  <p className="text-sm text-muted-foreground">CIF: B12345678</p>
                  <p className="text-sm text-muted-foreground">Calle Ejemplo, 123</p>
                  <p className="text-sm text-muted-foreground">28001 Madrid</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Datos del cliente</h3>
                <div className="rounded-md border p-4 bg-gray-50">
                  <p className="font-medium">{invoice.client}</p>
                  <p className="text-sm text-muted-foreground">CIF: {invoice.cif}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Factura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Número de Factura</p>
                  <p>{invoice.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fecha de Emisión</p>
                  <p>{invoice.date}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Fecha de Vencimiento</p>
                  <p>{invoice.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <Badge
                    variant={
                      invoice.status === "Pagada"
                        ? "success"
                        : invoice.status === "Pendiente"
                          ? "outline"
                          : "destructive"
                    }
                    className={
                      invoice.status === "Pagada"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : invoice.status === "Pendiente"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conceptos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Descripción</TableHead>
                    <TableHead>Precio (€)</TableHead>
                    <TableHead>IVA (%)</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items ? (
                    invoice.items.map((item) => {
                      // Handle both old and new format items
                      const price = "price" in item ? item.price : (item as any).price
                      const tax = "tax" in item ? item.tax : (item as any).tax

                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>€{price.toFixed(2)}</TableCell>
                          <TableCell>{tax}%</TableCell>
                          <TableCell className="font-medium">€{(price * (1 + tax / 100)).toFixed(2)}</TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No hay conceptos disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div></div>
            <div className="space-y-2 text-right">
              <div className="text-sm">
                Subtotal: <span className="font-medium">{invoice.amount}</span>
              </div>
              <div className="text-sm">
                IVA: <span className="font-medium">{invoice.tax}</span>
              </div>
              <div className="text-lg font-bold">Total: {invoice.total}</div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </LayoutWithSidebar>
  )
}

