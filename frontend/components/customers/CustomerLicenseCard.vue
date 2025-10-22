<template>
  <CommonUiDetailCard title="Driver's License Information" icon="mdi-card-account-details">
    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="License Number" icon="mdi-card-account-details-outline" :value="customer.driversLicense" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Expiry Date" icon="mdi-calendar-clock" :value="formattedExpiry" />
      </v-col>
    </v-row>

    <!-- License Status Alert -->
    <v-alert
      v-if="isExpired"
      type="error"
      variant="tonal"
      class="mt-4"
      border="start"
    >
      <template #text>
        <div class="text-subtitle-2 font-weight-medium">License Expired</div>
        <div class="text-caption mt-1">
          This driver's license has expired. Customer cannot rent vehicles until renewed.
        </div>
      </template>
    </v-alert>

    <v-alert
      v-else-if="isExpiringSoon"
      type="warning"
      variant="tonal"
      class="mt-4"
      border="start"
    >
      <template #text>
        <div class="text-subtitle-2 font-weight-medium">License Expiring Soon</div>
        <div class="text-caption mt-1">
          This driver's license will expire within 90 days. Please remind customer to renew.
        </div>
      </template>
    </v-alert>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Customer } from '~/types/customer'

interface Props {
  customer: Customer
  formatDate: (date: string) => string
  isExpired: boolean
  isExpiringSoon: boolean
}

const props = defineProps<Props>()

const formattedExpiry = computed(() => props.formatDate(props.customer.licenseExpiry))
</script>
