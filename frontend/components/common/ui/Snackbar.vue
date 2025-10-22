<template>
  <v-snackbar
    :model-value="modelValue.show"
    :color="modelValue.color"
    :timeout="timeout"
    :location="location"
    @update:model-value="$emit('update:modelValue', { ...modelValue, show: $event })"
  >
    <div class="flex items-center gap-2">
      <v-icon :icon="modelValue.icon" />
      {{ modelValue.message }}
    </div>
    <template #actions>
      <v-btn
        variant="text"
        icon="mdi-close"
        @click="$emit('update:modelValue', { ...modelValue, show: false })"
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
interface SnackbarState {
  show: boolean
  message: string
  color: 'success' | 'error' | 'warning' | 'info'
  icon: string
}

interface Props {
  modelValue: SnackbarState
  timeout?: number
  location?: 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'
}

withDefaults(defineProps<Props>(), {
  timeout: 4000,
  location: 'top'
})

defineEmits<{
  'update:modelValue': [value: SnackbarState]
}>()
</script>
