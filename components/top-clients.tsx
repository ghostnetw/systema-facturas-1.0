"use client"

import { useAppContext } from "@/context/app-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export function TopClients() {
  const { clients, invoices } = useAppContext()

  // Calcular el total real de facturación por cliente
  const clientsWithTotals = clients.map((client) => {
    const clientInvoices = invoices.filter(inv => inv.client?.toString() === client.id?.toString())
    const total = clientInvoices.reduce((sum, inv) => {
      const invoiceTotal = typeof inv.total === 'string' ? 
        parseFloat(inv.total.replace('€', '').trim()) : (inv.total || 0)
      return sum + invoiceTotal
    }, 0)
    
    return {
      ...client,
      total: total > 0 ? `€${total.toFixed(2)}` : '€0.00',
      percentage: total > 0 ? Math.floor((total / clientInvoices.length) * 100 / 1000) : 0,
      initials: client.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase(),
    }
  })

  // Ordenar por total y tomar los 5 primeros que tengan facturación
  const topClients = clientsWithTotals
    .sort((a, b) => parseFloat(b.total.replace('€', '')) - parseFloat(a.total.replace('€', '')))
    .filter(client => parseFloat(client.total.replace('€', '')) > 0)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {topClients.map((client) => (
        <div key={client.id} className="flex items-center">
          <Avatar className="h-9 w-9 mr-3">
            <AvatarFallback className="bg-gray-100 text-gray-600">{client.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{client.name}</p>
              <p className="text-sm font-medium">{client.total}</p>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <p>CIF: {client.cif}</p>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={client.percentage} className="h-2" />
              <span className="text-xs text-muted-foreground">{client.percentage}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

