<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
  >
    <v-card class="export-dialog">
      <v-card-title class="d-flex align-center gap-3 pa-6 pb-4">
        <v-icon icon="mdi-download" size="28" color="primary" />
        <div>
          <div class="text-h5 font-weight-bold">Export Report</div>
          <div class="text-caption text-medium-emphasis mt-1">
            Download your analytics report in your preferred format
          </div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <div class="mb-4">
          <div class="text-body-2 font-weight-bold mb-3">Select Format</div>
          <v-btn-toggle
            :model-value="format"
            @update:model-value="$emit('update:format', $event)"
            mandatory
            color="primary"
            variant="outlined"
            divided
            class="w-100"
          >
            <v-btn value="pdf" class="flex-1-1">
              <v-icon start>mdi-file-pdf-box</v-icon>
              PDF
            </v-btn>
            <v-btn value="csv" class="flex-1-1">
              <v-icon start>mdi-file-delimited</v-icon>
              CSV
            </v-btn>
            <v-btn value="excel" class="flex-1-1">
              <v-icon start>mdi-file-excel</v-icon>
              Excel
            </v-btn>
          </v-btn-toggle>
        </div>

        <div class="report-info pa-4 rounded-lg">
          <div class="d-flex align-center gap-3 mb-3">
            <v-icon icon="mdi-calendar-range" color="primary" />
            <div>
              <div class="text-caption text-medium-emphasis">Report Period</div>
              <div class="text-body-1 font-weight-medium">{{ startDate }} to {{ endDate }}</div>
            </div>
          </div>
          <v-divider class="my-3" />
          <div class="d-flex align-center gap-3">
            <v-icon icon="mdi-chart-box" color="primary" />
            <div>
              <div class="text-caption text-medium-emphasis">Includes</div>
              <div class="text-body-2">
                Revenue trends, vehicle utilization, top customers, and location performance
              </div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)" :disabled="loading">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="loading"
          @click="$emit('export')"
          prepend-icon="mdi-download"
          size="large"
        >
          Export Report
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  format: string
  startDate: string
  endDate: string
  loading: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:format': [value: string]
  export: []
}>()
</script>

<style scoped>
.report-info {
  border: 1px solid rgba(var(--v-border-color), 0.12);
}
</style>
