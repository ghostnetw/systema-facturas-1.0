"use client"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Download, Eye, Trash2 } from "lucide-react"
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
import { ToastAction } from "@/components/ui/toast"
import { downloadInvoicePDF } from "@/services/pdf-service"

export default function InvoicesPage() {
  const { invoices, deleteInvoice } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.cif.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteInvoice = (id: string) => {
    deleteInvoice(id)
    toast({
      title: "Factura eliminada",
      description: `La factura ${id} ha sido eliminada correctamente.`,
      action: <ToastAction altText="Deshacer">Deshacer</ToastAction>,
    })
  }

  const handleDownloadPDF = (id: string) => {
    const invoice = invoices.find((inv) => inv.id === id)
    if (invoice) {
      try {
        downloadInvoicePDF(invoice)
        toast({
          title: "PDF generado",
          description: `La factura ${id} se ha descargado correctamente.`,
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

  const handleExportAll = () => {
    try {
      // Crear un archivo CSV con todas las facturas
      const headers = ["Nº Factura", "Cliente", "CIF", "Base", "IVA", "Total", "Estado", "Fecha", "Vencimiento"]
      const csvContent = [
        headers.join(","),
        ...filteredInvoices.map((invoice) =>
          [
            invoice.id,
            `"${invoice.client.replace(/"/g, '""')}"`, // Escapar comillas
            invoice.cif,
            invoice.amount.replace("€", "").trim(),
            invoice.tax.replace("€", "").trim(),
            invoice.total.replace("€", "").trim(),
            invoice.status,
            invoice.date,
            invoice.dueDate,
          ].join(","),
        ),
      ].join("\n")

      // Crear un blob y descargarlo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", "facturas.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Exportación completada",
        description: "Se han exportado todas las facturas a CSV.",
      })
    } catch (error) {
      console.error("Error al exportar:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al exportar las facturas.",
        variant: "destructive",
      })
    }
  }

  return (
    <LayoutWithSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestión de Facturas</h1>
          <Button asChild>
            <Link href="/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Factura
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Facturas</CardTitle>
            <CardDescription>Gestiona todas las facturas de tu empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar facturas..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportAll}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>CIF</TableHead>
                    <TableHead>Base</TableHead>
                    <TableHead>IVA (21%)</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        <Link href={`/invoices/${invoice.id}`} className="hover:underline">
                          {invoice.id}
                        </Link>
                      </TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>{invoice.cif}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>{invoice.tax}</TableCell>
                      <TableCell className="font-medium">{invoice.total}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/invoices/${invoice.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDownloadPDF(invoice.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setInvoiceToDelete(invoice.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la factura{" "}
                                  {invoice.id} y no podrá ser recuperada.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteInvoice(invoice.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWithSidebar>
  )
}

