"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import { toast } from "@/components/ui/use-toast"
import type { Client } from "@/types/schema"

export default function EditClientPage() {
  const params = useParams()
  const router = useRouter()
  const { updateClient, getClientById } = useAppContext()

  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [cif, setCif] = useState("")
  const [address, setAddress] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (params.id) {
      const foundClient = getClientById(Number(params.id))
      if (foundClient) {
        setClient(foundClient)

        // Set form values
        setName(foundClient.name)
        setCif(foundClient.cif)
        setAddress(foundClient.address)
        setPostalCode(foundClient.postalCode)
        setCity(foundClient.city)
        setProvince(foundClient.province)
        setPhone(foundClient.phone)
        setEmail(foundClient.email)
      }
      setLoading(false)
    }
  }, [params.id, getClientById])

  const handleSubmit = () => {
    if (!client) return

    // Validate form
    if (!name || !cif || !address || !postalCode || !city || !province) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    // Update client
    const updatedClient = {
      ...client,
      name,
      cif,
      address,
      postalCode,
      city,
      province,
      phone,
      email,
    }

    // Update client in context
    updateClient(client.id, updatedClient)

    // Show success message
    toast({
      title: "Cliente actualizado",
      description: `El cliente ${name} ha sido actualizado correctamente.`,
    })

    // Redirect to client details
    router.push(`/clients/${client.id}`)
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/clients">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Cargando cliente...</h1>
          </div>
        </div>
      </LayoutWithSidebar>
    )
  }

  if (!client) {
    return (
      <LayoutWithSidebar>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/clients">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Cliente no encontrado</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>El cliente que estás buscando no existe o ha sido eliminado.</p>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/clients">Volver a clientes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/clients/${client.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Editar Cliente</h1>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Edita los datos del cliente</CardDescription>
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
              <Link href={`/clients/${client.id}`}>Cancelar</Link>
            </Button>
            <Button onClick={handleSubmit}>Guardar Cambios</Button>
          </CardFooter>
        </Card>
      </div>
    </LayoutWithSidebar>
  )
}

