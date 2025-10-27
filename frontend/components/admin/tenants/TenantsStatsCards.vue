<template>
  <v-row>
    <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
      <CommonUiStatCard
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
        :color="stat.color"
        :trend="stat.trend"
        :change="stat.change"
        :variant="stat.variant"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  totalTenants: number
  activeTenants: number
  trialTenants: number
  revenue?: string
}

const props = withDefaults(defineProps<Props>(), {
  revenue: '$0',
})

const stats = computed(() => [
  {
    label: 'Total Tenants',
    value: props.totalTenants.toString(),
    icon: 'mdi-office-building',
    color: 'primary',
    trend: 'up' as const,
    change: '+12%',
    variant: 'detailed' as const,
  },
  {
    label: 'Active Tenants',
    value: props.activeTenants.toString(),
    icon: 'mdi-check-circle',
    color: 'success',
    trend: 'up' as const,
    change: '+8%',
    variant: 'detailed' as const,
  },
  {
    label: 'Trial Tenants',
    value: props.trialTenants.toString(),
    icon: 'mdi-clock-outline',
    color: 'warning',
    trend: 'up' as const,
    change: '+5',
    variant: 'detailed' as const,
  },
  {
    label: 'Revenue (MRR)',
    value: props.revenue,
    icon: 'mdi-currency-usd',
    color: 'info',
    trend: 'up' as const,
    change: '+15%',
    variant: 'detailed' as const,
  },
])
</script>
