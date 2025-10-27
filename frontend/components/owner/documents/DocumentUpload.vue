<template>
  <v-card elevation="0" class="document-upload-card">
    <v-card-title class="pa-4">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h3 class="text-h6 font-weight-bold">Upload Documents</h3>
          <p class="text-caption text-medium-emphasis mt-1">
            {{ documentConfig.description }}
          </p>
        </div>
        <v-chip
          v-if="documentConfig.required"
          size="small"
          color="error"
          variant="flat"
        >
          Required
        </v-chip>
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-4">
      <!-- File Input Area -->
      <div
        class="upload-zone"
        :class="{ 'drag-over': isDragging, 'has-error': errorMessage }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          :accept="acceptedTypes"
          :multiple="multiple"
          class="d-none"
          @change="handleFileSelect"
        />

        <div class="upload-content text-center">
          <v-icon
            :icon="uploading ? 'mdi-loading' : documentConfig.icon"
            size="48"
            :class="{ 'rotating': uploading }"
            color="primary"
          />

          <h4 class="text-h6 font-weight-bold mt-4">
            {{ uploading ? 'Uploading...' : 'Drop files here or click to browse' }}
          </h4>

          <p class="text-body-2 text-medium-emphasis mt-2">
            Accepted formats: {{ formatAcceptedTypes }}
          </p>

          <p class="text-caption text-medium-emphasis">
            Maximum file size: {{ formatFileSize(maxSize) }}
          </p>

          <v-btn
            v-if="!uploading"
            color="primary"
            variant="flat"
            prepend-icon="mdi-upload"
            class="mt-4"
            @click.stop="triggerFileInput"
          >
            Select Files
          </v-btn>

          <v-progress-linear
            v-if="uploading"
            :model-value="uploadProgress"
            color="primary"
            height="6"
            rounded
            class="mt-4"
          />
        </div>
      </div>

      <!-- Error Message -->
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        closable
        class="mt-4"
        @click:close="errorMessage = ''"
      >
        {{ errorMessage }}
      </v-alert>

      <!-- Uploaded Files Preview -->
      <div v-if="uploadedFiles.length > 0" class="uploaded-files mt-4">
        <h4 class="text-subtitle-1 font-weight-bold mb-2">Uploaded Files</h4>
        <v-list class="pa-0">
          <v-list-item
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="file-item rounded-lg mb-2 px-3"
          >
            <template #prepend>
              <v-avatar
                :color="getFileColor(file.type)"
                size="40"
                class="mr-3"
              >
                <v-icon :icon="getFileIcon(file.type)" color="white" />
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ file.name }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ formatFileSize(file.size) }}
            </v-list-item-subtitle>

            <template #append>
              <v-btn
                icon="mdi-close"
                size="small"
                variant="text"
                color="error"
                @click="removeFile(index)"
              />
            </template>
          </v-list-item>
        </v-list>
      </div>

      <!-- Metadata Fields -->
      <div v-if="documentConfig.expiryRequired && uploadedFiles.length > 0" class="metadata-section mt-4">
        <v-divider class="mb-4" />
        <h4 class="text-subtitle-1 font-weight-bold mb-3">Document Information</h4>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="metadata.documentNumber"
              label="Document Number"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-pound"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="metadata.issuingAuthority"
              label="Issuing Authority"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-domain"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="metadata.issueDate"
              label="Issue Date"
              type="date"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="metadata.expiryDate"
              label="Expiry Date"
              type="date"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar-alert"
              hide-details
              :rules="expiryDateRules"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="notes"
              label="Notes (Optional)"
              variant="outlined"
              density="comfortable"
              rows="2"
              prepend-inner-icon="mdi-note-text"
              hide-details
            />
          </v-col>
        </v-row>
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="pa-4">
      <v-spacer />
      <v-btn
        variant="text"
        @click="$emit('cancel')"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-check"
        :disabled="uploadedFiles.length === 0 || uploading"
        :loading="uploading"
        @click="submitDocuments"
      >
        Upload Documents
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DocumentType } from '~/types/document'
import { DOCUMENT_TYPE_CONFIG } from '~/types/document'

