<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="800">
    <v-card v-if="tenant">
      <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
        <span class="text-h5 text-white">Tenant Details</span>
        <v-btn icon variant="text" @click="$emit('update:modelValue', false)">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Header Info -->
        <div class="mb-6">
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <h2 class="text-h4 font-weight-bold">{{ tenant.name }}</h2>
              <p class="text-body-1 text-medium-emphasis">{{ tenant.slug }}</p>
            </div>
            <div class="text-right">
              <v-chip :color="getStatusColor(tenant.status)" variant="flat" class="mb-2">
                {{ tenant.status }}
              </v-chip>
              <br />
              <v-chip :color="getPlanColor(tenant.plan)" variant="flat">
                {{ tenant.plan }} Plan
              </v-chip>
            </div>
          </div>
        </div>

        <v-divider class="my-4" />

        <!-- Contact Information -->
        <div class="mb-6">
          <h3 class="text-h6 mb-3">Contact Information</h3>
          <v-row>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <div class="text-caption text-medium-emphasis">Contact Person</div>
                <div class="font-weight-medium">{{ tenant.contactPerson }}</div>
              </div>
              <div class="mb-3">
                <div class="text-caption text-medium-emphasis">Email</div>
                <div class="font-weight-medium">{{ tenant.email }}</div>
              </div>
              <div v-if="tenant.phone" class="mb-3">
                <div class="text-caption text-medium-emphasis">Phone</div>
                <div class="font-weight-medium">{{ tenant.phone }}</div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div v-if="tenant.domain" class="mb-3">
                <div class="text-caption text-medium-emphasis">Custom Domain</div>
                <div class="font-weight-medium">{{ tenant.domain }}</div>
              </div>
              <div class="mb-3">
                <div class="text-caption text-medium-emphasis">Created Date</div>
                <div class="font-weight-medium">{{ formatDate(tenant.createdAt) }}</div>
              </div>
              <div v-if="tenant.expiresAt" class="mb-3">
                <div class="text-caption text-medium-emphasis">Expires At</div>
                <div class="font-weight-medium">{{ formatDate(tenant.expiresAt) }}</div>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-4" />

        <!-- Usage Statistics -->
        <div class="mb-6">
          <h3 class="text-h6 mb-3">Usage Statistics</h3>
          <v-row>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-caption text-medium-emphasis">Users</span>
                  <span class="text-caption font-weight-medium">{{ tenant.currentUsers }}/{{ tenant.maxUsers }}</span>
                </div>
                <v-progress-linear
                  :model-value="(tenant.currentUsers / tenant.maxUsers) * 100"
                  :color="getUsageColor((tenant.currentUsers / tenant.maxUsers) * 100)"
                  height="8"
                  rounded
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-caption text-medium-emphasis">Vehicles</span>
                  <span class="text-caption font-weight-medium">{{ tenant.currentVehicles }}/{{ tenant.maxVehicles }}</span>
                </div>
                <v-progress-linear
                  :model-value="(tenant.currentVehicles / tenant.maxVehicles) * 100"
                  :color="getUsageColor((tenant.currentVehicles / tenant.maxVehicles) * 100)"
                  height="8"
                  rounded
                />
              </div>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-4" />

        <!-- Features -->
        <div class="mb-6">
          <h3 class="text-h6 mb-3">Enabled Features</h3>
          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="feature in tenant.features"
              :key="feature"
              color="primary"
              variant="outlined"
              size="small"
            >
              {{ formatFeature(feature) }}
            </v-chip>
            <v-chip v-if="tenant.features.length === 0" variant="outlined" size="small">
              No features enabled
            </v-chip>
          </div>
        </div>

        <!-- Billing Information -->
        <div v-if="tenant.billingInfo" class="mb-6">
          <v-divider class="my-4" />
          <h3 class="text-h6 mb-3">Billing Information</h3>
          <v-row>
            <v-col cols="12">
              <div class="mb-2">
                <div class="text-caption text-medium-emphasis">Address</div>
                <div class="font-weight-medium">
                  {{ tenant.billingInfo.address }}<br />
                  {{ tenant.billingInfo.city }}, {{ tenant.billingInfo.state }} {{ tenant.billingInfo.zipCode }}<br />
                  {{ tenant.billingInfo.country }}
                </div>
              </div>
              <div v-if="tenant.billingInfo.taxId" class="mb-2">
                <div class="text-caption text-medium-emphasis">Tax ID</div>
                <div class="font-weight-medium">{{ tenant.billingInfo.taxId }}</div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Notes -->
        <div v-if="tenant.notes">
          <v-divider class="my-4" />
          <h3 class="text-h6 mb-3">Notes</h3>
          <p class="text-body-2">{{ tenant.notes }}</p>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 border-t">
        <v-btn
          v-if="tenant.status === 'active'"
          color="warning"
          variant="outlined"
          @click="$emit('suspend', tenant)"
        >
          <v-icon start>mdi-pause-circle</v-icon>
          Suspend Tenant
        </v-btn>
        <v-btn
          v-if="tenant.status === 'suspended'"
          color="success"
          variant="outlined"
          @click="$emit('activate', tenant)"
        >
          <v-icon start>mdi-play-circle</v-icon>
          Activate Tenant
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          @click="$emit('edit', tenant)"
        >
          <v-icon start>mdi-pencil</v-icon>
          Edit Tenant
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Tenant, TenantStatus, SubscriptionPlan } from '~/types/tenant'

interface Props {
  modelValue: boolean
  tenant: Tenant | null
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
  edit: [tenant: Tenant]
  suspend: [tenant: Tenant]
  activate: [tenant: Tenant]
}>()

const getStatusColor = (status: TenantStatus) => {
  const colors = {
    active: 'success',
    inactive: 'grey',
    suspended: 'error',
    trial: 'warning',
  }
  return colors[status] || 'grey'
}

const getPlanColor = (plan: SubscriptionPlan) => {
  const colors = {
    starter: 'info',
    professional: 'primary',
    enterprise: 'purple',
    custom: 'secondary',
  }
  return colors[plan] || 'grey'
}

const getUsageColor = (percentage: number) => {
  if (percentage >= 90) return 'error'
  if (percentage >= 70) return 'warning'
  return 'success'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatFeature = (feature: string) => {
  return feature
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>
