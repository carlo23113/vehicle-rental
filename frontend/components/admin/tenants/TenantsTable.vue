<template>
  <CommonUiDataTable
    :headers="headers"
    :items="[]"
    :loading="false"
    empty-icon="mdi-car-off"
    empty-title="No tenants found"
    empty-message="Try adjusting your filters or add a new tenants"
    @row-click="$emit('view', $event)"
  >
    <!-- Tenant Name -->
    <template #item.name="{ item }">
      <div class="py-3">
        <div class="font-weight-medium">{{ item.name }}</div>
        <div class="text-caption text-medium-emphasis">{{ item.slug }}</div>
      </div>
    </template>

    <!-- Contact -->
    <template #item.contact="{ item }">
      <div>
        <div class="font-weight-medium">{{ item.contactPerson }}</div>
        <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
      </div>
    </template>

    <!-- Plan -->
    <template #item.plan="{ item }">
      <CommonUiTableChip :text="item.plan" :color="getPlanColor(item.plan)" />
    </template>

    <!-- Status -->
    <template #item.status="{ item }">
      <CommonUiTableChip :text="item.status" :color="getStatusColor(item.status)" />
    </template>

    <!-- Usage -->
    <template #item.usage="{ item }">
      <div class="text-caption">
        <div>Users: {{ item.currentUsers }}/{{ item.maxUsers }}</div>
        <div>Vehicles: {{ item.currentVehicles }}/{{ item.maxVehicles }}</div>
      </div>
    </template>

    <!-- Created Date -->
    <template #item.createdAt="{ item }">
      <span class="text-caption">{{ formatDate(item.createdAt) }}</span>
    </template>

    <!-- Actions -->
    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        @view="$emit('view', item)"
        @edit="$emit('edit', item)"
        @delete="$emit('delete', item)"
      >
        <template #additional>
          <v-btn
            v-if="item.status === 'active'"
            icon
            size="small"
            variant="text"
            color="warning"
            @click.stop="$emit('suspend', item)"
          >
            <v-icon size="18">mdi-pause-circle</v-icon>
            <v-tooltip activator="parent" location="top">Suspend</v-tooltip>
          </v-btn>
          <v-btn
            v-if="item.status === 'suspended'"
            icon
            size="small"
            variant="text"
            color="success"
            @click.stop="$emit('activate', item)"
          >
            <v-icon size="18">mdi-play-circle</v-icon>
            <v-tooltip activator="parent" location="top">Activate</v-tooltip>
          </v-btn>
        </template>
      </CommonUiTableActionButtons>
    </template>
  </CommonUiDataTable>
</template>

<script setup lang="ts">
import type { Tenant, TenantStatus, SubscriptionPlan } from '~/types/tenant'

interface Props {
  tenants: Tenant[]
  getStatusColor: (status: TenantStatus) => string
  getPlanColor: (plan: SubscriptionPlan) => string
  formatDate: (date: string) => string
}

defineProps<Props>()

defineEmits<{
  view: [tenant: Tenant]
  edit: [tenant: Tenant]
  delete: [tenant: Tenant]
  suspend: [tenant: Tenant]
  activate: [tenant: Tenant]
}>()

const headers = [
  { title: 'Tenant', key: 'name', sortable: true },
  { title: 'Contact', key: 'contact', sortable: false },
  { title: 'Plan', key: 'plan', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Usage', key: 'usage', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
]
</script>
