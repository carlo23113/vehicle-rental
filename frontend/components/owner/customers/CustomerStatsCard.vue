<template>
  <CommonUiDetailCard title="Customer Statistics" icon="mdi-chart-box">
    <v-row>
      <v-col cols="12">
        <CommonUiDetailItem label="Total Rentals" icon="mdi-car-multiple">
          <v-chip color="primary" variant="tonal" size="small">
            <v-icon icon="mdi-car-multiple" start size="14" />
            {{ customer.totalRentals }}
          </v-chip>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12">
        <CommonUiDetailItem label="Total Spent" :icon="currencyIcon">
          <v-chip color="success" variant="tonal" size="small">
            <v-icon :icon="currencyIcon" start size="14" />
            {{ formatCurrency(customer.totalSpent) }}
          </v-chip>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12">
        <CommonUiDetailItem label="Average per Rental" icon="mdi-cash">
          <v-chip color="info" variant="tonal" size="small">
            <v-icon icon="mdi-cash" start size="14" />
            {{ formatCurrency(averagePerRental) }}
          </v-chip>
        </CommonUiDetailItem>
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '~/composables/useCurrency'
import type { Customer } from '~/types/customer'

interface Props {
  customer: Customer
}

const props = defineProps<Props>()

const { formatCurrency, getCurrencyIcon } = useCurrency()

const currencyIcon = computed(() => getCurrencyIcon())

const averagePerRental = computed(() => {
  if (props.customer.totalRentals === 0) return 0
  return props.customer.totalSpent / props.customer.totalRentals
})
</script>
