"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import { toast } from "@/components/ui/use-toast"
import type { Invoice, InvoiceItem } from "@/types/schema"

export default function EditInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const { clients, invoices, updateInvoice, getInvoiceById } = useAppContext()

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  const [selectedClient, setSelectedClient] = useState<number | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceDate, setInvoiceDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState<"Pagada" | "Pendiente" | "Vencida">("Pendiente")
  const [paymentMethod, setPaymentMethod] = useState("transfer")
  const [notes, setNotes] = useState("")

  const [items, setItems] = useState<InvoiceItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (params.id) {
      const foundInvoice = getInvoiceById(params.id as string)
      if (foundInvoice) {
        setInvoice(foundInvoice)

        // Set form values
        setInvoiceNumber(foundInvoice.id)

        // Convert date from DD/MM/YYYY to YYYY-MM-DD for input[type="date"]
        const convertDate = (dateStr: string) => {
          const [day, month, year] = dateStr.split("/")
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
        }

        setInvoiceDate(convertDate(foundInvoice.date))
        setDueDate(convertDate(foundInvoice.dueDate))
        setStatus(foundInvoice.status)

        // Find client by name
        const client = clients.find((c) => c.name === foundInvoice.client)
        if (client) {
          setSelectedClient(client.id)
        }

        // Set items or create a default one
        if (foundInvoice.items && foundInvoice.items.length > 0) {
          // Convert old format items to new format if needed
          const convertedItems = foundInvoice.items.map((item) => {
            if ("quantity" in item) {
              // Old format with quantity
              const oldItem = item as any
              return {
                id: oldItem.id,
                description: oldItem.description,
                price: oldItem.price * oldItem.quantity, // Multiply price by quantity
                tax: oldItem.tax,
              }
            }
            return item
          })

          setItems(convertedItems)
          calculateTotals(convertedItems)
        } else {
          const defaultItem = { id: 1, description: "", price: 0, tax: 21 }
          setItems([defaultItem])
        }
      }
      setLoading(false)
    }
  }, [params.id, getInvoiceById, clients])

  const addItem = () => {
    const newItem = {
      id: items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1,
      description: "",
      price: 0,
      tax: 21,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      const updatedItems = items.filter((item) => item.id !== id)
      setItems(updatedItems)
      calculateTotals(updatedItems)
    }
  }

  const updateItem = (id: number, field: string, value: any) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value }
      }
      return item
    })
    setItems(updatedItems)
    calculateTotals(updatedItems)
  }

  const calculateTotals = (currentItems: InvoiceItem[]) => {
    const sub = currentItems.reduce((acc, item) => {
      return acc + item.price
    }, 0)

    const tax = currentItems.reduce((acc, item) => {
      return acc + item.price * (item.tax / 100)
    }, 0)

    setSubtotal(sub)
    setTaxAmount(tax)
    setTotal(sub + tax)
  }

  const handleSubmit = () => {
    if (!invoice) return

    // Validate form
    if (!invoiceNumber || !invoiceDate || !dueDate || !selectedClient || items.some((item) => !item.description)) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    // Get selected client
    const client = clients.find((c) => c.id === selectedClient)
    if (!client) return

    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const formatDate = (dateString: string) => {
      const [year, month, day] = dateString.split("-")
      return `${day}/${month}/${year}`
    }

    // Create updated invoice
    const updatedInvoice = {
      ...invoice,
      client: client.name,
      cif: client.cif,
      amount: `€${subtotal.toFixed(2)}`,
      tax: `€${taxAmount.toFixed(2)}`,
      total: `€${total.toFixed(2)}`,
      status: status,
      date: formatDate(invoiceDate),
      dueDate: formatDate(dueDate),
      items: items,
    }

    // Update invoice in context
    updateInvoice(invoice.id, updatedInvoice)

    // Show success message
    toast({
      title: "Factura actualizada",
      description: `La factura ${invoice.id} ha sido actualizada correctamente.`,
    })

    // Redirect to invoice details
    router.push(`/invoices/${invoice.id}`)
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/invoices/${invoice.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Editar Factura {invoice.id}</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Datos de Facturación</CardTitle>
              <CardDescription>Información de tu empresa y del cliente</CardDescription>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-select">Seleccionar Cliente</Label>
                    <Select
                      value={selectedClient?.toString()}
                      onValueChange={(value) => setSelectedClient(Number(value))}
                    >
                      <SelectTrigger id="client-select">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name} - {client.cif}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedClient && (
                    <div className="rounded-md border p-4 bg-gray-50">
                      {(() => {
                        const client = clients.find((c) => c.id === selectedClient)
                        if (!client) return null
                        return (
                          <>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">CIF: {client.cif}</p>
                            <p className="text-sm text-muted-foreground">{client.address}</p>
                            <p className="text-sm text-muted-foreground">
                              {client.postalCode} {client.city}, {client.province}
                            </p>
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Factura</CardTitle>
              <CardDescription>Información general de la factura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-number">Número de Factura</Label>
                  <Input id="invoice-number" value={invoiceNumber} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-date">Fecha de Emisión</Label>
                  <Input
                    id="invoice-date"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-due-date">Fecha de Vencimiento</Label>
                  <Input
                    id="invoice-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-status">Estado</Label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as "Pagada" | "Pendiente" | "Vencida")}
                  >
                    <SelectTrigger id="invoice-status">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Pagada">Pagada</SelectItem>
                      <SelectItem value="Vencida">Vencida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-method">Método de Pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="card">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-notes">Notas</Label>
                <Input
                  id="invoice-notes"
                  placeholder="Notas adicionales para el cliente"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Conceptos</CardTitle>
            <CardDescription>Añade los servicios o productos a facturar</CardDescription>
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
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          placeholder="Descripción del servicio o producto"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.tax.toString()}
                          onValueChange={(value) => updateItem(item.id, "tax", Number.parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="IVA" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="21">21%</SelectItem>
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="4">4%</SelectItem>
                            <SelectItem value="0">0%</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="font-medium">€{(item.price * (1 + item.tax / 100)).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Concepto
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div></div>
            <div className="space-y-2 text-right">
              <div className="text-sm">
                Subtotal: <span className="font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="text-sm">
                IVA: <span className="font-medium">€{taxAmount.toFixed(2)}</span>
              </div>
              <div className="text-lg font-bold">Total: €{total.toFixed(2)}</div>
            </div>
          </CardFooter>
        </Card>
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href={`/invoices/${invoice.id}`}>Cancelar</Link>
          </Button>
          <Button onClick={handleSubmit}>Guardar Cambios</Button>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

