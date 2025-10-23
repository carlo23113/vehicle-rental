<template>
  <v-row class="mb-6">
    <v-col cols="12">
      <CommonPageFilters
        title="Filters"
        subtitle="Refine your role search"
        icon="mdi-filter-variant"
      >
        <v-row dense>
          <v-col cols="12" md="8">
            <v-text-field
              :model-value="search"
              @update:model-value="$emit('update:search', $event)"
              variant="outlined"
              density="comfortable"
              placeholder="Search roles by name or description..."
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              rounded="lg"
              class="search-field"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :model-value="module"
              @update:model-value="$emit('update:module', $event)"
              :items="moduleOptions"
              variant="outlined"
              density="comfortable"
              label="Filter by Module"
              prepend-inner-icon="mdi-folder-outline"
              hide-details
              rounded="lg"
            />
          </v-col>
        </v-row>
      </CommonPageFilters>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  search: string
  module: string
  moduleOptions: { title: string; value: string }[]
}>()

defineEmits<{
  'update:search': [value: string]
  'update:module': [value: string]
}>()
</script>
