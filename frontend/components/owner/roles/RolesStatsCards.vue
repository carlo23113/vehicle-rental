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
  totalRoles: number
  totalUsers: number
  totalPermissions: number
  customRoles: number
}>()

const stats = computed(() => [
  { icon: 'mdi-shield-account', label: 'Total Roles', value: props.totalRoles, color: 'primary' },
  { icon: 'mdi-account-multiple', label: 'Total Users', value: props.totalUsers, color: 'success' },
  { icon: 'mdi-lock-check', label: 'Permissions', value: props.totalPermissions, color: 'info' },
  { icon: 'mdi-shield-lock', label: 'Custom Roles', value: props.customRoles, color: 'warning' },
])
</script>
