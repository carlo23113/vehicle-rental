<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="0" class="border border-gray-200/12 rounded-xl bg-surface pa-3">
        <v-row dense>
          <v-col cols="12" md="8">
            <v-text-field
              :model-value="search"
              @update:model-value="$emit('update:search', $event)"
              variant="outlined"
              density="compact"
              placeholder="Search roles by name or description..."
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :model-value="module"
              @update:model-value="$emit('update:module', $event)"
              :items="moduleOptions"
              variant="outlined"
              density="compact"
              label="Filter by Module"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </v-card>
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
