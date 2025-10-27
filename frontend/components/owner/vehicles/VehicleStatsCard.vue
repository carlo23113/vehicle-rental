<template>
  <CommonUiDetailCard title="Statistics" icon="mdi-chart-box">
    <CommonUiDetailItem label="Total Rentals" icon="mdi-key-variant" :value="stats.totalRentals" />
    <CommonUiDetailItem label="Revenue Generated" icon="mdi-cash" :value="formatCurrency(stats.revenueGenerated)" />
    <CommonUiDetailItem label="Average Rating" icon="mdi-star">
      <div class="flex items-center gap-1">
        <v-icon icon="mdi-star" size="16" color="warning" />
        <span class="font-bold">{{ stats.averageRating }}</span>
        <span class="text-medium-emphasis text-sm">({{ stats.totalReviews }} reviews)</span>
      </div>
    </CommonUiDetailItem>
    <CommonUiDetailItem label="Last Service" icon="mdi-tools" :value="stats.lastService" />
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency'

const { formatCurrency } = useCurrency()

interface Props {
  stats: {
    totalRentals: string | number
    revenueGenerated: number
    averageRating: string | number
    totalReviews: string | number
    lastService: string
  }
}

withDefaults(defineProps<Props>(), {
  stats: () => ({
    totalRentals: '24',
    revenueGenerated: 12450,
    averageRating: '4.8',
    totalReviews: '18',
    lastService: 'Jan 15, 2025'
  })
})
</script>
