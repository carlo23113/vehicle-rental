<template>
  <CommonPageContainer>
    <CommonPageHeader
      title="Document Management"
      subtitle="Manage all customer, rental, and vehicle documents"
      action-text="Upload Document"
      action-icon="mdi-upload"
      @action-click="handleUploadClick"
    />

    <!-- Statistics Cards -->
    <div ref="statsSection">
      <LazyDocumentsStatsCards v-if="sectionsLoaded.stats" :stats="stats" />
      <LazyDocumentsStatsSkeleton v-else />
    </div>

    <DocumentFilters v-model="showFilters" :filters="filters" @clear="clearFilters" />

    <CommonUiViewModeToggle v-model="viewMode" />

    <CommonUiExpiryAlert
      :count="expiringSoonDocuments.length"
      item-name="document"
      message="Review and renew expiring documents to maintain compliance."
      @view-all="viewExpiringDocuments"
    />

    <!-- Document View Section -->
    <div ref="contentSection">
      <LazyDocumentsGridSection
        v-if="viewMode === 'grid' && sectionsLoaded.content"
        :displayed-items="displayedItems"
        :is-loading-more="isLoadingMore"
        @upload="handleDocumentUpload"
        @verify="handleDocumentVerify"
        @reject="handleDocumentReject"
        @delete="handleDocumentDelete"
      />
      <LazyDocumentsGridSkeleton v-else-if="viewMode === 'grid'" />

      <LazyDocumentsTableSection
        v-else-if="viewMode === 'table' && sectionsLoaded.content"
        :displayed-items="displayedItems"
        :is-loading-more="isLoadingMore"
        @view="viewDocument"
        @verify="handleDocumentVerify"
        @download="downloadDocument"
      />
      <LazyDocumentsTableSkeleton v-else />
    </div>

    <v-dialog v-model="showUploadDialog" max-width="800">
      <DocumentTypeSelector @select="handleDocumentTypeSelect" @cancel="showUploadDialog = false" />
    </v-dialog>

    <v-dialog v-model="showUploadFormDialog" max-width="800">
      <DocumentUpload
        v-if="selectedDocumentType"
        :document-type="selectedDocumentType"
        @cancel="showUploadFormDialog = false"
        @upload="handleUpload"
      />
    </v-dialog>

    <DocumentViewer
      v-if="selectedDocument"
      v-model="showViewer"
      :document="selectedDocument"
      :can-verify="true"
      @verify="openVerifyDialog"
      @reject="handleDocumentReject"
    />

    <DocumentVerifyDialog
      v-model="showVerifyDialog"
      :document="documentToVerify"
      @confirm="confirmVerification"
    />

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Document, DocumentType } from '~/types/document'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'
import { useDocumentStats } from '~/composables/useDocumentStats'

definePageMeta({
  layout: 'default',
})

const {
  filteredDocuments,
  expiringSoonDocuments,
  filters,
  uploadDocument,
  verifyDocument,
  rejectDocument,
  deleteDocument: removeDocument,
  getDocumentStats,
} = useDocuments()

const showFilters = ref(false)
const viewMode = ref<'grid' | 'table'>('table')
const showUploadDialog = ref(false)
const showUploadFormDialog = ref(false)
const showViewer = ref(false)
const showVerifyDialog = ref(false)
const selectedDocument = ref<Document | null>(null)
const documentToVerify = ref<Document | null>(null)
const selectedDocumentType = ref<DocumentType | null>(null)
const showExpiringOnly = ref(false)
const snackbar = ref<{
  show: boolean
  message: string
  color: 'success' | 'error' | 'warning' | 'info'
  icon: string
}>({
  show: false,
  message: '',
  color: 'success',
  icon: '',
})

// Computed documents list based on filter mode
const documentsToDisplay = computed(() =>
  showExpiringOnly.value ? expiringSoonDocuments.value : filteredDocuments.value
)

// Progressive table loading with intersection observer
const {
  statsSection,
  tableSection: contentSection,
  sectionsLoaded: sectionsLoadedBase,
  displayedItems,
  isLoadingMore,
  updateDisplayedItems
} = useProgressiveTable(documentsToDisplay, { batchSize: 20 })

// Debounced filters
useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: updateDisplayedItems
})

// Stats calculation using composable
const { stats } = useDocumentStats(getDocumentStats)

// Rename sectionsLoaded.table to sectionsLoaded.content for clarity
const sectionsLoaded = computed(() => ({
  stats: sectionsLoadedBase.value.stats,
  content: sectionsLoadedBase.value.table
}))

const clearFilters = () => {
  filters.value.status = 'all'
  filters.value.type = 'all'
  filters.value.search = ''
}

// DRY helper
const handleUploadClick = () => {
  showUploadDialog.value = true
}

const viewDocument = (document: Document) => {
  selectedDocument.value = document
  showViewer.value = true
}

const downloadDocument = (document: Document) => window.open(document.url, '_blank')

const handleDocumentTypeSelect = (type: DocumentType) => {
  selectedDocumentType.value = type
  showUploadDialog.value = false
  showUploadFormDialog.value = true
}

const handleUpload = async (files: File[], metadata: any, notes: string) => {
  if (!selectedDocumentType.value) return

  const success = await uploadDocument(selectedDocumentType.value, files, metadata, notes)
  if (success) {
    showUploadFormDialog.value = false
    selectedDocumentType.value = null
    showSnackbar('Document uploaded successfully', 'success', 'mdi-check-circle')
  }
}

const handleDocumentUpload = (type: DocumentType) => {
  selectedDocumentType.value = type
  showUploadFormDialog.value = true
}

const openVerifyDialog = (document: Document) => {
  documentToVerify.value = document
  showVerifyDialog.value = true
}

const confirmVerification = async (notes: string) => {
  if (!documentToVerify.value) return

  const success = await verifyDocument(documentToVerify.value.id, 'Current User', notes || 'Document verified')
  if (success) {
    showSnackbar('Document verified successfully', 'success', 'mdi-check-circle')
    showViewer.value = false
  }
  documentToVerify.value = null
}

const handleDocumentVerify = (document: Document) => {
  openVerifyDialog(document)
}

const showSnackbar = (message: string, color: 'success' | 'error' | 'warning' | 'info', icon: string) => {
  snackbar.value = { show: true, message, color, icon }
}

const handleDocumentReject = async (document: Document) => {
  const reason = prompt('Please provide a reason for rejection:')
  if (!reason) return

  const success = await rejectDocument(document.id, 'Current User', reason)
  if (success) showSnackbar('Document rejected', 'warning', 'mdi-alert-circle')
}

const handleDocumentDelete = async (document: Document) => {
  if (!confirm(`Are you sure you want to delete "${document.name}"?`)) return

  const success = await removeDocument(document.id)
  if (success) showSnackbar('Document deleted successfully', 'success', 'mdi-check-circle')
}

const viewExpiringDocuments = () => {
  filters.value.status = 'all'
  showExpiringOnly.value = true
}
</script>

<style scoped lang="scss">
.modern-card {
  @apply rounded-2xl;
  border: 1px solid rgba(var(--v-border-color), 0.12);
  background: rgb(var(--v-theme-surface));
}

.stat-card {
  @apply rounded-2xl transition-all;
  border: 1px solid rgba(var(--v-border-color), 0.12);
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  @apply -translate-y-1;
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrapper {
  @apply w-12 h-12 rounded-xl flex items-center justify-center;
  box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.2);
}
</style>
