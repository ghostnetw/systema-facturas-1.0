"use client"

import { useAppContext } from "@/context/app-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import Link from "next/link"

export function RecentInvoices() {
  const { invoices } = useAppContext()

  // Get the 5 most recent invoices
  const recentInvoices = [...invoices]
    .sort((a, b) => {
      const dateA = parseDate(a.date)
      const dateB = parseDate(b.date)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5)

  // Helper function to parse dates in format DD/MM/YYYY
  function parseDate(dateStr: string) {
    const [day, month, year] = dateStr.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  return (
    <div className="space-y-8">
      {recentInvoices.map((invoice) => (
        <div key={invoice.id} className="flex items-center">
          <Avatar className="h-9 w-9 mr-3">
            <AvatarFallback className="bg-gray-100 text-gray-600">
              <FileText className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <Link href={`/invoices/${invoice.id}`} className="text-sm font-medium leading-none hover:underline">
                {invoice.client}
              </Link>
              <p className="text-sm font-medium">{invoice.amount}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <p>Factura: {invoice.id}</p>
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
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <p>Emitida: {invoice.date}</p>
              <p>Vencimiento: {invoice.dueDate}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/invoices">Ver todas las facturas</Link>
        </Button>
      </div>
    </div>
  )
}

