<template>
  <v-card elevation="0" class="documents-card">
    <v-card-title class="pa-4">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h3 class="text-h6 font-weight-bold">Documents</h3>
          <p class="text-caption text-medium-emphasis mt-1">
            {{ documents.length }} document{{ documents.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <v-btn
          v-if="canUpload"
          color="primary"
          variant="flat"
          prepend-icon="mdi-upload"
          @click="showUploadDialog = true"
        >
          Upload
        </v-btn>
      </div>
    </v-card-title>

    <v-divider />

    <!-- Filter Tabs -->
    <v-tabs v-model="activeTab" bg-color="transparent" color="primary" class="px-4">
      <v-tab value="all">
        All
        <v-chip size="x-small" class="ml-2" variant="tonal">{{ documents.length }}</v-chip>
      </v-tab>
      <v-tab value="pending">
        Pending
        <v-chip
          size="x-small"
          class="ml-2"
          variant="tonal"
          color="warning"
        >
          {{ pendingCount }}
        </v-chip>
      </v-tab>
      <v-tab value="verified">
        Verified
        <v-chip
          size="x-small"
          class="ml-2"
          variant="tonal"
          color="success"
        >
          {{ verifiedCount }}
        </v-chip>
      </v-tab>
      <v-tab value="rejected">
        Rejected
        <v-chip
          size="x-small"
          class="ml-2"
          variant="tonal"
          color="error"
        >
          {{ rejectedCount }}
        </v-chip>
      </v-tab>
    </v-tabs>

    <v-divider />

    <v-card-text class="pa-4">
      <!-- Empty State -->
      <div v-if="filteredDocuments.length === 0" class="empty-state text-center py-8">
        <v-icon icon="mdi-file-document-outline" size="64" color="grey-lighten-1" />
        <h4 class="text-h6 font-weight-bold mt-4">No documents found</h4>
        <p class="text-body-2 text-medium-emphasis mt-2">
          {{ activeTab === 'all' ? 'Upload your first document to get started' : `No ${activeTab} documents` }}
        </p>
        <v-btn
          v-if="canUpload && activeTab === 'all'"
          color="primary"
          variant="flat"
          prepend-icon="mdi-upload"
          class="mt-4"
          @click="showUploadDialog = true"
        >
          Upload Document
        </v-btn>
      </div>

      <!-- Documents Grid -->
      <v-row v-else>
        <v-col
          v-for="document in filteredDocuments"
          :key="document.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="document-card"
            :class="{ 'expired': isExpired(document) }"
            elevation="0"
            @click="viewDocument(document)"
          >
            <!-- Document Preview -->
            <div class="document-preview">
              <v-img
                v-if="document.thumbnailUrl"
                :src="document.thumbnailUrl"
                :alt="document.name"
                height="100"
                cover
                class="document-thumbnail"
              />
              <div v-else class="document-icon-preview">
                <v-icon
                  :icon="getDocumentIcon(document)"
                  size="48"
                  :color="getDocumentColor(document)"
                />
              </div>

              <!-- Status Badge -->
              <v-chip
                :color="getStatusColor(document.status)"
                size="x-small"
                variant="flat"
                class="status-badge"
              >
                {{ document.status }}
              </v-chip>

              <!-- Expiry Warning -->
              <v-chip
                v-if="isExpired(document)"
                color="error"
                size="x-small"
                variant="flat"
                class="expiry-badge"
              >
                <v-icon icon="mdi-alert-circle" start size="12" />
                Expired
              </v-chip>
              <v-chip
                v-else-if="isExpiringSoon(document)"
                color="warning"
                size="x-small"
                variant="flat"
                class="expiry-badge"
              >
                <v-icon icon="mdi-clock-alert" start size="12" />
                Expiring Soon
              </v-chip>
            </div>

            <!-- Document Info -->
            <v-card-text class="pa-2">
              <div class="d-flex align-center mb-1">
                <v-icon
                  :icon="DOCUMENT_TYPE_CONFIG[document.type].icon"
                  size="16"
                  color="primary"
                  class="mr-1"
                />
                <p class="text-caption text-medium-emphasis text-uppercase">
                  {{ DOCUMENT_TYPE_CONFIG[document.type].label }}
                </p>
              </div>

              <h4 class="text-body-2 font-weight-bold mb-1 text-truncate">
                {{ document.name }}
              </h4>

              <p class="text-caption text-medium-emphasis">
                {{ formatFileSize(document.fileSize) }} • {{ formatDate(document.uploadedAt) }}
              </p>

              <div v-if="document.metadata?.expiryDate" class="mt-1">
                <p class="text-caption">
                  <v-icon icon="mdi-calendar-alert" size="12" class="mr-1" />
                  Expires: {{ formatDate(document.metadata.expiryDate) }}
                </p>
              </div>
            </v-card-text>

            <!-- Actions -->
            <v-card-actions class="pa-2 pt-0">
              <v-btn
                size="x-small"
                variant="text"
                prepend-icon="mdi-eye"
                @click.stop="viewDocument(document)"
              >
                View
              </v-btn>

              <v-spacer />

              <v-menu>
                <template #activator="{ props: menuProps }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    size="x-small"
                    variant="text"
                    v-bind="menuProps"
                    @click.stop
                  />
                </template>
                <v-list>
                  <v-list-item
                    prepend-icon="mdi-download"
                    @click="downloadDocument(document)"
                  >
                    Download
                  </v-list-item>
                  <v-list-item
                    v-if="canVerify && document.status === 'pending'"
                    prepend-icon="mdi-check-circle"
                    @click="$emit('verify', document)"
                  >
                    Verify
                  </v-list-item>
                  <v-list-item
                    v-if="canVerify && document.status === 'pending'"
                    prepend-icon="mdi-close-circle"
                    @click="$emit('reject', document)"
                  >
                    Reject
                  </v-list-item>
                  <v-divider v-if="canDelete" />
                  <v-list-item
                    v-if="canDelete"
                    prepend-icon="mdi-delete"
                    class="text-error"
                    @click="$emit('delete', document)"
                  >
                    Delete
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Upload Dialog -->
    <v-dialog v-model="showUploadDialog" max-width="800">
      <DocumentTypeSelector @select="handleDocumentTypeSelect" @cancel="showUploadDialog = false" />
    </v-dialog>

    <!-- Document Viewer -->
    <DocumentViewer
      v-if="selectedDocument"
      v-model="showViewer"
      :document="selectedDocument"
      :can-verify="canVerify"
      @verify="$emit('verify', $event)"
      @reject="$emit('reject', $event)"
    />
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Document, DocumentType } from '~/types/document'
import { DOCUMENT_TYPE_CONFIG } from '~/types/document'

interface Props {
  documents: Document[]
  canUpload?: boolean
  canVerify?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canUpload: true,
  canVerify: false,
  canDelete: false,
})