interface Props {
  documentType: DocumentType
  customerId?: string
  rentalId?: string
  vehicleId?: string
  multiple?: boolean
  maxSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  maxSize: 10 * 1024 * 1024, // 10MB default
})

const emit = defineEmits<{
  cancel: []
  upload: [files: File[], metadata: any, notes: string]
}>()

const fileInput = ref<HTMLInputElement>()
const uploadedFiles = ref<File[]>([])
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')
const metadata = ref({
  documentNumber: '',
  issuingAuthority: '',
  issueDate: '',
  expiryDate: '',
})
const notes = ref('')

const documentConfig = computed(() => DOCUMENT_TYPE_CONFIG[props.documentType])

const acceptedTypes = computed(() => {
  return documentConfig.value.allowedFormats.join(',')
})

const formatAcceptedTypes = computed(() => {
  return documentConfig.value.allowedFormats
    .map(type => type.split('/')[1].toUpperCase())
    .join(', ')
})

const expiryDateRules = computed(() => [
  (v: string) => {
    if (!v) return true
    const expiry = new Date(v)
    const today = new Date()
    return expiry > today || 'Document has expired'
  },
])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  processFiles(files)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
}

const processFiles = (files: File[]) => {
  errorMessage.value = ''

  // Validate files
  for (const file of files) {
    // Check file size
    if (file.size > props.maxSize) {
      errorMessage.value = `File "${file.name}" exceeds maximum size of ${formatFileSize(props.maxSize)}`
      return
    }

    // Check file type
    if (!documentConfig.value.allowedFormats.includes(file.type)) {
      errorMessage.value = `File "${file.name}" has an unsupported format. Accepted formats: ${formatAcceptedTypes.value}`
      return
    }
  }

  if (props.multiple) {
    uploadedFiles.value = [...uploadedFiles.value, ...files]
  } else {
    uploadedFiles.value = [files[0]]
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return 'mdi-file-image'
  if (type === 'application/pdf') return 'mdi-file-pdf-box'
  return 'mdi-file'
}

const getFileColor = (type: string): string => {
  if (type.startsWith('image/')) return 'info'
  if (type === 'application/pdf') return 'error'
  return 'grey'
}

const submitDocuments = async () => {
  if (uploadedFiles.value.length === 0) return

  // Validate expiry date if required
  if (documentConfig.value.expiryRequired && metadata.value.expiryDate) {
    const expiry = new Date(metadata.value.expiryDate)
    const today = new Date()
    if (expiry <= today) {
      errorMessage.value = 'Document expiry date must be in the future'
      return
    }
  }

  uploading.value = true
  uploadProgress.value = 0

  try {
    // Simulate upload progress
    const interval = setInterval(() => {
      uploadProgress.value += 10
      if (uploadProgress.value >= 100) {
        clearInterval(interval)
      }
    }, 200)

    // Emit the upload event with files and metadata
    emit('upload', uploadedFiles.value, metadata.value, notes.value)

    // Wait for upload to complete
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Reset form
    uploadedFiles.value = []
    metadata.value = {
      documentNumber: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: '',
    }
    notes.value = ''
    uploadProgress.value = 0
  } catch (error) {
    errorMessage.value = 'Failed to upload documents. Please try again.'
    console.error('Upload error:', error)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.document-upload-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
}

.upload-zone {
  border: 2px dashed rgba(var(--v-border-color), 0.3);
  border-radius: 12px;
  padding: 3rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(var(--v-theme-surface-variant), 0.2);
}

.upload-zone:hover {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
}

.upload-zone.drag-over {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
  transform: scale(1.02);
}

.upload-zone.has-error {
  border-color: rgb(var(--v-theme-error));
  background: rgba(var(--v-theme-error), 0.05);
}

.upload-content {
  pointer-events: none;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.file-item {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border: 1px solid rgba(var(--v-border-color), 0.12);
  transition: all 0.2s ease;
}

.file-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}
</style>
