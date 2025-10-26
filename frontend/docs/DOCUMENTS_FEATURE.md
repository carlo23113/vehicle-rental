# Document Upload & Verification System

## Overview

A comprehensive document management system for handling customer, rental, and vehicle documents with verification workflows and compliance tracking.

## Features

### ✅ Core Functionality
- **Multi-format Support**: PDF, JPG, PNG
- **Drag & Drop Upload**: Intuitive file upload experience
- **Document Verification**: Approval/rejection workflow with audit trail
- **Expiry Tracking**: Automatic alerts for expiring documents (30-day warning)
- **Document Types**: 11 pre-configured types (driver's license, insurance, etc.)
- **Metadata Capture**: Document numbers, issue/expiry dates, issuing authority

### ✅ User Experience
- **Document Viewer**: In-app PDF and image preview
- **Grid & Table Views**: Multiple viewing modes
- **Advanced Filtering**: By status, type, customer, rental
- **Search Functionality**: Quick document lookup
- **Progress Indicators**: Upload progress tracking
- **Toast Notifications**: Real-time feedback

### ✅ Compliance & Legal
- **Verification Audit Trail**: Track who verified/rejected and when
- **Required Documents**: Enforce mandatory document collection
- **Rejection Reasons**: Document why documents were rejected
- **Expiry Warnings**: Prevent using expired documents

## Components

### 1. DocumentUpload.vue
Upload interface with drag-and-drop support.

**Props:**
- `documentType`: Type of document being uploaded
- `customerId`, `rentalId`, `vehicleId`: Associated entity IDs
- `multiple`: Allow multiple file uploads
- `maxSize`: Maximum file size (default 10MB)

**Events:**
- `upload`: Emits when files are ready to upload
- `cancel`: Emits when user cancels

### 2. DocumentViewer.vue
View and verify documents.

**Props:**
- `document`: Document object to display
- `canVerify`: Enable verification actions

**Events:**
- `verify`: User verified document
- `reject`: User rejected document

### 3. DocumentList.vue
Display documents in grid layout.

**Props:**
- `documents`: Array of documents
- `canUpload`, `canVerify`, `canDelete`: Permission flags

**Events:**
- `upload`, `verify`, `reject`, `delete`: Document actions

### 4. DocumentTypeSelector.vue
Select document type before upload.

**Events:**
- `select`: Document type selected
- `cancel`: User cancelled

## Composable: useDocuments

### State
```typescript
const {
  documents,              // All documents
  filteredDocuments,      // Filtered by current filters
  pendingDocuments,       // Awaiting verification
  verifiedDocuments,      // Verified documents
  rejectedDocuments,      // Rejected documents
  expiredDocuments,       // Expired documents
  expiringSoonDocuments,  // Expiring within 30 days
  loading,
  error,
  filters,
} = useDocuments()
```

### Actions
```typescript
// Upload document
await uploadDocument(
  type: DocumentType,
  files: File[],
  metadata: {
    documentNumber?: string
    expiryDate?: string
    issueDate?: string
    issuingAuthority?: string
  },
  notes: string,
  customerId?: string,
  rentalId?: string,
  vehicleId?: string
)

// Verify document
await verifyDocument(documentId, verifiedBy, notes?)

// Reject document
await rejectDocument(documentId, verifiedBy, rejectionReason)

// Delete document
await deleteDocument(documentId)

// Get documents by entity
getDocumentsByCustomer(customerId)
getDocumentsByRental(rentalId)
getDocumentsByVehicle(vehicleId)
getDocumentsByType(type)

// Check required documents
hasRequiredDocuments(customerId) // Returns true if all required docs are verified

// Get statistics
getDocumentStats() // Returns counts by status
```

## Document Types

```typescript
type DocumentType =
  | 'drivers_license'      // Required, has expiry
  | 'government_id'        // Required, has expiry
  | 'passport'             // Optional, has expiry
  | 'proof_of_insurance'   // Required, has expiry
  | 'proof_of_address'     // Optional
  | 'credit_card'          // Optional
  | 'rental_agreement'     // Required
  | 'vehicle_registration' // Optional, has expiry
  | 'inspection_report'    // Optional
  | 'damage_report'        // Optional
  | 'other'                // Optional
```

## Integration Points

### Customer Detail Page
Documents section shows customer-specific documents with upload/verify/delete capabilities.

```vue
<DocumentsDocumentList
  :documents="customerDocuments"
  :can-upload="true"
  :can-verify="true"
  :can-delete="true"
  @upload="handleDocumentUpload"
  @verify="handleDocumentVerify"
  @reject="handleDocumentReject"
  @delete="handleDocumentDelete"
/>
```

### Rental Detail Page
Shows rental-specific documents (agreements, inspections, etc.).

### Documents Management Page
Centralized hub for all document operations with statistics dashboard.

**Route:** `/documents`

**Features:**
- Statistics cards (total, pending, verified, expiring)
- Advanced filtering
- Grid and table views
- Bulk actions
- Expiry alerts

## Navigation

### Sidebar Navigation
**Documents** menu item added between Maintenance and Reports with:
- Icon: `mdi-file-document-multiple`
- Badge: Shows pending document count
- Route: `/documents`

### Quick Add Menu
**Upload Document** action added to quick add menu:
- Opens upload dialog
- Route: `/documents?action=upload`

### Search Dialog
Documents page searchable via global search.

## Usage Examples

### Upload a document for a customer
```typescript
const { uploadDocument } = useDocuments()

await uploadDocument(
  'drivers_license',
  [file],
  {
    documentNumber: 'DL-123456789',
    expiryDate: '2026-01-15',
    issueDate: '2020-01-15',
    issuingAuthority: 'DMV California'
  },
  'Valid license, verified details',
  customerId
)
```

### Verify a document
```typescript
const { verifyDocument } = useDocuments()

await verifyDocument(
  documentId,
  'Admin User',
  'All details confirmed and valid'
)
```

### Check if customer has required documents
```typescript
const { hasRequiredDocuments } = useDocuments()

const canRent = hasRequiredDocuments(customerId)
if (!canRent) {
  alert('Customer needs to upload driver license and insurance')
}
```

## Backend Integration Required

To make this fully functional, implement these API endpoints:

### Upload
```
POST /api/documents/upload
Content-Type: multipart/form-data

Body:
- file: File
- type: DocumentType
- customerId?: string
- rentalId?: string
- vehicleId?: string
- metadata: JSON
- notes: string
```

### List
```
GET /api/documents
Query params:
- status: 'pending' | 'verified' | 'rejected' | 'expired'
- type: DocumentType
- customerId, rentalId, vehicleId
- search: string
```

### Verify
```
PUT /api/documents/:id/verify
Body:
- verifiedBy: string
- notes?: string
```

### Reject
```
PUT /api/documents/:id/reject
Body:
- verifiedBy: string
- rejectionReason: string
```

### Delete
```
DELETE /api/documents/:id
```

## File Storage

Recommended integrations:
- **AWS S3**: Enterprise-grade cloud storage
- **Cloudinary**: Image processing + storage
- **Local**: For development/testing

## Optional Enhancements

1. **OCR Integration**: Auto-extract data from documents
2. **Email Notifications**: Alert when documents expire
3. **Bulk Upload**: Upload multiple documents at once
4. **Document Templates**: Pre-filled forms
5. **E-Signature**: Digital signature capture
6. **Watermarking**: Add watermarks to sensitive documents
7. **Version History**: Track document updates
8. **Sharing**: Share documents with customers via secure link

## Security Considerations

- ✅ File type validation
- ✅ File size limits
- ✅ User permission checks
- 🔄 Virus scanning (TODO - backend)
- 🔄 Encryption at rest (TODO - backend)
- 🔄 Secure URLs with expiry (TODO - backend)
- 🔄 Access logging (TODO - backend)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Testing

Test the following scenarios:
1. Upload various file types (PDF, JPG, PNG)
2. Upload files exceeding size limit
3. Upload files with invalid types
4. Verify/reject documents
5. Filter by status/type
6. Search for documents
7. View documents in viewer
8. Download documents
9. Check expiry warnings
10. Delete documents

## Troubleshooting

### Upload not working
- Check file size < 10MB
- Verify file type is allowed
- Check network console for errors

### Documents not showing
- Verify filter settings
- Check if documents are assigned to correct entity
- Refresh the page

### Viewer not displaying PDF
- Some browsers block PDFs in iframes
- Use download button as fallback
- Consider PDF.js for better compatibility
