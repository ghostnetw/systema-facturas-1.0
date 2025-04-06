"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import type { Client } from "@/types/schema"

export default function ClientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { clients, deleteClient, getClientById } = useAppContext()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const foundClient = getClientById(Number(params.id))
      if (foundClient) {
        setClient(foundClient)
      }
      setLoading(false)
    }
  }, [params.id, getClientById])

  const handleDeleteClient = () => {
    if (client) {
      deleteClient(client.id)
      toast({
        title: "Cliente eliminado",
        description: `El cliente ${client.name} ha sido eliminado correctamente.`,
      })
      router.push("/clients")
    }
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/clients">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{client.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/clients/${client.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente {client.name} y no podrá
                    ser recuperado.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteClient} className="bg-red-600 hover:bg-red-700">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Nombre/Razón Social</p>
                <p>{client.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">CIF/NIF</p>
                <p>{client.cif}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">Dirección</p>
              <p>{client.address}</p>
              <p>
                {client.postalCode} {client.city}, {client.province}
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Teléfono</p>
                <p>{client.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p>{client.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWithSidebar>
  )
}

