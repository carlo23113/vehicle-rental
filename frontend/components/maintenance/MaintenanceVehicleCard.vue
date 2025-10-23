<template>
  <CommonUiDetailCard title="Vehicle Information" icon="mdi-car">
    <div class="vehicle-header">
      <v-avatar color="surface-variant" size="64" class="vehicle-avatar">
        <v-icon icon="mdi-car-wrench" size="32" />
      </v-avatar>
      <div class="vehicle-details">
        <h3 class="vehicle-name">{{ maintenance.vehicleName }}</h3>
        <v-chip size="small" variant="outlined" class="license-chip">
          {{ maintenance.licensePlate }}
        </v-chip>
      </div>
    </div>

    <v-divider class="my-4" />

    <div class="description-section">
      <div class="section-label">
        <v-icon icon="mdi-text" size="18" class="mr-2" />
        Description
      </div>
      <p class="description-text">{{ maintenance.description }}</p>
    </div>

    <div v-if="maintenance.notes" class="notes-section">
      <div class="section-label">
        <v-icon icon="mdi-note-text" size="18" class="mr-2" />
        Notes
      </div>
      <p class="notes-text">{{ maintenance.notes }}</p>
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
defineProps<{
  maintenance: any
}>()
</script>

<style scoped>
.vehicle-header {
  @apply flex items-center gap-4;
}

.vehicle-avatar {
  @apply transition-all duration-300;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.vehicle-details {
  @apply flex flex-col gap-2;
}

.vehicle-name {
  @apply text-xl font-bold;
}

.license-chip {
  @apply font-mono font-bold;
  border: 1.5px solid rgba(var(--v-theme-on-surface), 0.2);
}

.description-section,
.notes-section {
  @apply flex flex-col gap-2 mt-4;
}

.section-label {
  @apply text-sm font-semibold flex items-center;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.description-text,
.notes-text {
  @apply text-sm leading-relaxed;
  color: rgb(var(--v-theme-on-surface));
}

.notes-text {
  @apply italic;
}
</style>
