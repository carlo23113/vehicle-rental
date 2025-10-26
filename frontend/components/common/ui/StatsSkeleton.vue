<template>
  <v-row class="mb-6">
    <v-col v-for="i in items" :key="i" :cols="cols" :sm="sm" :lg="lg">
      <v-card v-if="cardWrapper">
        <v-skeleton-loader :type="type" />
      </v-card>
      <v-skeleton-loader v-else :type="type" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  items?: number
  cols?: number | string
  sm?: number | string
  lg?: number | string
  type?: string
  cardWrapper?: boolean
}>(), {
  items: 4,
  cols: 12,
  sm: 6,
  lg: 3,
  type: 'list-item-avatar-two-line',
  cardWrapper: true,
})
</script>
