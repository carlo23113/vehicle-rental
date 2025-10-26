import type { Ref } from 'vue'
import type { Invoice } from '~/types/invoice'

export const useInvoiceStats = (invoices: Ref<Invoice[]>) => {
  const isOverdue = (invoice: Invoice) => {
    if (invoice.paymentStatus === 'paid') return false
    return new Date(invoice.dueDate) < new Date()
  }

  const statsCards = computed(() => {
    const unpaidCount = invoices.value.filter(i => i.paymentStatus === 'unpaid').length
    const paidCount = invoices.value.filter(i => i.paymentStatus === 'paid').length
    const overdueCount = invoices.value.filter(i => isOverdue(i)).length

    return [
      {
        icon: 'mdi-file-document',
        label: 'Total Invoices',
        value: invoices.value.length,
        color: 'primary',
      },
      {
        icon: 'mdi-clock-alert',
        label: 'Unpaid',
        value: unpaidCount,
        color: 'warning',
      },
      {
        icon: 'mdi-check-circle',
        label: 'Paid',
        value: paidCount,
        color: 'success',
      },
      {
        icon: 'mdi-alert-circle',
        label: 'Overdue',
        value: overdueCount,
        color: 'error',
      },
    ]
  })

  return {
    statsCards,
    isOverdue,
  }
}
