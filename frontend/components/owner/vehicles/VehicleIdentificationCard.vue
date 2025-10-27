<template>
  <CommonUiDetailCard title="Identification" icon="mdi-card-text">
    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="License Plate" icon="mdi-card-account-details">
          <v-chip size="small" class="license-chip">
            {{ vehicle.licensePlate }}
          </v-chip>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="VIN" icon="mdi-barcode" :value="vehicle.vin || 'N/A'" />
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
interface Props {
  vehicle: {
    licensePlate: string
    vin?: string
  }
}

defineProps<Props>()
</script>

<style scoped>
.license-chip {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  background: rgba(var(--v-theme-primary), 0.05);
  color: rgb(var(--v-theme-primary));
}
</style>
