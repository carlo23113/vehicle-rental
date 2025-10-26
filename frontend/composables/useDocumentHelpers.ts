import type { Document, DocumentType } from '~/types/document'
import { DOCUMENT_TYPE_CONFIG } from '~/types/document'

export const useDocumentHelpers = () => {
  const STATUS_COLOR_MAP: Record<string, string> = {
    verified: 'success',
    pending: 'warning',
    rejected: 'error',
    expired: 'error',
  }

  const getDocumentIcon = (document: Document): string => {
    if (document.fileType.startsWith('image/')) return 'mdi-file-image'
    if (document.fileType === 'application/pdf') return 'mdi-file-pdf-box'
    return DOCUMENT_TYPE_CONFIG[document.type as DocumentType].icon
  }

  const getStatusColor = (status: string): string => STATUS_COLOR_MAP[status] || 'grey'

  const getDocumentColor = (document: Document): string => getStatusColor(document.status)

  const isExpired = (document: Document): boolean =>
    !!document.metadata?.expiryDate && new Date(document.metadata.expiryDate) < new Date()

  const getDaysUntilExpiry = (document: Document): number => {
    if (!document.metadata?.expiryDate) return 0
    const expiryDate = new Date(document.metadata.expiryDate)
    const today = new Date()
    return Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const isExpiringSoon = (document: Document): boolean => {
    if (!document.metadata?.expiryDate) return false
    const days = getDaysUntilExpiry(document)
    return days > 0 && days <= 30
  }

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const getExpiryTextClass = (document: Document) => ({
    'text-error': isExpired(document),
    'text-warning': isExpiringSoon(document),
  })

  return {
    getDocumentIcon,
    getDocumentColor,
    getStatusColor,
    isExpired,
    isExpiringSoon,
    getDaysUntilExpiry,
    formatDate,
    getExpiryTextClass,
  }
}
