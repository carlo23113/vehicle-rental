<template>
  <CommonUiDetailCard title="Location Details" icon="mdi-information-outline">
    <v-row>
      <v-col cols="12">
        <div class="stat-item">
          <v-icon icon="mdi-calendar-clock" color="info" size="20" />
          <div class="ml-3">
            <div class="text-caption text-medium-emphasis">Created</div>
            <div class="text-body-2 font-weight-medium">{{ formatDate(location.createdAt) }}</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

defineProps<{
  location: Location
  formatDate: (date: string) => string
}>()
</script>

<style lang="scss" scoped>
.stat-item {
  @apply flex items-center p-3 rounded-lg border;
}
</style>
