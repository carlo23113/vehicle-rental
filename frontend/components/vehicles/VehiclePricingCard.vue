<template>
  <CommonUiDetailCard title="Pricing" icon="mdi-currency-usd">
    <div class="mb-4">
      <div class="text-caption text-medium-emphasis mb-1">City Drive</div>
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-city" size="20" color="primary" />
        <span class="text-h5 font-weight-bold">{{ formatCurrency(vehicle.rates.cityRate) }}</span>
        <span class="text-caption">/day</span>
      </div>
    </div>
    <v-divider class="my-3" />
    <div>
      <div class="text-caption text-medium-emphasis mb-1">Province Drive</div>
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-map-marker-distance" size="20" color="secondary" />
        <span class="text-h5 font-weight-bold">{{ formatCurrency(vehicle.rates.provinceRate) }}</span>
        <span class="text-caption">/day</span>
      </div>
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency'

interface Props {
  vehicle: {
    rates: {
      cityRate: number
      provinceRate: number
    }
  }
}

defineProps<Props>()

const { formatCurrency } = useCurrency()
</script>
