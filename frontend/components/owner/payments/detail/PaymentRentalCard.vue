<template>
  <CommonUiDetailCard title="Related Rental" icon="mdi-calendar-check">
    <div class="rental-link" @click="$emit('view-rental', rentalId)">
      <div class="rental-header">
        <div class="rental-badge">
          <v-icon icon="mdi-calendar" size="20" />
          <span class="font-weight-bold">Rental #{{ rentalId }}</span>
        </div>
        <v-icon icon="mdi-chevron-right" size="20" class="text-medium-emphasis" />
      </div>

      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <CommonUiDetailItem label="Customer" icon="mdi-account" :value="customerName" />
        </v-col>
        <v-col cols="12" md="6">
          <CommonUiDetailItem label="Vehicle" icon="mdi-car" :value="vehicleName" />
        </v-col>
        <v-col v-if="licensePlate" cols="12" md="6">
          <CommonUiDetailItem label="License Plate" icon="mdi-card-text">
            <v-chip size="small" variant="outlined" class="license-chip">
              {{ licensePlate }}
            </v-chip>
          </CommonUiDetailItem>
        </v-col>
      </v-row>

      <div class="view-details-hint">
        <v-icon icon="mdi-eye" size="16" class="mr-1" />
        <span>Click to view full rental details</span>
      </div>
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
defineProps<{
  rentalId: number
  customerName: string
  vehicleName: string
  licensePlate?: string
}>()

defineEmits<{
  'view-rental': [id: number]
}>()
</script>

<style scoped>
.rental-link {
  @apply cursor-pointer p-4 -m-4 rounded-lg transition-all;
}

.rental-link:hover {
  background: rgba(var(--v-theme-primary), 0.04);
}

.rental-header {
  @apply flex items-center justify-between pb-3;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.rental-badge {
  @apply flex items-center gap-2 px-3 py-1 rounded-lg;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.license-chip {
  font-family: 'Courier New', monospace;
  font-weight: 700;
}

.view-details-hint {
  @apply flex items-center justify-center text-xs mt-4 pt-4;
  opacity: 0.6;
  border-top: 1px solid rgba(var(--v-border-color), 0.12);
  transition: opacity 0.2s;
}

.rental-link:hover .view-details-hint {
  opacity: 1;
}
</style>
