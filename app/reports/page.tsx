"use client"

import { BarChart3, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import { useAppContext } from "@/context/app-context"

export default function ReportsPage() {
  const { invoices, clients } = useAppContext()

  // Calcular estadísticas en tiempo real
  const totalInvoices = invoices?.length || 0
  const totalAmount = invoices?.reduce((sum, inv) => {
    const total = typeof inv.total === 'string' ? parseFloat(inv.total.replace('€', '').trim()) : (inv.total || 0)
    return sum + total
  }, 0) || 0
  const pendingInvoices = invoices?.filter(inv => inv.status === 'Pendiente') || []
  const pendingAmount = pendingInvoices.reduce((sum, inv) => {
    const total = typeof inv.total === 'string' ? parseFloat(inv.total.replace('€', '').trim()) : (inv.total || 0)
    return sum + total
  }, 0)
  
  // Calcular tiempo medio de pago (en días)
  const paidInvoices = invoices?.filter(inv => inv.status === 'Pagada' && inv.date) || []
  const avgPaymentTime = paidInvoices.length > 0
    ? Math.round(paidInvoices.reduce((sum, inv) => {
        if (!inv.date) return sum
        const invoiceDate = new Date(inv.date)
        const dueDate = inv.dueDate ? new Date(inv.dueDate) : new Date()
        const diffDays = Math.max(0, (dueDate.getTime() - invoiceDate.getTime()) / (1000 * 3600 * 24))
        return sum + diffDays
      }, 0) / paidInvoices.length)
    : 0

  return (
    <LayoutWithSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Informes y Estadísticas</h1>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Datos
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices}</div>
              <p className="text-xs text-muted-foreground">Facturas emitidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facturación Total</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total facturado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{pendingAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{pendingInvoices.length} facturas sin cobrar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Medio de Pago</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPaymentTime} días</div>
              <p className="text-xs text-muted-foreground">Promedio de cobro</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Facturación Mensual</CardTitle>
            <CardDescription>Evolución de la facturación durante el último año</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardStats />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Facturación por Cliente</CardTitle>
              <CardDescription>Top 5 clientes por volumen de facturación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {(clients || [])
                .map(client => ({
                  ...client,
                  total: (invoices || [])
                    .filter(inv => inv.client?.toString() === client.id?.toString())
                    .reduce((sum, inv) => {
                      const total = typeof inv.total === 'string' ? parseFloat(inv.total.replace('€', '').trim()) : (inv.total || 0)
                      return sum + total
                    }, 0)
                }))
                .sort((a, b) => b.total - a.total)
                .slice(0, 5)
                .map(client => (
                  <div key={client.id} className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                    <div className="text-sm font-medium">€{client.total.toFixed(2)}</div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de Pagos</CardTitle>
              <CardDescription>Distribución de facturas por estado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium">Facturas Pagadas</p>
                  <p className="text-sm text-muted-foreground">
                    {paidInvoices.length} de {totalInvoices} facturas
                  </p>
                </div>
                <div className="text-sm font-medium">
                  {totalInvoices > 0 ? ((paidInvoices.length / totalInvoices) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium">Facturas Pendientes</p>
                  <p className="text-sm text-muted-foreground">
                    {pendingInvoices.length} de {totalInvoices} facturas
                  </p>
                </div>
                <div className="text-sm font-medium">
                  {totalInvoices > 0 ? ((pendingInvoices.length / totalInvoices) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

