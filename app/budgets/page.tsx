"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppContext } from "@/context/app-context"
import { FileText, Plus, Printer, Pencil, Trash2, Check, X } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import type { Budget, Invoice } from "@/types/schema"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const getBadgeVariant = (status: Budget['status']): { variant: 'default' | 'destructive' | 'outline' | 'secondary'; className: string } => {
  switch (status) {
    case 'Aceptado':
      return { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100' }
    case 'Rechazado':
      return { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100' }
    default:
      return { variant: 'outline', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' }
  }
}

export default function BudgetsPage() {
  const router = useRouter()
  const { budgets, addInvoice, deleteBudget, updateBudget } = useAppContext()

  return (
    <LayoutWithSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Presupuestos</h1>
          <Button asChild>
            <Link href="/budgets/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Presupuesto
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Presupuestos</CardTitle>
            <CardDescription>Gestiona tus presupuestos y conviértelos en facturas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgets.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="mx-auto h-12 w-12 opacity-50 mb-4" />
                  <p>No hay presupuestos creados</p>
                  <p className="text-sm">Los presupuestos que crees aparecerán aquí</p>
                </div>
              ) : (
                budgets.map((budget: Budget) => (
                  <div key={budget.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Link href={`/budgets/${budget.id}`} className="text-lg font-medium hover:underline">
                          {budget.client}
                        </Link>
                        <Badge
                          {...getBadgeVariant(budget.status)}
                        >
                          {budget.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                          <p>Presupuesto: {budget.id}</p>
                          <p>Total: {budget.total}</p>
                        </div>
                        <div className="text-right">
                          <p>Fecha: {budget.date}</p>
                          <p>Válido hasta: {budget.validUntil}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="icon" title="Imprimir presupuesto">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Editar presupuesto"
                        onClick={() => router.push(`/budgets/${budget.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {budget.status === 'Pendiente' && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Aprobar presupuesto"
                            onClick={() => {
                              updateBudget(budget.id, { status: 'Aceptado' })
                              toast.success('Presupuesto aprobado correctamente')
                            }}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Rechazar presupuesto"
                            onClick={() => {
                              updateBudget(budget.id, { status: 'Rechazado' })
                              toast.error('Presupuesto rechazado')
                            }}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      {budget.status === 'Aceptado' && (
                        <Button
                          variant="outline"
                          size="icon"
                          title="Convertir a factura"
                          onClick={() => {
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
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        title="Eliminar presupuesto"
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de que deseas eliminar este presupuesto?')) {
                            deleteBudget(budget.id)
                            toast.success('Presupuesto eliminado correctamente')
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWithSidebar>
  )
}