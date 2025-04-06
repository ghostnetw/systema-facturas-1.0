import type React from "react"
import { AppProvider } from "@/context/app-context"
import { Toaster } from "@/components/toaster"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "RESINA ROSARIO, S.L. - Sistema de Facturación",
  description: "Sistema de gestión de facturación para RESINA ROSARIO, S.L.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  )
}



import './globals.css'