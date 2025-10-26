<template>
  <v-card>
    <v-card-title class="pa-6">
      <h2 class="text-h5 font-weight-bold">Select Document Type</h2>
      <p class="text-caption text-medium-emphasis mt-2">
        Choose the type of document you want to upload
      </p>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-6">
      <v-text-field
        v-model="search"
        variant="outlined"
        density="comfortable"
        placeholder="Search document types..."
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-details
        class="mb-4"
      />

      <v-row>
        <v-col
          v-for="(config, type) in filteredDocumentTypes"
          :key="type"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="document-type-card"
            :class="{ 'required': config.required }"
            elevation="0"
            @click="selectType(type as DocumentType)"
          >
            <v-card-text class="pa-4">
              <div class="d-flex align-center mb-3">
                <v-avatar
                  :color="config.required ? 'error' : 'primary'"
                  size="48"
                  class="mr-3"
                >
                  <v-icon :icon="config.icon" color="white" size="24" />
                </v-avatar>
                <div class="flex-grow-1">
                  <h4 class="text-body-1 font-weight-bold">{{ config.label }}</h4>
                  <v-chip
                    v-if="config.required"
                    color="error"
                    size="x-small"
                    variant="flat"
                    class="mt-1"
                  >
                    Required
                  </v-chip>
                </div>
              </div>

              <p class="text-caption text-medium-emphasis">
                {{ config.description }}
              </p>

              <div class="mt-3">
                <v-chip
                  v-if="config.expiryRequired"
                  size="x-small"
                  variant="tonal"
                  color="warning"
                  prepend-icon="mdi-calendar-alert"
                  class="mr-1"
                >
                  Expiry Date Required
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div v-if="Object.keys(filteredDocumentTypes).length === 0" class="text-center py-8">
        <v-icon icon="mdi-file-search" size="48" color="grey-lighten-1" />
        <p class="text-body-1 text-medium-emphasis mt-4">No document types found</p>
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="pa-6">
      <v-spacer />
      <v-btn variant="text" @click="$emit('cancel')">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DocumentType } from '~/types/document'
import { DOCUMENT_TYPE_CONFIG } from '~/types/document'

const emit = defineEmits<{
  select: [type: DocumentType]
  cancel: []
}>()

const search = ref('')

const filteredDocumentTypes = computed(() => {
  const searchLower = search.value.toLowerCase()
  if (!searchLower) return DOCUMENT_TYPE_CONFIG

  return Object.fromEntries(
    Object.entries(DOCUMENT_TYPE_CONFIG).filter(([key, config]) =>
      config.label.toLowerCase().includes(searchLower) ||
      config.description.toLowerCase().includes(searchLower)
    )
  )
})

const selectType = (type: DocumentType) => {
  emit('select', type)
}
</script>

<style scoped>
.document-type-card {
  border: 2px solid rgba(var(--v-border-color), 0.12);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.document-type-card:hover {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.15);
}

.document-type-card.required {
  border-color: rgba(var(--v-theme-error), 0.3);
  background: rgba(var(--v-theme-error), 0.02);
}

.document-type-card.required:hover {
  border-color: rgb(var(--v-theme-error));
  background: rgba(var(--v-theme-error), 0.08);
}
</style>
