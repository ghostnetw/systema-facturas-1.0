"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface FormData {
  companyName: string;
  cif: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  iban: string;
  invoicePrefix: string;
  nextInvoiceNumber: string;
  paymentDays: string;
  invoiceFooter: string;
  taxGeneral: string;
  taxReduced: string;
  taxSuperReduced: string;
  allowTaxExempt: boolean;
}

export default function SettingsPage() {
  const [formData, setFormData] = useState<FormData>(() => {
    // Intentar cargar la configuración guardada
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('settings')
      if (savedSettings) {
        return JSON.parse(savedSettings)
      }
    }
    // Configuración por defecto si no hay datos guardados
    return {
      companyName: "RESINA ROSARIO, S.L.",
      cif: "B12345678",
      address: "Calle Ejemplo, 123",
      postalCode: "28001",
      city: "Madrid",
      province: "Madrid",
      phone: "912345678",
      email: "info@resinarosario.com",
      iban: "ES12 3456 7890 1234 5678 9012",
      invoicePrefix: "INV-2023-",
      nextInvoiceNumber: "009",
      paymentDays: "30",
      invoiceFooter: "Gracias por confiar en RESINA ROSARIO, S.L.",
      taxGeneral: "21",
      taxReduced: "10",
      taxSuperReduced: "4",
      allowTaxExempt: false
    }
  })

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [id]: value
    }))
  }

  // Cargar la configuración al iniciar
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings')
    if (savedSettings) {
      setFormData(JSON.parse(savedSettings))
    }
  }, [])

  const handleSaveChanges = () => {
    try {
      localStorage.setItem('settings', JSON.stringify(formData))
      toast.success('Cambios guardados correctamente')
    } catch (error) {
      console.error('Error al guardar la configuración:', error)
      toast.error('Error al guardar los cambios')
    }
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex flex-1 items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">RESINA ROSARIO, S.L.</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Configuración</h1>
        </div>
        <Tabs defaultValue="company" className="space-y-4">
          <TabsList>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="invoices">Facturación</TabsTrigger>
            <TabsTrigger value="taxes">Impuestos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>
          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
                <CardDescription>Configura los datos de tu empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Datos Generales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nombre/Razón Social</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-cif">CIF</Label>
                      <Input
                        id="cif"
                        value={formData.cif}
                        onChange={(e) => handleInputChange('cif', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Dirección</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-address">Dirección</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-postal">Código Postal</Label>
                        <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-city">Ciudad</Label>
                        <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-province">Provincia</Label>
                        <Input
                        id="province"
                        value={formData.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                      />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Contacto</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Datos Bancarios</h3>
                  <div className="space-y-2">
                    <Label htmlFor="company-iban">IBAN</Label>
                    <Input
                        id="iban"
                        value={formData.iban}
                        onChange={(e) => handleInputChange('iban', e.target.value)}
                      />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Facturación</CardTitle>
                <CardDescription>Personaliza la configuración de tus facturas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Numeración de Facturas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice-prefix">Prefijo</Label>
                      <Input
                        id="invoicePrefix"
                        value={formData.invoicePrefix}
                        onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice-next">Próximo número</Label>
                      <Input
                        id="nextInvoiceNumber"
                        value={formData.nextInvoiceNumber}
                        onChange={(e) => handleInputChange('nextInvoiceNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Plazos de Pago</h3>
                  <div className="space-y-2">
                    <Label htmlFor="payment-days">Días para vencimiento (por defecto)</Label>
                    <Input
                        id="paymentDays"
                        type="number"
                        value={formData.paymentDays}
                        onChange={(e) => handleInputChange('paymentDays', e.target.value)}
                      />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Pie de Factura</h3>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-footer">Texto predeterminado</Label>
                    <Input
                        id="invoiceFooter"
                        value={formData.invoiceFooter}
                        onChange={(e) => handleInputChange('invoiceFooter', e.target.value)}
                      />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="taxes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Impuestos</CardTitle>
                <CardDescription>Configura los tipos de IVA y otros impuestos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Tipos de IVA</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="tax-general">IVA General</Label>
                        <p className="text-sm text-muted-foreground">
                          Tipo general para la mayoría de productos y servicios
                        </p>
                      </div>
                      <Input
                        id="taxGeneral"
                        className="w-24"
                        value={formData.taxGeneral}
                        onChange={(e) => handleInputChange('taxGeneral', e.target.value)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="tax-reduced">IVA Reducido</Label>
                        <p className="text-sm text-muted-foreground">
                          Tipo reducido para ciertos productos y servicios
                        </p>
                      </div>
                      <Input
                        id="taxReduced"
                        className="w-24"
                        value={formData.taxReduced}
                        onChange={(e) => handleInputChange('taxReduced', e.target.value)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="tax-super-reduced">IVA Superreducido</Label>
                        <p className="text-sm text-muted-foreground">Tipo superreducido para productos básicos</p>
                      </div>
                      <Input
                        id="taxSuperReduced"
                        className="w-24"
                        value={formData.taxSuperReduced}
                        onChange={(e) => handleInputChange('taxSuperReduced', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Configuración Avanzada</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowTaxExempt"
                      checked={formData.allowTaxExempt}
                      onCheckedChange={(checked) => handleInputChange('allowTaxExempt', checked.toString())}
                    />
                    <Label htmlFor="tax-exempt">Permitir facturas exentas de IVA</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra los usuarios que tienen acceso al sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Esta funcionalidad estará disponible próximamente.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

