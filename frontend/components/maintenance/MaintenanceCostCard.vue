<template>
  <CommonUiDetailCard title="Cost Details" icon="mdi-currency-usd">
    <div class="cost-display">
      <div class="cost-label">
        <v-icon icon="mdi-cash" size="20" class="mr-2" />
        {{ maintenance.status === 'completed' ? 'Actual Cost' : 'Estimated Cost' }}
      </div>
      <div class="cost-amount">{{ formatCurrency(maintenance.cost) }}</div>
    </div>

    <v-divider class="my-4" />

    <div v-if="maintenance.performedBy" class="provider-section">
      <div class="provider-label">
        <v-icon icon="mdi-account-wrench" size="18" class="mr-2" />
        Service Provider
      </div>
      <div class="provider-name">{{ maintenance.performedBy }}</div>
    </div>

    <div class="created-section">
      <div class="created-label">
        <v-icon icon="mdi-clock-outline" size="18" class="mr-2" />
        Created On
      </div>
      <div class="created-date">{{ formatDate(maintenance.createdAt) }}</div>
    </div>

    <v-alert
      v-if="maintenance.status === 'completed'"
      type="success"
      variant="tonal"
      class="mt-4"
      density="compact"
    >
      <template #text>
        <div class="flex items-center">
          <v-icon icon="mdi-check-circle" size="18" class="mr-2" />
          <span class="text-caption">Maintenance completed successfully</span>
        </div>
      </template>
    </v-alert>

    <v-alert
      v-else-if="maintenance.status === 'in-progress'"
      type="warning"
      variant="tonal"
      class="mt-4"
      density="compact"
    >
      <template #text>
        <div class="flex items-center">
          <v-icon icon="mdi-wrench" size="18" class="mr-2" />
          <span class="text-caption">Maintenance in progress</span>
        </div>
      </template>
    </v-alert>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency'

defineProps<{
  maintenance: any
  formatDate: (date: string) => string
}>()

const { formatCurrency } = useCurrency()
</script>

<style scoped>
.cost-display {
  @apply flex flex-col gap-2;
}

.cost-label {
  @apply text-sm font-medium flex items-center;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.cost-amount {
  @apply text-3xl font-bold;
  color: rgb(var(--v-theme-primary));
}

.provider-section,
.created-section {
  @apply flex flex-col gap-2 mt-4;
}

.provider-label,
.created-label {
  @apply text-xs font-medium uppercase tracking-wide flex items-center;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.provider-name,
.created-date {
  @apply text-base font-semibold;
}
</style>
