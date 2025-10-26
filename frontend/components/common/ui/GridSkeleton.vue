<template>
  <v-row>
    <v-col v-for="i in items" :key="i" :cols="cols" :sm="sm" :md="md" :lg="lg">
      <v-skeleton-loader type="card" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  items?: number
  cols?: number | string
  sm?: number | string
  md?: number | string
  lg?: number | string
}>(), {
  items: 6,
  cols: 12,
  sm: 6,
  md: 4,
  lg: 3,
})
</script>
