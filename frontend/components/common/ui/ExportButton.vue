<template>
  <v-menu>
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="mergedProps(menuProps)"
        :variant="variant"
        :color="color"
        :size="size"
        :prepend-icon="icon"
      >
        {{ label }}
        <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
      </v-btn>
    </template>

    <v-list density="compact" min-width="200">
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

export interface ExportButtonProps {
  label?: string
  icon?: string
  variant?: 'flat' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'plain'
  color?: string
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}

withDefaults(defineProps<ExportButtonProps>(), {
  label: 'Export',
  icon: 'mdi-download',
  variant: 'outlined',
  color: 'primary',
  size: 'default',
})

defineEmits<{
  export: [format: ExportFormat]
  'open-dialog': []
}>()

// Helper to merge props
const mergedProps = (menuProps: any) => {
  return { ...menuProps }
}
</script>
