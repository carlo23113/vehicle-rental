<template>
  <v-row class="mb-6">
    <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" lg="3">
      <CommonUiStatCard v-bind="stat" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  stats: Array<{
    icon: string
    label: string
    value: number | string
    color: string
  }>
}>()
</script>
