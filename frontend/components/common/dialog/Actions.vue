<template>
  <v-card-actions class="px-7 py-4">
    <v-spacer />
    <v-btn variant="text" @click="$emit('cancel')">
      {{ cancelText }}
    </v-btn>
    <v-btn color="primary" variant="flat" @click="$emit('confirm')">
      {{ confirmText }}
    </v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    cancelText?: string
    confirmText?: string
  }>(),
  {
    cancelText: 'Cancel',
    confirmText: 'Save'
  }
)

defineEmits<{
  cancel: []
  confirm: []
}>()
</script>
