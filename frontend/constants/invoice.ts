export const INVOICE_STATUS_OPTIONS = [
  { title: 'Draft', value: 'draft' },
  { title: 'Sent', value: 'sent' },
  { title: 'Paid', value: 'paid' },
] as const

export const DEFAULT_PAYMENT_TERMS = 'Payment is due within 30 days. Late payments may incur additional fees.'

export const DEFAULT_TAX_RATE = 8.5

export const DUE_DATE_DAYS = 30
