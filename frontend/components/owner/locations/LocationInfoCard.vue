<template>
  <CommonUiDetailCard title="Location Information" icon="mdi-information-outline">
    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Location Name" icon="mdi-map-marker" :value="location.name" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Type" icon="mdi-office-building">
          <v-chip :color="location.type === 'main' ? 'primary' : 'info'" size="small" variant="tonal">
            <v-icon
              :icon="location.type === 'main' ? 'mdi-office-building' : 'mdi-map-marker'"
              start
              size="14"
            />
            {{ typeLabel }}
          </v-chip>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Status" icon="mdi-flag-outline">
          <v-chip :color="statusColor" size="small" variant="flat">
            {{ location.status }}
          </v-chip>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Capacity" icon="mdi-garage" :value="`${location.capacity} vehicles`" />
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

const props = defineProps<{
  location: Location
  typeLabel: string
  statusColor: string
}>()
</script>
