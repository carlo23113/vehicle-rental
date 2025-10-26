<template>
  <v-dialog v-model="isOpen" max-width="900" scrollable>
    <v-card>
      <v-card-title class="pa-4 d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <v-icon :icon="documentTypeConfig.icon" size="32" color="primary" />
          <div>
            <h3 class="text-h6 font-weight-bold">{{ document.name }}</h3>
            <p class="text-caption text-medium-emphasis">
              {{ documentTypeConfig.label }}
            </p>
          </div>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="close"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0" style="height: 600px;">
        <!-- Demo Mode Notice (for mock documents) -->
        <div v-if="isMockDocument" class="unsupported-format d-flex flex-column align-center justify-center fill-height">
          <v-icon :icon="documentTypeConfig.icon" size="64" color="primary" />
          <p class="text-h6 mt-4">Document Preview</p>
          <p class="text-body-2 text-medium-emphasis">
            {{ isPDF ? 'PDF' : isImage ? 'Image' : 'Document' }} preview would appear here
          </p>
          <v-chip color="info" variant="tonal" class="mt-4">
            <v-icon icon="mdi-information" start />
            Demo Mode - {{ document.name }}
          </v-chip>
        </div>

        <!-- PDF Viewer -->
        <div v-else-if="isPDF" class="pdf-viewer">
          <iframe
            :src="document.url"
            class="pdf-iframe"
            frameborder="0"
          />
        </div>

        <!-- Image Viewer -->
        <div v-else-if="isImage" class="image-viewer">
          <v-img
            :src="document.url"
            :alt="document.name"
            contain
            height="600"
            class="image-preview"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  indeterminate
                  color="primary"
                />
              </div>
            </template>
          </v-img>
        </div>

        <!-- Unsupported Format -->
        <div v-else class="unsupported-format d-flex flex-column align-center justify-center fill-height">
          <v-icon icon="mdi-file-alert" size="64" color="grey" />
          <p class="text-h6 mt-4">Preview not available</p>
          <p class="text-body-2 text-medium-emphasis">
            This file type cannot be previewed in the browser
          </p>
        </div>
      </v-card-text>

      <v-divider />

      <!-- Document Information -->
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col cols="12" md="6">
            <div class="info-item">
              <v-icon icon="mdi-information" size="20" class="mr-2" />
              <div>
                <p class="text-caption text-medium-emphasis">Status</p>
                <v-chip
                  :color="getStatusColor(document.status)"
                  size="small"
                  variant="flat"
                  class="mt-1"
                >
                  {{ document.status }}
                </v-chip>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="info-item">
              <v-icon icon="mdi-file-document" size="20" class="mr-2" />
              <div>
                <p class="text-caption text-medium-emphasis">File Size</p>
                <p class="text-body-2 font-weight-medium">{{ formatFileSize(document.fileSize) }}</p>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="info-item">
              <v-icon icon="mdi-calendar-upload" size="20" class="mr-2" />
              <div>
                <p class="text-caption text-medium-emphasis">Uploaded</p>
                <p class="text-body-2 font-weight-medium">{{ formatDate(document.uploadedAt) }}</p>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="info-item">
              <v-icon icon="mdi-account" size="20" class="mr-2" />
              <div>
                <p class="text-caption text-medium-emphasis">Uploaded By</p>
                <p class="text-body-2 font-weight-medium">{{ document.uploadedBy }}</p>
              </div>
            </div>
          </v-col>

          <v-col v-if="document.metadata?.documentNumber" cols="12" md="6">
            <div class="info-item">
              <v-icon icon="mdi-pound" size="20" class="mr-2" />
              <div>
                <p class="text-caption text-medium-emphasis">Document Number</p>
                <p class="text-body-2 font-weight-medium">{{ document.metadata.documentNumber }}</p>
              </div>
            </div>
          </v-col>

          <v-col v-if="document.metadata?.expiryDate" cols="12" md="6">
            <div class="info-item">
              <v-icon
                :icon="isExpired ? 'mdi-alert-circle' : 'mdi-calendar-alert'"
                size="20"
                :color="isExpired ? 'error' : undefined"
                class="mr-2"
              />
              <div>
                <p class="text-caption text-medium-emphasis">Expires</p>
                <p
                  class="text-body-2 font-weight-medium"
                  :class="{ 'text-error': isExpired }"
                >
                  {{ formatDate(document.metadata.expiryDate) }}
                  <v-chip
                    v-if="isExpired"
                    color="error"
                    size="x-small"
                    variant="flat"
                    class="ml-2"
                  >
                    EXPIRED
                  </v-chip>
                  <v-chip
                    v-else-if="isExpiringSoon"
                    color="warning"
                    size="x-small"
                    variant="flat"
                    class="ml-2"
                  >
                    EXPIRING SOON
                  </v-chip>
                </p>
              </div>
            </div>
          </v-col>

          <v-col v-if="document.verifiedAt" cols="12" md="6">
            <div class="info-item">
              <v-icon icon="mdi-check-circle" size="20" color="success" class="mr-2" />
              <div>
                <p class="text-caption text-medium-emphasis">Verified</p>
                <p class="text-body-2 font-weight-medium">
                  {{ formatDate(document.verifiedAt) }} by {{ document.verifiedBy }}
                </p>
              </div>
            </div>
          </v-col>

          <v-col v-if="document.rejectionReason" cols="12">
            <v-alert type="error" variant="tonal" class="mb-0">
              <strong>Rejection Reason:</strong> {{ document.rejectionReason }}
            </v-alert>
          </v-col>

          <v-col v-if="document.notes" cols="12">
            <div class="info-item">
              <v-icon icon="mdi-note-text" size="20" class="mr-2" />
              <div class="flex-grow-1">
                <p class="text-caption text-medium-emphasis">Notes</p>
                <p class="text-body-2">{{ document.notes }}</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn
          v-if="!isMockDocument"
          variant="text"
          prepend-icon="mdi-download"
          :href="document.url"
          download
          target="_blank"
        >
          Download
        </v-btn>
        <v-btn
          v-else
          variant="text"
          prepend-icon="mdi-download"
          disabled
        >
          Download (Demo)
        </v-btn>

        <v-spacer />

        <v-btn
          v-if="canVerify && document.status === 'pending'"
          color="error"
          variant="text"
          prepend-icon="mdi-close-circle"
          @click="$emit('reject', document)"
        >
          Reject
        </v-btn>

        <v-btn
          v-if="canVerify && document.status === 'pending'"
          color="success"
          variant="flat"
          prepend-icon="mdi-check-circle"
          @click="$emit('verify', document)"
        >
          Verify
        </v-btn>

        <v-btn
          v-if="!canVerify || document.status !== 'pending'"
          variant="text"
          @click="close"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Document } from '~/types/document'
