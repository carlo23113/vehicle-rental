<template>
  <CommonUiDetailCard title="Address Information" icon="mdi-map-marker">
    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Street Address" icon="mdi-home" :value="customer.address" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="City" icon="mdi-city" :value="customer.city" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="State" icon="mdi-map" :value="customer.state" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="ZIP Code" icon="mdi-mailbox" :value="customer.zipCode" />
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import type { Customer } from '~/types/customer'

interface Props {
  customer: Customer
}

defineProps<Props>()
</script>
