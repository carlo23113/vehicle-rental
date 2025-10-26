<template>
  <v-row class="mb-6">
    <v-col v-for="stat in stats" :key="stat.label" cols="6" lg="3">
      <CommonUiStatCard v-bind="stat" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  unread: number
  high: number
  medium: number
}>()

const stats = computed(() => [
  { icon: 'mdi-bell', label: 'Total', value: props.total, color: 'primary' },
  { icon: 'mdi-bell-ring', label: 'Unread', value: props.unread, color: 'warning' },
  { icon: 'mdi-alert-circle', label: 'High Priority', value: props.high, color: 'error' },
  { icon: 'mdi-alert', label: 'Medium Priority', value: props.medium, color: 'info' },
])
</script>
