<template>
  <CommonUiDetailCard title="Personal Information" icon="mdi-account-details">
    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Full Name" icon="mdi-account" :value="fullName" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Email" icon="mdi-email" :value="customer.email" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Phone" icon="mdi-phone" :value="customer.phone" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Date of Birth" icon="mdi-cake-variant" :value="formattedDob" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Age" icon="mdi-calendar-account" :value="`${age} years old`" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Member Since" icon="mdi-calendar-plus" :value="formattedJoinDate" />
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Customer } from '~/types/customer'

interface Props {
  customer: Customer
  age: number
  fullName: string
  formatDate: (date: string) => string
}

const props = defineProps<Props>()

const formattedDob = computed(() => props.formatDate(props.customer.dateOfBirth))
const formattedJoinDate = computed(() => props.formatDate(props.customer.joinDate))
</script>
