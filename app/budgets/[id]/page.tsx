"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppContext } from "@/context/app-context"
import { ArrowLeft, Pencil, FileText, Printer } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Budget, Invoice } from "@/types/schema"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import { toast } from "sonner"

export default function BudgetPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getBudgetById, addInvoice } = useAppContext()
  const [budget, setBudget] = useState<Budget | null>(null)

  useEffect(() => {
    const budgetData = getBudgetById(params.id)
    if (budgetData) {
      setBudget(budgetData)
    } else {
      toast.error('Presupuesto no encontrado')
      router.push('/budgets')
    }
  }, [params.id, getBudgetById])

  if (!budget) {
    return null
  }

  const handleConvertToInvoice = () => {
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      client: budget.client,
      cif: budget.cif,
      amount: budget.amount,
      tax: budget.tax,
      total: budget.total,
      status: "Pendiente",
      date: new Date().toLocaleDateString('es-ES'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
      items: budget.items
    }
    addInvoice(invoice)
    toast.success('Presupuesto convertido a factura correctamente')
    router.push('/invoices')
  }

  return (
    <LayoutWithSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/budgets">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Detalles del Presupuesto</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/budgets/${budget.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.print()}> 
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button onClick={handleConvertToInvoice}>
              <FileText className="mr-2 h-4 w-4" />
              Convertir a Factura
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Presupuesto</CardTitle>
            <CardDescription>Detalles completos del presupuesto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Cliente</h3>
                <p className="text-muted-foreground">{budget.client}</p>
              </div>
              <div>
                <h3 className="font-medium">CIF/NIF</h3>
                <p className="text-muted-foreground">{budget.cif}</p>
              </div>
              <div>
                <h3 className="font-medium">Fecha</h3>
                <p className="text-muted-foreground">{budget.date}</p>
              </div>
              <div>
                <h3 className="font-medium">Válido hasta</h3>
                <p className="text-muted-foreground">{budget.validUntil}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Conceptos</h3>
              <div className="space-y-2">
                {budget.items?.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 p-2 border rounded">
                    <div className="col-span-6">
                      <p className="font-medium">Descripción</p>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Cantidad</p>
                      <p className="text-muted-foreground">{item.quantity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Precio</p>
                      <p className="text-muted-foreground">{item.price}€</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">IVA</p>
                      <p className="text-muted-foreground">{item.tax}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium">Base Imponible</h3>
                <p className="text-muted-foreground">{budget.amount}€</p>
              </div>
              <div>
                <h3 className="font-medium">IVA</h3>
                <p className="text-muted-foreground">{budget.tax}€</p>
              </div>
              <div>
                <h3 className="font-medium">Total</h3>
                <p className="text-xl font-bold">{budget.total}€</p>
              </div>
            </div>

            {budget.notes && (
              <div>
                <h3 className="font-medium">Notas</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{budget.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutWithSidebar>
  )
}