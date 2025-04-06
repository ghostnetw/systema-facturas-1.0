import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Users, Settings } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center gap-2">
        <Link href="/" className="text-xl font-semibold md:hidden">
          RESINA ROSARIO, S.L.
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex md:gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/invoices">
              <FileText className="mr-2 h-4 w-4" />
              Facturas
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/clients">
              <Users className="mr-2 h-4 w-4" />
              Clientes
            </Link>
          </Button>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/invoices/new">Nueva Factura</Link>
        </Button>
      </div>
    </header>
  )
}

