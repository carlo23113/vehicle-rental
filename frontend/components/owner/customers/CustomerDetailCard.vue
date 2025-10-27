<template>
  <v-card variant="tonal" color="primary" class="customer-detail-card">
    <v-card-text class="pa-4">
      <div class="d-flex align-start" style="gap: 16px">
        <v-avatar color="primary" size="56" class="text-white">
          <span class="text-h6 font-weight-bold">{{ customer.initials }}</span>
        </v-avatar>
        <div class="flex-1-1">
          <h4 class="text-subtitle-1 font-weight-bold mb-2">
            {{ customer.fullName }}
          </h4>
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="d-flex align-center ga-2 text-body-2">
                <v-icon icon="mdi-email" size="16" />
                <span>{{ customer.email }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="d-flex align-center ga-2 text-body-2">
                <v-icon icon="mdi-phone" size="16" />
                <span>{{ customer.phone }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="d-flex align-center ga-2 text-body-2">
                <v-icon icon="mdi-card-account-details" size="16" />
                <span>DL: {{ customer.driversLicense }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="d-flex align-center ga-2 text-body-2">
                <v-icon icon="mdi-calendar-check" size="16" />
                <span>{{ customer.totalRentals }} rentals</span>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface CustomerDetail {
  fullName: string
  initials: string
  email: string
  phone: string
  driversLicense: string
  totalRentals: number
}

defineProps<{
  customer: CustomerDetail
}>()
</script>

<style scoped>
.customer-detail-card {
  border-radius: 14px;
}
</style>
