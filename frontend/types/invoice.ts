export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded'
export type InvoiceType = 'rental' | 'deposit' | 'damage' | 'late_fee' | 'other'

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  taxRate?: number
  taxAmount?: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  type: InvoiceType
  status: InvoiceStatus
  paymentStatus: PaymentStatus

  // Customer & Rental Info
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }

  rentalId?: string
  vehicleInfo?: {
    make: string
    model: string
    year: number
    licensePlate: string
  }

  // Dates
  issueDate: string
  dueDate: string
  paidDate?: string

  // Items & Amounts
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  amountPaid: number
  amountDue: number

  // Payment Info
  paymentMethod?: string
  paymentReference?: string

  // Notes & Terms
  notes?: string
  terms?: string

  // Metadata
  createdAt: string
  createdBy: string
  sentAt?: string
  sentTo?: string[]
}

export interface Receipt {
  id: string
  receiptNumber: string

  // Reference
  invoiceId?: string
  invoiceNumber?: string
  rentalId?: string
  paymentId: string

  // Customer Info
  customerId: string
  customerName: string
  customerEmail: string

  // Payment Details
  paymentDate: string
  paymentMethod: string
  paymentReference?: string

  // Amounts
  amount: number
  currency: string

  // Items
  items: {
    description: string
    amount: number
  }[]

  // Notes
  notes?: string

  // Metadata
  createdAt: string
  createdBy: string
  sentAt?: string
  printedAt?: string
}

export interface CompanyInfo {
  name: string
  logo?: string
  email: string
  phone: string
  website?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  taxId?: string
  registrationNumber?: string
}

export interface InvoiceSettings {
  companyInfo: CompanyInfo
  invoicePrefix: string
  receiptPrefix: string
  nextInvoiceNumber: number
  nextReceiptNumber: number
  defaultDueDays: number
  defaultTaxRate: number
  defaultTerms: string
  defaultNotes: string
  currency: string
  currencySymbol: string
  dateFormat: string
}

export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: 'VehicleRent Inc.',
  email: 'billing@vehiclerent.com',
  phone: '(555) 123-4567',
  website: 'www.vehiclerent.com',
  address: {
    street: '123 Business Ave',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'USA',
  },
  taxId: '12-3456789',
  registrationNumber: 'REG-123456',
}

export const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
  companyInfo: DEFAULT_COMPANY_INFO,
  invoicePrefix: 'INV',
  receiptPrefix: 'REC',
  nextInvoiceNumber: 1001,
  nextReceiptNumber: 1001,
  defaultDueDays: 30,
  defaultTaxRate: 8.5,
  defaultTerms: 'Payment is due within 30 days. Late payments may incur additional fees.',
  defaultNotes: 'Thank you for your business!',
  currency: 'USD',
  currencySymbol: '$',
  dateFormat: 'MM/DD/YYYY',
}

export const INVOICE_STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'grey',
    icon: 'mdi-file-document-edit',
  },
  sent: {
    label: 'Sent',
    color: 'info',
    icon: 'mdi-send',
  },
  paid: {
    label: 'Paid',
    color: 'success',
    icon: 'mdi-check-circle',
  },
  overdue: {
    label: 'Overdue',
    color: 'error',
    icon: 'mdi-alert-circle',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'grey',
    icon: 'mdi-close-circle',
  },
}

export const PAYMENT_STATUS_CONFIG = {
  unpaid: {
    label: 'Unpaid',
    color: 'error',
    icon: 'mdi-close-circle',
  },
  partial: {
    label: 'Partial',
    color: 'warning',
    icon: 'mdi-clock-alert',
  },
  paid: {
    label: 'Paid',
    color: 'success',
    icon: 'mdi-check-circle',
  },
  refunded: {
    label: 'Refunded',
    color: 'info',
    icon: 'mdi-keyboard-return',
  },
}
