<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="1000px"
    scrollable
  >
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between pa-6 no-print">
        <div class="d-flex align-center ga-2">
          <v-icon color="primary">mdi-file-eye</v-icon>
          <span class="text-h6">{{ title }}</span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)" />
      </v-card-title>
      <v-divider class="no-print" />
      <v-card-text style="max-height: 80vh" class="print-contract-content">
        <slot />
      </v-card-text>
      <v-divider class="no-print" />
      <v-card-actions class="pa-4 no-print">
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">Close</v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-printer" @click="$emit('print')">
          Print
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
  }>(),
  {
    title: 'Full Contract Preview',
  }
)

defineEmits<{
  'update:modelValue': [value: boolean]
  print: []
}>()
</script>
