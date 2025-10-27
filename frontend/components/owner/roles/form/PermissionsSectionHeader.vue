<template>
  <div class="mb-4">
    <div class="flex items-center justify-between">
      <CommonUiSectionHeader title="Permissions" subtitle="Select what this role can access" />
      <v-chip size="small" variant="tonal" color="primary"> {{ selectedCount }} selected </v-chip>
    </div>
  </div>

  <div class="mb-3 flex gap-2">
    <v-btn
      size="small"
      variant="tonal"
      prepend-icon="mdi-checkbox-multiple-marked"
      @click="$emit('select-all')"
    >
      Select All
    </v-btn>
    <v-btn
      size="small"
      variant="text"
      prepend-icon="mdi-close-box-multiple"
      @click="$emit('clear-all')"
    >
      Clear All
    </v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedCount: number
}>()

defineEmits<{
  'select-all': []
  'clear-all': []
}>()
</script>
