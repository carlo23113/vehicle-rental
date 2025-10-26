import { ref, computed } from 'vue'
import type { Document, DocumentType, DocumentStatus, DocumentVerificationResult } from '~/types/document'

export const useDocuments = () => {
  // Mock data - Replace with API calls
  const documents = ref<Document[]>([
    {
      id: '1',
      customerId: '1',
      type: 'drivers_license',
      name: "Driver's License - John Doe",
      fileName: 'drivers_license_john_doe.pdf',
      fileSize: 2048000,
      fileType: 'application/pdf',
      url: '/uploads/documents/drivers_license_john_doe.pdf',
      status: 'verified',
      uploadedAt: '2025-01-15T10:30:00Z',
      uploadedBy: 'John Doe',
      verifiedAt: '2025-01-15T11:00:00Z',
      verifiedBy: 'Admin User',
      metadata: {
        documentNumber: 'DL-123456789',
        issueDate: '2020-01-15',
        expiryDate: '2026-01-15',
        issuingAuthority: 'DMV California',
      },
      notes: 'Valid driver license, all details verified',
    },
    {
      id: '2',
      customerId: '1',
      type: 'proof_of_insurance',
      name: 'Auto Insurance Certificate',
      fileName: 'insurance_cert.pdf',
      fileSize: 1024000,
      fileType: 'application/pdf',
      url: '/uploads/documents/insurance_cert.pdf',
      status: 'pending',
      uploadedAt: '2025-01-20T14:30:00Z',
      uploadedBy: 'John Doe',
      metadata: {
        documentNumber: 'INS-987654321',
        issueDate: '2025-01-01',
        expiryDate: '2026-01-01',
        issuingAuthority: 'State Farm Insurance',
      },
    },
    {
      id: '3',
      customerId: '2',
      rentalId: 'R-001',
      type: 'rental_agreement',
      name: 'Signed Rental Agreement',
      fileName: 'rental_agreement_R001.pdf',
      fileSize: 3072000,
      fileType: 'application/pdf',
      url: '/uploads/documents/rental_agreement_R001.pdf',
      status: 'verified',
      uploadedAt: '2025-01-18T09:00:00Z',
      uploadedBy: 'Agent Smith',
      verifiedAt: '2025-01-18T09:15:00Z',
      verifiedBy: 'Manager Jane',
      notes: 'Contract signed and verified',
    },
  ])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const filters = ref({
    status: 'all' as DocumentStatus | 'all',
    type: 'all' as DocumentType | 'all',
    search: '',
    customerId: null as string | null,
    rentalId: null as string | null,
    vehicleId: null as string | null,
  })

  // Computed
  const filteredDocuments = computed(() => {
    let result = documents.value

    // Filter by customer
    if (filters.value.customerId) {
      result = result.filter(doc => doc.customerId === filters.value.customerId)
    }

    // Filter by rental
    if (filters.value.rentalId) {
      result = result.filter(doc => doc.rentalId === filters.value.rentalId)
    }

    // Filter by vehicle
    if (filters.value.vehicleId) {
      result = result.filter(doc => doc.vehicleId === filters.value.vehicleId)
    }

    // Filter by status
    if (filters.value.status !== 'all') {
      result = result.filter(doc => doc.status === filters.value.status)
    }

    // Filter by type
    if (filters.value.type !== 'all') {
      result = result.filter(doc => doc.type === filters.value.type)
    }

    // Filter by search
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      result = result.filter(doc =>
        doc.name.toLowerCase().includes(searchLower) ||
        doc.fileName.toLowerCase().includes(searchLower) ||
        doc.metadata?.documentNumber?.toLowerCase().includes(searchLower)
      )
    }

    return result
  })

  const pendingDocuments = computed(() =>
    documents.value.filter(doc => doc.status === 'pending')
  )

  const verifiedDocuments = computed(() =>
    documents.value.filter(doc => doc.status === 'verified')
  )

  const rejectedDocuments = computed(() =>
    documents.value.filter(doc => doc.status === 'rejected')
  )

  const expiredDocuments = computed(() =>
    documents.value.filter(doc => {
      if (!doc.metadata?.expiryDate) return false
      return new Date(doc.metadata.expiryDate) < new Date()
    })
  )

  const expiringSoonDocuments = computed(() =>
    documents.value.filter(doc => {
      if (!doc.metadata?.expiryDate) return false
      const expiryDate = new Date(doc.metadata.expiryDate)
      const today = new Date()
      const daysUntilExpiry = Math.floor(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30
    })
  )

  // Actions
  const uploadDocument = async (
    type: DocumentType,
    files: File[],
    metadata: any,
    notes: string,
    customerId?: string,
    rentalId?: string,
    vehicleId?: string
  ) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In a real app, you would upload files to a server
      // For now, we'll create mock Document objects
      for (const file of files) {
        const newDocument: Document = {
          id: String(Date.now() + Math.random()),
          customerId,
          rentalId,
          vehicleId,
          type,
          name: file.name,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          url: URL.createObjectURL(file), // Mock URL - use actual upload URL in production
          status: 'pending',
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Current User', // Get from auth store
          metadata,
          notes,
        }

        documents.value.push(newDocument)
      }

      return true
    } catch (err) {
      error.value = 'Failed to upload document'
      console.error('Upload error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const verifyDocument = async (
    documentId: string,
    verifiedBy: string,
    notes?: string
  ): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const doc = documents.value.find(d => d.id === documentId)
      if (doc) {
        doc.status = 'verified'
        doc.verifiedAt = new Date().toISOString()
        doc.verifiedBy = verifiedBy
        if (notes) doc.notes = notes
      }

      return true
    } catch (err) {
      error.value = 'Failed to verify document'
      console.error('Verification error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const rejectDocument = async (
    documentId: string,
    verifiedBy: string,
    rejectionReason: string
  ): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const doc = documents.value.find(d => d.id === documentId)
      if (doc) {
        doc.status = 'rejected'
        doc.verifiedAt = new Date().toISOString()
        doc.verifiedBy = verifiedBy
        doc.rejectionReason = rejectionReason
      }

      return true
    } catch (err) {
      error.value = 'Failed to reject document'
      console.error('Rejection error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteDocument = async (documentId: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = documents.value.findIndex(d => d.id === documentId)
      if (index !== -1) {
        documents.value.splice(index, 1)
      }

      return true
    } catch (err) {
      error.value = 'Failed to delete document'
      console.error('Delete error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const getDocumentsByCustomer = (customerId: string): Document[] => {
    return documents.value.filter(doc => doc.customerId === customerId)
  }

  const getDocumentsByRental = (rentalId: string): Document[] => {
    return documents.value.filter(doc => doc.rentalId === rentalId)
  }

  const getDocumentsByVehicle = (vehicleId: string): Document[] => {
    return documents.value.filter(doc => doc.vehicleId === vehicleId)
  }

  const getDocumentsByType = (type: DocumentType): Document[] => {
    return documents.value.filter(doc => doc.type === type)
  }

  const hasRequiredDocuments = (customerId: string): boolean => {
    const customerDocs = getDocumentsByCustomer(customerId)
    const requiredTypes: DocumentType[] = ['drivers_license', 'proof_of_insurance']

    return requiredTypes.every(type =>
      customerDocs.some(doc => doc.type === type && doc.status === 'verified')
    )
  }

  const getDocumentStats = () => {
    return {
      total: documents.value.length,
      pending: pendingDocuments.value.length,
      verified: verifiedDocuments.value.length,
      rejected: rejectedDocuments.value.length,
      expired: expiredDocuments.value.length,
      expiringSoon: expiringSoonDocuments.value.length,
    }
  }

  return {
    documents,
    filteredDocuments,
    pendingDocuments,
    verifiedDocuments,
    rejectedDocuments,
    expiredDocuments,
    expiringSoonDocuments,
    loading,
    error,
    filters,
    uploadDocument,
    verifyDocument,
    rejectDocument,
    deleteDocument,
    getDocumentsByCustomer,
    getDocumentsByRental,
    getDocumentsByVehicle,
    getDocumentsByType,
    hasRequiredDocuments,
    getDocumentStats,
  }
}
