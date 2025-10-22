<template>
  <CommonUiDetailCard title="Pricing Details" icon="mdi-currency-usd">
    <div class="mb-4">
      <div class="text-caption text-medium-emphasis mb-1">Daily Rate</div>
      <div class="d-flex align-center ga-2">
        <v-icon :icon="rateType === 'city' ? 'mdi-city' : 'mdi-map-marker-distance'" size="20" :color="rateType === 'city' ? 'primary' : 'secondary'" />
        <span class="text-h5 font-weight-bold">{{ formatCurrency(dailyRate) }}</span>
        <span class="text-caption">/day</span>
      </div>
      <div class="text-caption text-medium-emphasis mt-1">
        {{ rateType === 'city' ? 'City Drive' : 'Province Drive' }}
      </div>
    </div>

    <v-divider class="my-3" />

    <div class="mb-4">
      <div class="d-flex justify-space-between align-center mb-2">
        <span class="text-body-2">{{ days }} day{{ days !== 1 ? 's' : '' }} × {{ formatCurrency(dailyRate) }}</span>
        <span class="text-body-2 font-weight-medium">{{ formatCurrency(subtotal) }}</span>
      </div>
      <div v-if="mileageLimit" class="text-caption text-medium-emphasis">
        Mileage limit: {{ mileageLimit }} miles/day
      </div>
    </div>

    <v-divider class="my-3" />

    <div class="d-flex justify-space-between align-center">
      <span class="text-subtitle-1 font-weight-bold">Total Amount</span>
      <span class="text-h4 font-weight-bold text-primary">{{ formatCurrency(total) }}</span>
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency'

interface Props {
  dailyRate: number
  days: number
  rateType: 'city' | 'province'
  mileageLimit?: number
  total: number
}

const props = defineProps<Props>()

const { formatCurrency } = useCurrency()

const subtotal = props.days * props.dailyRate
</script>
