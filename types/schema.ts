export interface Invoice {
  id: string
  client: string
  cif: string
  amount: string
  tax: string
  total: string
  status: "Pagada" | "Pendiente" | "Vencida"
  date: string
  dueDate: string
  items?: InvoiceItem[]
}

export interface Budget {
  id: string
  client: string
  cif: string
  amount: string
  tax: string
  total: string
  status: "Pendiente" | "Aceptado" | "Rechazado"
  date: string
  validUntil: string
  items?: BudgetItem[]
  notes?: string
}

export interface InvoiceItem {
  id: number
  description: string
  price: number
  tax: number
}

export interface BudgetItem {
  id: number
  description: string
  quantity: number
  price: number
  tax: number
}

export interface Client {
  id: number
  name: string
  cif: string
  address: string
  postalCode: string
  city: string
  province: string
  phone: string
  email: string
}

