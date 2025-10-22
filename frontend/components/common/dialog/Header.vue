<template>
  <v-card-title class="bg-surface border-b border-gray-200/8 px-7 py-5">
    <div class="d-flex align-center justify-space-between w-100">
      <h2 class="text-lg font-semibold text-on-surface/87 mb-0">
        <slot />
      </h2>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        density="comfortable"
        @click="$emit('close')"
      />
    </div>
  </v-card-title>
</template>

<script setup lang="ts">
defineEmits<{
  close: []
}>()
</script>
