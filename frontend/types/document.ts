export type DocumentType =
  | 'drivers_license'
  | 'government_id'
  | 'passport'
  | 'proof_of_insurance'
  | 'proof_of_address'
  | 'credit_card'
  | 'rental_agreement'
  | 'vehicle_registration'
  | 'inspection_report'
  | 'damage_report'
  | 'other'

export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'expired'

export interface Document {
  id: string
  customerId?: string
  rentalId?: string
  vehicleId?: string
  type: DocumentType
  name: string
  fileName: string
  fileSize: number
  fileType: string
  url: string
  thumbnailUrl?: string
  status: DocumentStatus
  uploadedAt: string
  uploadedBy: string
  verifiedAt?: string
  verifiedBy?: string
  expiresAt?: string
  rejectionReason?: string
  notes?: string
  metadata?: {
    documentNumber?: string
    issueDate?: string
    expiryDate?: string
    issuingAuthority?: string
    [key: string]: any
  }
}

export interface DocumentUploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  multiple?: boolean
  autoVerify?: boolean
}

export interface DocumentVerificationResult {
  documentId: string
  status: DocumentStatus
  verifiedBy: string
  verifiedAt: string
  notes?: string
  rejectionReason?: string
}

export const DOCUMENT_TYPE_CONFIG: Record<
  DocumentType,
  {
    label: string
    icon: string
    description: string
    required: boolean
    expiryRequired: boolean
    allowedFormats: string[]
  }
> = {
  drivers_license: {
    label: "Driver's License",
    icon: 'mdi-card-account-details',
    description: 'Valid government-issued driver license',
    required: true,
    expiryRequired: true,
    allowedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  },
  government_id: {
    label: 'Government ID',
    icon: 'mdi-account-card-details',
    description: 'Government-issued identification card',
    required: true,
    expiryRequired: true,
    allowedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  },
  passport: {
    label: 'Passport',
    icon: 'mdi-passport',
    description: 'Valid passport document',
    required: false,
    expiryRequired: true,
    allowedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  },
  proof_of_insurance: {
    label: 'Proof of Insurance',
    icon: 'mdi-shield-check',
    description: 'Valid insurance certificate',
    required: true,
    expiryRequired: true,
    allowedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  },
  proof_of_address: {
    label: 'Proof of Address',
    icon: 'mdi-home-map-marker',
    description: 'Utility bill or bank statement (not older than 3 months)',
    required: false,
    expiryRequired: false,
    allowedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  },
  credit_card: {
    label: 'Credit Card',
    icon: 'mdi-credit-card',
    description: 'Credit card for security deposit',
    required: false,
    expiryRequired: false,
    allowedFormats: ['image/jpeg', 'image/png', 'image/jpg'],
  },
  rental_agreement: {
    label: 'Rental Agreement',
    icon: 'mdi-file-document-edit',
    description: 'Signed rental contract',
    required: true,
    expiryRequired: false,
    allowedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  vehicle_registration: {
    label: 'Vehicle Registration',
    icon: 'mdi-car-info',
    description: 'Vehicle registration document',
    required: false,
    expiryRequired: true,
    allowedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  },
  inspection_report: {
    label: 'Inspection Report',
    icon: 'mdi-clipboard-check',
    description: 'Vehicle condition inspection report',
    required: false,
    expiryRequired: false,
    allowedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  damage_report: {
    label: 'Damage Report',
    icon: 'mdi-car-wrench',
    description: 'Vehicle damage documentation',
    required: false,
    expiryRequired: false,
    allowedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  other: {
    label: 'Other Document',
    icon: 'mdi-file',
    description: 'Additional supporting document',
    required: false,
    expiryRequired: false,
    allowedFormats: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  },
}