const emit = defineEmits<{
  upload: [type: DocumentType]
  verify: [document: Document]
  reject: [document: Document]
  delete: [document: Document]
}>()

const activeTab = ref('all')
const showUploadDialog = ref(false)
const showViewer = ref(false)
const selectedDocument = ref<Document | null>(null)

const filteredDocuments = computed(() => {
  if (activeTab.value === 'all') return props.documents
  return props.documents.filter(doc => doc.status === activeTab.value)
})

const pendingCount = computed(() => props.documents.filter(d => d.status === 'pending').length)
const verifiedCount = computed(() => props.documents.filter(d => d.status === 'verified').length)
const rejectedCount = computed(() => props.documents.filter(d => d.status === 'rejected').length)

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'verified': return 'success'
    case 'pending': return 'warning'
    case 'rejected': return 'error'
    case 'expired': return 'error'
    default: return 'grey'
  }
}

const getDocumentIcon = (document: Document): string => {
  if (document.fileType.startsWith('image/')) return 'mdi-file-image'
  if (document.fileType === 'application/pdf') return 'mdi-file-pdf-box'
  return DOCUMENT_TYPE_CONFIG[document.type].icon
}

const getDocumentColor = (document: Document): string => {
  return getStatusColor(document.status)
}

const isExpired = (document: Document): boolean => {
  if (!document.metadata?.expiryDate) return false
  return new Date(document.metadata.expiryDate) < new Date()
}

const isExpiringSoon = (document: Document): boolean => {
  if (!document.metadata?.expiryDate) return false
  const expiryDate = new Date(document.metadata.expiryDate)
  const today = new Date()
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry > 0 && daysUntilExpiry <= 30
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const viewDocument = (document: Document) => {
  selectedDocument.value = document
  showViewer.value = true
}

const downloadDocument = (document: Document) => {
  // For demo purposes, show alert. In production, this would download the actual file
  if (document.url.startsWith('/uploads/')) {
    console.log('Download document:', document.name)
    // TODO: Implement actual file download when backend is ready
  } else {
    window.open(document.url, '_blank')
  }
}

const handleDocumentTypeSelect = (type: DocumentType) => {
  showUploadDialog.value = false
  emit('upload', type)
}
</script>

<style scoped>
.documents-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
}

.document-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.document-card.expired {
  border-color: rgb(var(--v-theme-error));
  background: rgba(var(--v-theme-error), 0.02);
}

.document-preview {
  position: relative;
  height: 100px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  overflow: hidden;
}

.document-icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-secondary), 0.1));
}

.status-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  text-transform: capitalize;
  font-weight: 600;
}

.expiry-badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  font-weight: 600;
}

.empty-state {
  padding: 3rem 1rem;
}
</style>
