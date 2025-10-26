import { ref, computed } from 'vue'
import type { Invoice, Receipt, InvoiceSettings } from '~/types/invoice'
import { DEFAULT_INVOICE_SETTINGS } from '~/types/invoice'

export const useInvoices = () => {
  const invoices = ref<Invoice[]>([])
  const receipts = ref<Receipt[]>([])
  const settings = ref<InvoiceSettings>(DEFAULT_INVOICE_SETTINGS)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filters = ref({
    status: 'all' as string,
    paymentStatus: 'all' as string,
    search: '',
    dateFrom: '',
    dateTo: '',
  })

  const filteredInvoices = computed(() => {
    let result = invoices.value

    if (filters.value.status !== 'all') {
      result = result.filter(inv => inv.status === filters.value.status)
    }

    if (filters.value.paymentStatus !== 'all') {
      result = result.filter(inv => inv.paymentStatus === filters.value.paymentStatus)
    }

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(
        inv =>
          inv.invoiceNumber.toLowerCase().includes(search) ||
          inv.customerName.toLowerCase().includes(search) ||
          inv.customerEmail.toLowerCase().includes(search)
      )
    }

    return result
  })

  const generateInvoiceNumber = (): string => {
    const number = settings.value.nextInvoiceNumber++
    return `${settings.value.invoicePrefix}-${String(number).padStart(5, '0')}`
  }

  const generateReceiptNumber = (): string => {
    const number = settings.value.nextReceiptNumber++
    return `${settings.value.receiptPrefix}-${String(number).padStart(5, '0')}`
  }

  const createInvoice = async (invoiceData: Partial<Invoice>): Promise<Invoice> => {
    loading.value = true
    error.value = null

    try {
      const invoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: generateInvoiceNumber(),
        status: 'draft',
        paymentStatus: 'unpaid',
        issueDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        createdBy: 'Current User',
        ...invoiceData,
      } as Invoice

      invoices.value.push(invoice)
      return invoice
    } catch (err) {
      error.value = 'Failed to create invoice'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createReceipt = async (receiptData: Partial<Receipt>): Promise<Receipt> => {
    loading.value = true
    error.value = null

    try {
      const receipt: Receipt = {
        id: `rec-${Date.now()}`,
        receiptNumber: generateReceiptNumber(),
        paymentDate: new Date().toISOString(),
        currency: settings.value.currency,
        createdAt: new Date().toISOString(),
        createdBy: 'Current User',
        ...receiptData,
      } as Receipt

      receipts.value.push(receipt)
      return receipt
    } catch (err) {
      error.value = 'Failed to create receipt'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateInvoice = async (id: string, updates: Partial<Invoice>): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const index = invoices.value.findIndex(inv => inv.id === id)
      if (index !== -1) {
        invoices.value[index] = { ...invoices.value[index], ...updates }
        return true
      }
      return false
    } catch (err) {
      error.value = 'Failed to update invoice'
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteInvoice = async (id: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const index = invoices.value.findIndex(inv => inv.id === id)
      if (index !== -1) {
        invoices.value.splice(index, 1)
        return true
      }
      return false
    } catch (err) {
      error.value = 'Failed to delete invoice'
      return false
    } finally {
      loading.value = false
    }
  }

  const sendInvoice = async (id: string, recipients: string[]): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      await updateInvoice(id, {
        status: 'sent',
        sentAt: new Date().toISOString(),
        sentTo: recipients,
      })
      return true
    } catch (err) {
      error.value = 'Failed to send invoice'
      return false
    } finally {
      loading.value = false
    }
  }

  const markAsPaid = async (id: string, paymentData: {
    paymentMethod: string
    paymentReference?: string
    amountPaid: number
  }): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      await updateInvoice(id, {
        status: 'paid',
        paymentStatus: 'paid',
        paidDate: new Date().toISOString(),
        amountPaid: paymentData.amountPaid,
        amountDue: 0,
        ...paymentData,
      })
      return true
    } catch (err) {
      error.value = 'Failed to mark invoice as paid'
      return false
    } finally {
      loading.value = false
    }
  }

  const getInvoiceStats = () => {
    const total = invoices.value.length
    const draft = invoices.value.filter(inv => inv.status === 'draft').length
    const sent = invoices.value.filter(inv => inv.status === 'sent').length
    const paid = invoices.value.filter(inv => inv.status === 'paid').length
    const overdue = invoices.value.filter(inv => inv.status === 'overdue').length

    const totalRevenue = invoices.value
      .filter(inv => inv.paymentStatus === 'paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0)

    const outstanding = invoices.value
      .filter(inv => inv.paymentStatus !== 'paid')
      .reduce((sum, inv) => sum + inv.amountDue, 0)

    return {
      total,
      draft,
      sent,
      paid,
      overdue,
      totalRevenue,
      outstanding,
    }
  }

  return {
    invoices,
    receipts,
    settings,
    filteredInvoices,
    loading,
    error,
    filters,
    createInvoice,
    createReceipt,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    markAsPaid,
    getInvoiceStats,
    generateInvoiceNumber,
    generateReceiptNumber,
  }
}
