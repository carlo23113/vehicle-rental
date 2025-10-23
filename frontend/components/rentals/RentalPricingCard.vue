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

    <template v-if="paymentStatus">
      <v-divider class="my-3" />

      <div class="mb-3">
        <div class="text-caption text-medium-emphasis mb-2">Payment Status</div>
        <v-chip :color="getPaymentStatusColor(paymentStatus)" size="small" variant="flat" class="payment-chip">
          <v-icon icon="mdi-cash" start size="14" />
          {{ paymentStatus }}
        </v-chip>
      </div>

      <div v-if="depositAmount !== undefined" class="d-flex justify-space-between align-center">
        <span class="text-body-2">Deposit Paid</span>
        <span class="text-body-2 font-weight-medium">{{ formatCurrency(depositAmount) }}</span>
      </div>

      <div class="d-flex justify-space-between align-center mt-2">
        <span class="text-body-2">Remaining Balance</span>
        <span class="text-body-2 font-weight-medium text-warning">{{ formatCurrency(remainingBalance) }}</span>
      </div>
    </template>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '~/composables/useCurrency'

interface Props {
  dailyRate: number
  days: number
  rateType: 'city' | 'province'
  mileageLimit?: number
  total: number
  paymentStatus?: string
  depositAmount?: number
}

const props = defineProps<Props>()

const { formatCurrency } = useCurrency()

const subtotal = props.days * props.dailyRate

const remainingBalance = computed(() => {
  if (props.depositAmount === undefined) return 0
  return props.total - props.depositAmount
})

const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'warning',
    partial: 'info',
    paid: 'success',
  }
  return colors[status] || 'default'
}
</script>

<style scoped>
.payment-chip {
  text-transform: capitalize;
  font-weight: 600;
}
</style>
