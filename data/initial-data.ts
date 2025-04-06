import type { Invoice, Client } from "@/types/schema"

export const initialInvoices: Invoice[] = [
  {
    id: "INV-2024-001",
    client: "Empresa ABC S.L.",
    cif: "B12345678",
    date: "01/01/2024",
    dueDate: "15/01/2024",
    items: [
      {
        id: 1,
        description: "Servicios de consultoría",
        price: 1000.00,
        tax: 21
      }
    ],
    amount: "1000,00",
    tax: "210,00",
    total: "1210,00",
    status: "Pagada"
  }
]

export const initialClients: Client[] = [
  {
    id: 1,
    name: "Empresa ABC S.L.",
    cif: "B12345678",
    address: "Calle Principal 123",
    postalCode: "28001",
    city: "Madrid",
    province: "Madrid",
    phone: "912345678",
    email: "contacto@empresaabc.com"
  }
]