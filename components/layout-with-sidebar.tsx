import type React from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

interface LayoutWithSidebarProps {
  children: React.ReactNode
}

export function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

