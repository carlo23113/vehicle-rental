<template>
  <v-row>
    <v-col cols="12">
      <DocumentsTable
        :documents="displayedItems"
        @view="$emit('view', $event)"
        @verify="$emit('verify', $event)"
        @download="$emit('download', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more documents...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Document } from '~/types/document'

defineProps<{
  displayedItems: Document[]
  isLoadingMore: boolean
}>()

defineEmits<{
  view: [document: Document]
  verify: [document: Document]
  download: [document: Document]
}>()
</script>
