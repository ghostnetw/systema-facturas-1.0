"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useAppContext } from "@/context/app-context"
import { Calculator } from "lucide-react"

export function DashboardStats() {
  const { invoices, budgets } = useAppContext()

  // Mostrar mensaje solo si no hay ningún dato
  if ((!invoices || invoices.length === 0) && (!budgets || budgets.length === 0)) {
  // Mostrar mensaje solo si no hay facturas NI presupuestos
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[350px]">
          <div className="text-xl font-bold text-muted-foreground mb-2">No hay datos disponibles</div>
          <p className="text-sm text-muted-foreground text-center">
            Los datos de facturación se mostrarán aquí cuando comiences a crear facturas.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Crear array con todos los meses del año
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1)
    return date.toLocaleString('es-ES', { month: 'short' })
  })

  // Agrupar facturas por mes
  const monthlyData = invoices.reduce((acc, invoice) => {
    const date = new Date(invoice.date)
    const monthKey = date.toLocaleString('es-ES', { month: 'short' })
    
    if (!(monthKey in acc)) {
      acc[monthKey] = 0
    }
    const total = typeof invoice.total === 'string' 
      ? parseFloat(invoice.total.replace('€', '').trim()) 
      : (invoice.total || 0)
    acc[monthKey] += total
    return acc
  }, Object.fromEntries(months.map(month => [month, 0])))

  // Convertir a formato para el gráfico
  const data = Object.entries(monthlyData).map(([name, total]) => ({
    name,
    total
  }))

  const totalBudgets = budgets?.length || 0
  const acceptedBudgets = budgets?.filter(b => b.status === 'Aceptado').length || 0
  const pendingBudgets = budgets?.filter(b => b.status === 'Pendiente').length || 0

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="text-xl font-bold">Estado de Presupuestos</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-gray-100 p-4">
              <div className="text-2xl font-bold">{totalBudgets}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="rounded-lg bg-green-100 p-4">
              <div className="text-2xl font-bold text-green-800">{acceptedBudgets}</div>
              <div className="text-sm text-green-800">Aceptados</div>
            </div>
            <div className="rounded-lg bg-yellow-100 p-4">
              <div className="text-2xl font-bold text-yellow-800">{pendingBudgets}</div>
              <div className="text-sm text-yellow-800">Pendientes</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-xl font-bold mb-4">Facturación Mensual</div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip 
              formatter={(value) => [`€${value}`, "Total"]} 
              labelFormatter={(label) => `Mes: ${label}`} 
            />
            <Bar 
              dataKey="total" 
              fill="#4f46e5" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
)
}

