<template>
  <v-menu>
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        :variant="variant"
        :color="color"
        :size="size"
        :prepend-icon="icon"
      >
        {{ label }}
        <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
      </v-btn>
    </template>

    <v-list density="compact" min-width="250">
      <!-- Basic Exports -->
      <v-list-subheader>Basic Exports</v-list-subheader>
      <v-list-item
        prepend-icon="mdi-file-delimited"
        title="Export as CSV"
        subtitle="Spreadsheet format"
        @click="$emit('export', 'csv')"
      />
      <v-list-item
        prepend-icon="mdi-file-pdf-box"
        title="Export as PDF"
        subtitle="Document format"
        @click="$emit('export', 'pdf')"
      />

      <v-divider class="my-1" />

      <!-- Rental-Specific Exports -->
      <v-list-subheader>Rental Reports</v-list-subheader>
      <v-list-item
        prepend-icon="mdi-file-document-multiple"
        title="Download All Contracts"
        subtitle="PDF contracts for rentals"
        :disabled="!hasRentals"
        @click="$emit('download-contracts')"
      />
      <v-list-item
        prepend-icon="mdi-chart-box"
        title="Summary Report"
        subtitle="Comprehensive analytics"
        :disabled="!hasRentals"
        @click="$emit('generate-summary')"
      />
      <v-list-item
        prepend-icon="mdi-calendar-month"
        title="Monthly Report"
        subtitle="Monthly breakdown"
        :disabled="!hasRentals"
        @click="$emit('generate-monthly')"
      />

      <v-divider class="my-1" />

      <!-- Advanced Options -->
      <v-list-item
        prepend-icon="mdi-cog"
        title="Export Options..."
        subtitle="Advanced settings"
        @click="$emit('open-dialog')"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import type { ExportFormat } from '~/composables/useExport'

export interface RentalsExportMenuProps {
  label?: string
  icon?: string
  variant?: 'flat' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'plain'
  color?: string
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  hasRentals?: boolean
}

withDefaults(defineProps<RentalsExportMenuProps>(), {
  label: 'Export',
  icon: 'mdi-download',
  variant: 'outlined',
  color: 'primary',
  size: 'default',
  hasRentals: true,
})

defineEmits<{
  export: [format: ExportFormat]
  'open-dialog': []
  'download-contracts': []
  'generate-summary': []
  'generate-monthly': []
}>()
</script>
