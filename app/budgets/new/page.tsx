"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppContext } from "@/context/app-context"
import { useState } from "react"
import type { Budget, Invoice } from "@/types/schema"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBudgetPage() {
  const router = useRouter()
  const { clients, addBudget, addInvoice } = useAppContext()
  const [formData, setFormData] = useState({
    client: "",
    date: new Date().toISOString().split('T')[0],
    validUntil: "",
    items: [{ id: 1, description: "", quantity: 1, price: 0, tax: 21 }],
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const selectedClient = clients.find(c => c.id.toString() === formData.client)
      if (!selectedClient) {
        toast.error('Cliente no seleccionado')
        return
      }

      // Calculate totals
      const amount = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
      const tax = formData.items.reduce((sum, item) => sum + (item.quantity * item.price * item.tax / 100), 0)
      const total = amount + tax

      const budget: Budget = {
        id: crypto.randomUUID(),
        client: selectedClient.name,
        cif: selectedClient.cif,
        amount: amount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        status: "Pendiente",
        date: new Date().toLocaleDateString('es-ES'),
        validUntil: new Date(formData.validUntil).toLocaleDateString('es-ES'),
        items: formData.items,
        notes: formData.notes
      }

      addBudget(budget)
      toast.success('Presupuesto creado correctamente')
      router.push('/budgets')
    } catch (error) {
      toast.error('Error al crear el presupuesto')
    }
  }

  const handleCreateInvoice = async () => {
    try {
      // Validar que el presupuesto tenga todos los datos necesarios
      if (!formData.client || formData.items.length === 0) {
        toast.error('Por favor, completa todos los campos necesarios')
        return
      }

      const selectedClient = clients.find(c => c.id.toString() === formData.client)
      if (!selectedClient) {
        toast.error('Cliente no seleccionado')
        return
      }

      // Calculate totals
      const amount = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
      const tax = formData.items.reduce((sum, item) => sum + (item.quantity * item.price * item.tax / 100), 0)
      const total = amount + tax

      const invoice: Invoice = {
        id: crypto.randomUUID(),
        client: selectedClient.name,
        cif: selectedClient.cif,
        amount: amount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        status: "Pendiente",
        date: new Date().toLocaleDateString('es-ES'),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'), // 30 days from now
        items: formData.items
      }

      addInvoice(invoice)
      toast.success('Presupuesto convertido a factura correctamente')
      router.push('/invoices')
    } catch (error) {
      console.error('Error al convertir el presupuesto:', error)
      toast.error('Error al convertir el presupuesto')
    }
  }

  return (
    <LayoutWithSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/budgets">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Nuevo Presupuesto</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Presupuesto</CardTitle>
              <CardDescription>Introduce los datos del presupuesto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <select
                    title="Select a client"
                    id="client"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    required
                  >
                    <option value="">Selecciona un cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Válido hasta</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Conceptos</Label>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <Input
                        placeholder="Descripción"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...formData.items]
                          newItems[index].description = e.target.value
                          setFormData({ ...formData, items: newItems })
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Cantidad"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...formData.items]
                          newItems[index].quantity = Number(e.target.value)
                          setFormData({ ...formData, items: newItems })
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Precio"
                        value={item.price}
                        onChange={(e) => {
                          const newItems = [...formData.items]
                          newItems[index].price = Number(e.target.value)
                          setFormData({ ...formData, items: newItems })
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        placeholder="IVA %"
                        value={item.tax}
                        onChange={(e) => {
                          const newItems = [...formData.items]
                          newItems[index].tax = Number(e.target.value)
                          setFormData({ ...formData, items: newItems })
                        }}
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newItems = formData.items.filter((_, i) => i !== index)
                          setFormData({ ...formData, items: newItems })
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newId = Math.max(0, ...formData.items.map(item => item.id)) + 1
                    setFormData({
                      ...formData,
                      items: [...formData.items, { id: newId, description: "", quantity: 1, price: 0, tax: 21 }]
                    })
                  }}
                >
                  Añadir concepto
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Añade notas o condiciones adicionales"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit">Guardar Presupuesto</Button>
              <Button type="button" variant="outline" onClick={handleCreateInvoice}>
                Convertir a Factura
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </LayoutWithSidebar>
  )
}