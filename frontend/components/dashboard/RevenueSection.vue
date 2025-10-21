<template>
  <v-card elevation="0" class="modern-card">
    <v-card-title class="pa-6 d-flex justify-space-between align-center">
      <div>
        <h3 class="text-h5 font-weight-bold">Revenue Overview</h3>
        <p class="text-caption text-medium-emphasis mt-1"
          >Monthly revenue statistics</p
        >
      </div>
      <v-btn-toggle
        :model-value="filter"
        @update:model-value="$emit('update:filter', $event)"
        mandatory
        density="comfortable"
        variant="outlined"
        divided
        rounded="lg"
      >
        <v-btn value="week">Week</v-btn>
        <v-btn value="month">Month</v-btn>
        <v-btn value="year">Year</v-btn>
      </v-btn-toggle>
    </v-card-title>
    <v-card-text class="pa-6">
      <LazyDashboardRevenueChart :filter="filter" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  filter: "week" | "month" | "year";
}>();

defineEmits<{
  "update:filter": [value: "week" | "month" | "year"];
}>();
</script>

<style scoped>
.modern-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}
</style>
