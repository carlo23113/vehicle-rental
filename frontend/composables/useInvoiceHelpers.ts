import type { Invoice } from '~/types/invoice'
import { INVOICE_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '~/types/invoice'

export const useInvoiceHelpers = () => {
  const getStatusColor = (status: string): string => {
    return INVOICE_STATUS_CONFIG[status]?.color || 'grey'
  }

  const getStatusLabel = (status: string): string => {
    return INVOICE_STATUS_CONFIG[status]?.label || status
  }

  const getPaymentStatusColor = (status: string): string => {
    return PAYMENT_STATUS_CONFIG[status]?.color || 'grey'
  }

  const getPaymentStatusLabel = (status: string): string => {
    return PAYMENT_STATUS_CONFIG[status]?.label || status
  }

  const isOverdue = (invoice: Invoice): boolean => {
    if (invoice.paymentStatus === 'paid') return false
    const dueDate = new Date(invoice.dueDate)
    const today = new Date()
    return dueDate < today
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return {
    getStatusColor,
    getStatusLabel,
    getPaymentStatusColor,
    getPaymentStatusLabel,
    isOverdue,
    formatDate,
  }
}
