"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, Users, Settings, Home, Calculator } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="hidden border-r bg-gray-50/40 md:block md:w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex h-14 items-center border-b px-4 font-semibold">RESINA ROSARIO, S.L.</div>
        <nav className="grid gap-1 px-2 pt-2">
          <Link
            href="/"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
              isActive("/") ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/budgets"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
              isActive("/budgets") ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            <Calculator className="h-4 w-4" />
            Presupuestos
          </Link>
          <Link
            href="/invoices"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
              isActive("/invoices") ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            <FileText className="h-4 w-4" />
            Facturas
          </Link>
          <Link
            href="/clients"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
              isActive("/clients") ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            <Users className="h-4 w-4" />
            Clientes
          </Link>
          <Link
            href="/reports"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
              isActive("/reports") ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Informes
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
              isActive("/settings") ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            <Settings className="h-4 w-4" />
            Configuración
          </Link>
          <Link
            href="/login"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
              isActive("/login") ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            <Home className="h-4 w-4" />
            Login
          </Link>
        </nav>
      </div>
    </div>
  )
}

