"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, TrendingUp, Euro } from "lucide-react"
import Link from "next/link"
import { useAppContext } from "@/context/app-context"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentInvoices } from "@/components/recent-invoices"
import { TopClients } from "@/components/top-clients"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"

export default function Home() {
  return (
    <LayoutWithSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCards />
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="invoices">Facturas</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="reports">Informes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <DashboardStats />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Facturas Recientes</CardTitle>
                  <CardDescription>Has emitido 8 facturas este mes</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentInvoices />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Principales Clientes</CardTitle>
                  <CardDescription>Por volumen de facturación</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopClients />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Facturas</CardTitle>
                <CardDescription>Visualiza, crea y gestiona todas tus facturas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button asChild>
                    <Link href="/invoices/new">Nueva Factura</Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selecciona la pestaña "Facturas" en el menú principal para gestionar tus facturas.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Clientes</CardTitle>
                <CardDescription>Administra la información de tus clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button asChild>
                    <Link href="/clients/new">Nuevo Cliente</Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selecciona la pestaña "Clientes" en el menú principal para gestionar tus clientes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informes y Estadísticas</CardTitle>
                <CardDescription>Visualiza informes detallados de tu actividad</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Selecciona la pestaña "Informes" en el menú principal para acceder a los informes detallados.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutWithSidebar>
  )
}

// Componente para las tarjetas de estadísticas
function StatsCards() {
  const { invoices, clients, getTotalBilling, getPendingInvoicesCount, getActiveClientsCount, getQuarterlyVAT } = useAppContext()

  // Formatear números a euros
  const formatEuro = (amount: number) => `€${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Facturación Total</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatEuro(getTotalBilling())}</div>
          <p className="text-xs text-muted-foreground">{invoices.length === 0 ? 'Sin datos previos' : '0% respecto al mes anterior'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getPendingInvoicesCount()}</div>
          <p className="text-xs text-muted-foreground">{invoices.length === 0 ? 'Sin datos previos' : '0 respecto al mes anterior'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getActiveClientsCount()}</div>
          <p className="text-xs text-muted-foreground">{clients.length === 0 ? 'Sin datos previos' : '0 nuevos este mes'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">IVA Trimestral</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatEuro(getQuarterlyVAT())}</div>
          <p className="text-xs text-muted-foreground">Periodo actual</p>
        </CardContent>
      </Card>
    </>
  )
}

