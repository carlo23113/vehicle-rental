<template>
  <div class="d-flex justify-end mb-4">
    <v-btn-toggle :model-value="modelValue" mandatory variant="outlined" divided density="comfortable" @update:model-value="$emit('update:modelValue', $event)">
      <v-btn value="grid" size="small">
        <v-icon>mdi-view-grid</v-icon>
        <span class="ml-2 d-none d-sm-inline">Grid</span>
      </v-btn>
      <v-btn value="table" size="small">
        <v-icon>mdi-view-list</v-icon>
        <span class="ml-2 d-none d-sm-inline">Table</span>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'grid' | 'table'
}>()

defineEmits<{
  'update:modelValue': [value: 'grid' | 'table']
}>()
</script>
