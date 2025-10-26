<template>
  <v-row>
    <v-col cols="12">
      <ClientOnly>
        <DocumentList
          :documents="displayedItems"
          :can-upload="false"
          :can-verify="true"
          :can-delete="true"
          @upload="$emit('upload', $event)"
          @verify="$emit('verify', $event)"
          @reject="$emit('reject', $event)"
          @delete="$emit('delete', $event)"
        />
      </ClientOnly>

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more documents...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Document, DocumentType } from '~/types/document'

defineProps<{
  displayedItems: Document[]
  isLoadingMore: boolean
}>()

defineEmits<{
  upload: [type: DocumentType]
  verify: [document: Document]
  reject: [document: Document]
  delete: [document: Document]
}>()
</script>
