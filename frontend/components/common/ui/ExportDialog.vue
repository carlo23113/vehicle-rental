<template>
  <v-dialog v-model="dialogModel" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center gap-2 bg-primary pa-4">
        <v-icon icon="mdi-download" size="24" />
        <span class="text-h6">Export {{ entityName }}</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Export Format Selection -->
        <div class="mb-4">
          <label class="text-subtitle-2 font-weight-bold mb-2 d-block">
            Export Format
          </label>
          <v-btn-toggle
            v-model="selectedFormat"
            mandatory
            variant="outlined"
            divided
            class="d-flex"
          >
            <v-btn value="csv" prepend-icon="mdi-file-delimited">
              CSV
            </v-btn>
            <v-btn value="pdf" prepend-icon="mdi-file-pdf-box">
              PDF
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Export Scope Selection -->
        <div class="mb-4">
          <label class="text-subtitle-2 font-weight-bold mb-2 d-block">
            Export Scope
          </label>
          <v-radio-group v-model="exportScope" hide-details>
            <v-radio
              value="all"
              :label="`All ${entityName} (${totalCount})`"
            />
            <v-radio
              v-if="filteredCount !== totalCount"
              value="filtered"
              :label="`Filtered ${entityName} (${filteredCount})`"
            />
            <v-radio
              v-if="selectedCount > 0"
              value="selected"
              :label="`Selected ${entityName} (${selectedCount})`"
            />
          </v-radio-group>
        </div>

        <!-- Additional Options -->
        <v-expansion-panels variant="accordion" class="mb-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon icon="mdi-cog" class="mr-2" />
              Advanced Options
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-checkbox
                v-model="includeTimestamp"
                label="Include timestamp in filename"
                hide-details
                density="compact"
              />
              <v-text-field
                v-model="customFilename"
                label="Custom Filename (optional)"
                placeholder="Leave empty for default"
                variant="outlined"
                density="compact"
                class="mt-3"
                hide-details
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Format Info -->
        <v-alert
          v-if="selectedFormat === 'csv'"
          type="info"
          variant="tonal"
          density="compact"
        >
          <div class="text-caption">
            <strong>CSV Format:</strong> Best for importing into Excel or Google Sheets
          </div>
        </v-alert>

        <v-alert
          v-if="selectedFormat === 'pdf'"
          type="info"
          variant="tonal"
          density="compact"
        >
          <div class="text-caption">
            <strong>PDF Format:</strong> Best for printing and sharing reports
          </div>
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="handleCancel">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          prepend-icon="mdi-download"
          @click="handleExport"
        >
          Export
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { ExportFormat } from '~/composables/useExport'

export interface ExportDialogProps {
  modelValue: boolean
  entityName: string
  totalCount: number
  filteredCount: number
  selectedCount: number
  loading?: boolean
  defaultFormat?: ExportFormat
  defaultFilename?: string
}

const props = withDefaults(defineProps<ExportDialogProps>(), {
  loading: false,
  defaultFormat: 'csv',
  defaultFilename: 'export',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  export: [payload: {
    format: ExportFormat
    scope: 'all' | 'filtered' | 'selected'
    filename: string
    includeTimestamp: boolean
  }]
  cancel: []
}>()

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const selectedFormat = ref<ExportFormat>(props.defaultFormat)
const exportScope = ref<'all' | 'filtered' | 'selected'>('all')
const customFilename = ref('')
const includeTimestamp = ref(true)

// Auto-select appropriate default scope
watch(() => props.selectedCount, (newCount) => {
  if (newCount > 0 && exportScope.value === 'all') {
    exportScope.value = 'selected'
  }
})

const handleExport = () => {
  emit('export', {
    format: selectedFormat.value,
    scope: exportScope.value,
    filename: customFilename.value || props.defaultFilename,
    includeTimestamp: includeTimestamp.value,
  })
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

// Reset form when dialog closes
watch(dialogModel, (newValue) => {
  if (!newValue) {
    selectedFormat.value = props.defaultFormat
    exportScope.value = 'all'
    customFilename.value = ''
    includeTimestamp.value = true
  }
})
</script>

<style scoped>
.v-card-title {
  color: white;
}
</style>