import { DOCUMENT_TYPE_CONFIG } from '~/types/document'

interface Props {
  modelValue: boolean
  document: Document
  canVerify?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canVerify: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  verify: [document: Document]
  reject: [document: Document]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const documentTypeConfig = computed(() => DOCUMENT_TYPE_CONFIG[props.document.type])

const isMockDocument = computed(() => props.document.url.startsWith('/uploads/'))
const isPDF = computed(() => props.document.fileType === 'application/pdf')
const isImage = computed(() => props.document.fileType.startsWith('image/'))

const isExpired = computed(() => {
  if (!props.document.metadata?.expiryDate) return false
  return new Date(props.document.metadata.expiryDate) < new Date()
})

const isExpiringSoon = computed(() => {
  if (!props.document.metadata?.expiryDate) return false
  const expiryDate = new Date(props.document.metadata.expiryDate)
  const today = new Date()
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry > 0 && daysUntilExpiry <= 30
})

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'verified':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'error'
    case 'expired':
      return 'error'
    default:
      return 'grey'
  }
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
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const close = () => {
  isOpen.value = false
}
</script>

<style scoped>
.pdf-viewer,
.image-viewer {
  height: 100%;
  width: 100%;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.pdf-iframe {
  width: 100%;
  height: 100%;
}

.image-preview {
  width: 100%;
}

.unsupported-format {
  background: rgba(var(--v-theme-surface-variant), 0.2);
  height: 100%;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
}
</style>
