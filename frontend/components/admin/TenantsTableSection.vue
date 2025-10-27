<template>
  <v-row>
    <v-col cols="12">
      <TenantsTable
        :tenants="tenants"
        :get-status-color="getStatusColor"
        :get-plan-color="getPlanColor"
        :format-date="formatDate"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @suspend="$emit('suspend', $event)"
        @activate="$emit('activate', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more tenants...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Tenant, TenantStatus, SubscriptionPlan } from '~/types/tenant'

defineProps<{
  tenants: Tenant[]
  isLoadingMore: boolean
  getStatusColor: (status: TenantStatus) => string
  getPlanColor: (plan: SubscriptionPlan) => string
  formatDate: (date: string) => string
}>()

defineEmits<{
  view: [tenant: Tenant]
  edit: [tenant: Tenant]
  delete: [tenant: Tenant]
  suspend: [tenant: Tenant]
  activate: [tenant: Tenant]
}>()
</script>
