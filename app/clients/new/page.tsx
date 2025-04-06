"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { toast } from "@/components/ui/use-toast"

export default function NewClientPage() {
  const router = useRouter()
  const { addClient } = useAppContext()

  const [name, setName] = useState("")
  const [cif, setCif] = useState("")
  const [address, setAddress] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    // Validate form
    if (!name || !cif || !address || !postalCode || !city || !province) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    // Create new client
    const newClient = {
      id: 0, // Will be set by the context
      name,
      cif,
      address,
      postalCode,
      city,
      province,
      phone,
      email,
    }

    // Add client to context
    addClient(newClient)

    // Show success message
    toast({
      title: "Cliente creado",
      description: `El cliente ${name} ha sido creado correctamente.`,
    })

    // Redirect to clients page
    router.push("/clients")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Nuevo Cliente</h1>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Añade un nuevo cliente a tu base de datos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Datos Generales</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Nombre/Razón Social</Label>
                  <Input
                    id="client-name"
                    placeholder="Nombre del cliente"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-cif">CIF/NIF</Label>
                  <Input id="client-cif" placeholder="B12345678" value={cif} onChange={(e) => setCif(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Dirección</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-address">Dirección</Label>
                  <Input
                    id="client-address"
                    placeholder="Calle, número, piso..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-postal">Código Postal</Label>
                    <Input
                      id="client-postal"
                      placeholder="28001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-city">Ciudad</Label>
                    <Input
                      id="client-city"
                      placeholder="Madrid"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-province">Provincia</Label>
                    <Input
                      id="client-province"
                      placeholder="Madrid"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Contacto</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-phone">Teléfono</Label>
                  <Input
                    id="client-phone"
                    placeholder="912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Información Adicional</h3>
              <div className="space-y-2">
                <Label htmlFor="client-notes">Notas</Label>
                <Input
                  id="client-notes"
                  placeholder="Información adicional sobre el cliente"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/clients">Cancelar</Link>
            </Button>
            <Button onClick={handleSubmit}>Guardar Cliente</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

