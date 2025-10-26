<template>
  <v-dialog :model-value="modelValue" max-width="600" @update:model-value="$emit('update:modelValue', $event)">
    <v-card rounded="lg" elevation="24">
      <!-- Header with gradient background -->
      <div class="verify-header">
        <div class="d-flex align-center pa-6">
          <div class="verify-icon-wrapper">
            <v-icon icon="mdi-check-circle" color="white" size="32" />
          </div>
          <div class="ml-4 header-text">
            <h3 class="text-h5 font-weight-bold mb-1">Verify Document</h3>
            <p class="text-body-2 mt-1">
              Confirm that this document meets all verification requirements
            </p>
          </div>
        </div>
      </div>

      <v-card-text class="pa-6">
        <!-- Document Preview Card -->
        <v-card variant="tonal" color="success" class="mb-6">
          <v-card-text class="pa-4">
            <div class="d-flex align-start">
              <v-avatar :color="getDocumentIconColor()" size="56" rounded="lg" class="mr-4">
                <v-icon :icon="getDocumentIcon()" size="32" color="white" />
              </v-avatar>
              <div class="flex-grow-1">
                <p class="text-caption text-medium-emphasis text-uppercase mb-1">
                  {{ documentTypeLabel }}
                </p>
                <h4 class="text-h6 font-weight-bold mb-2">{{ document?.name }}</h4>
                <div class="d-flex align-center gap-3 flex-wrap">
                  <v-chip size="small" variant="flat" color="success">
                    <v-icon icon="mdi-file-document" start size="16" />
                    {{ formatFileSize(document?.fileSize || 0) }}
                  </v-chip>
                  <v-chip size="small" variant="flat" color="success">
                    <v-icon icon="mdi-calendar" start size="16" />
                    {{ formatDate(document?.uploadedAt || '') }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- What will happen section -->
        <div class="mb-6">
          <h4 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon icon="mdi-information-outline" size="20" class="mr-2" color="primary" />
            This action will:
          </h4>
          <v-list density="compact" class="py-0">
            <v-list-item class="px-0">
              <template #prepend>
                <v-icon icon="mdi-check" color="success" size="20" class="mr-2" />
              </template>
              <v-list-item-title class="text-body-2">
                Mark the document as <strong>verified</strong>
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="px-0">
              <template #prepend>
                <v-icon icon="mdi-account-check" color="success" size="20" class="mr-2" />
              </template>
              <v-list-item-title class="text-body-2">
                Record your name and timestamp
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="px-0">
              <template #prepend>
                <v-icon icon="mdi-lock-open" color="success" size="20" class="mr-2" />
              </template>
              <v-list-item-title class="text-body-2">
                Make the document available for use
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <!-- Notes textarea -->
        <v-textarea
          v-model="notes"
          label="Verification Notes"
          variant="outlined"
          density="comfortable"
          rows="3"
          placeholder="Add any notes about this verification (optional)..."
          hint="These notes will be saved with the verification record"
          persistent-hint
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" size="large" @click="handleCancel">
          Cancel
        </v-btn>
        <v-btn
          color="success"
          variant="flat"
          size="large"
          prepend-icon="mdi-check-circle"
          @click="handleConfirm"
        >
          Verify Document
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Document } from '~/types/document'
import { DOCUMENT_TYPE_CONFIG } from '~/types/document'

const props = defineProps<{
  modelValue: boolean
  document: Document | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [notes: string]
}>()

const notes = ref('')

const documentTypeLabel = computed(() =>
  props.document ? DOCUMENT_TYPE_CONFIG[props.document.type].label : ''
)

const getDocumentIcon = () => {
  if (!props.document) return 'mdi-file-document'
  return DOCUMENT_TYPE_CONFIG[props.document.type].icon
}

const getDocumentIconColor = () => {
  return 'success'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const handleConfirm = () => {
  emit('confirm', notes.value)
  emit('update:modelValue', false)
  notes.value = ''
}

const handleCancel = () => {
  emit('update:modelValue', false)
  notes.value = ''
}

// Reset notes when dialog closes
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    notes.value = ''
  }
})
</script>

<style scoped>
.verify-header {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  position: relative;
  overflow: hidden;
}

.verify-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.header-text {
  color: white;
  position: relative;
  z-index: 1;
}

.header-text h3,
.header-text p {
  color: white !important;
}

.verify-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
</style>
