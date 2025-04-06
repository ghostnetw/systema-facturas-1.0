"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Invoice, Client, Budget } from "@/types/schema"
import { initialInvoices, initialClients } from "@/data/initial-data"

interface AppContextType {
  // Invoices
  invoices: Invoice[]
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  getInvoiceById: (id: string) => Invoice | undefined

  // Budgets
  budgets: Budget[]
  addBudget: (budget: Budget) => void
  updateBudget: (id: string, budget: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  getBudgetById: (id: string) => Budget | undefined

  // Clients
  clients: Client[]
  addClient: (client: Client) => void
  updateClient: (id: number, client: Partial<Client>) => void
  deleteClient: (id: number) => void
  getClientById: (id: number) => Client | undefined

  // Stats
  getTotalBilling: () => number
  getPendingInvoicesCount: () => number
  getActiveClientsCount: () => number
  getQuarterlyVAT: () => number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Función para cargar datos desde localStorage
const loadFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window === "undefined") {
    return defaultValue
  }

  try {
    const savedData = localStorage.getItem(key)
    if (savedData) {
      return JSON.parse(savedData)
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
  }

  return defaultValue
}

// Función para guardar datos en localStorage
const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with data from localStorage or default data
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load initial data
  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedInvoices = loadFromLocalStorage("invoices", initialInvoices)
    const savedBudgets = loadFromLocalStorage("budgets", [])
    const savedClients = loadFromLocalStorage("clients", initialClients)

    setInvoices(savedInvoices)
    setBudgets(savedBudgets)
    setClients(savedClients)
    setIsInitialized(true)
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      saveToLocalStorage("invoices", invoices)
      saveToLocalStorage("budgets", budgets)
      saveToLocalStorage("clients", clients)
    }
  }, [invoices, budgets, clients, isInitialized])

  // Invoice functions
  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [...prev, invoice])
  }

  const updateInvoice = (id: string, updatedFields: Partial<Invoice>) => {
    setInvoices((prev) => prev.map((invoice) => (invoice.id === id ? { ...invoice, ...updatedFields } : invoice)))
  }

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
  }

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id)
  }

  // Client functions
  const addClient = (client: Client) => {
    // Ensure new client has a unique ID
    const newId = Math.max(0, ...clients.map((c) => c.id)) + 1
    const newClient = { ...client, id: newId }
    setClients((prev) => [...prev, newClient])
  }

  const updateClient = (id: number, updatedFields: Partial<Client>) => {
    setClients((prev) => prev.map((client) => (client.id === id ? { ...client, ...updatedFields } : client)))
  }

  const deleteClient = (id: number) => {
    setClients((prev) => prev.filter((client) => client.id !== id))
  }

  const getClientById = (id: number) => {
    return clients.find((client) => client.id === id)
  }

  // Stats functions
  const getTotalBilling = () => {
    return invoices.reduce((total, invoice) => {
      const invoiceTotal = Number.parseFloat(invoice.total.replace("€", "").replace(",", ""))
      return total + invoiceTotal
    }, 0)
  }

  const getPendingInvoicesCount = () => {
    return invoices.filter((invoice) => invoice.status === "Pendiente").length
  }

  const getActiveClientsCount = () => {
    // Count unique clients that have invoices in the last 3 months
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const activeClientIds = new Set()
    invoices.forEach((invoice) => {
      const invoiceDate = parseDate(invoice.date)
      if (invoiceDate >= threeMonthsAgo) {
        // In a real app, we'd have client IDs in invoices
        activeClientIds.add(invoice.client)
      }
    })

    return activeClientIds.size
  }

  const getQuarterlyVAT = () => {
    // Calculate VAT for the current quarter
    const now = new Date()
    const currentQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)

    return invoices
      .filter((invoice) => {
        const invoiceDate = parseDate(invoice.date)
        return invoiceDate >= currentQuarterStart
      })
      .reduce((total, invoice) => {
        const tax = Number.parseFloat(invoice.tax.replace("€", "").replace(",", ""))
        return total + tax
      }, 0)
  }

  // Helper function to parse dates in format DD/MM/YYYY
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  // Budget functions
  const addBudget = (budget: Budget) => {
    setBudgets((prev) => [...prev, budget])
  }

  const updateBudget = (id: string, updatedFields: Partial<Budget>) => {
    setBudgets((prev) => prev.map((budget) => (budget.id === id ? { ...budget, ...updatedFields } : budget)))
  }

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id))
  }

  const getBudgetById = (id: string) => {
    return budgets.find((budget) => budget.id === id)
  }

  const value = {
    // Invoices
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,

    // Budgets
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,

    // Clients
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,

    // Stats
    getTotalBilling,
    getPendingInvoicesCount,
    getActiveClientsCount,
    getQuarterlyVAT,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

