import type { InvoiceItem } from '~/types/invoice'

export const useInvoiceCalculations = () => {
  const calculateItemTotal = (item: InvoiceItem): void => {
    item.amount = item.quantity * item.unitPrice
    item.taxAmount = item.taxRate ? (item.amount * item.taxRate) / 100 : 0
    item.total = item.amount + item.taxAmount
  }

  const calculateInvoiceTotals = (items: InvoiceItem[], discountAmount: number = 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0)
    const totalAmount = subtotal + taxAmount - discountAmount

    return {
      subtotal,
      taxAmount,
      totalAmount,
    }
  }

  const applyGlobalTaxRate = (items: InvoiceItem[], globalTaxRate: number): void => {
    items.forEach(item => {
      if (!item.taxRate) {
        item.taxRate = globalTaxRate
      }
      calculateItemTotal(item)
    })
  }

  return {
    calculateItemTotal,
    calculateInvoiceTotals,
    applyGlobalTaxRate,
  }
}
