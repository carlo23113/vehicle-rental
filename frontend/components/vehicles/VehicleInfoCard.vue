<template>
  <CommonUiDetailCard title="Vehicle Information" icon="mdi-information">
    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Make" icon="mdi-factory" :value="vehicle.make" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Model" icon="mdi-car" :value="vehicle.model" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Year" icon="mdi-calendar" :value="vehicle.year" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Color" icon="mdi-palette" :value="vehicle.color" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Type" icon="mdi-car-info">
          <div class="flex items-center gap-2">
            <v-icon :icon="getTypeIcon(vehicle.type)" size="16" />
            <span>{{ getTypeLabel(vehicle.type) }}</span>
          </div>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Status" icon="mdi-check-circle">
          <v-chip :color="getStatusColor(vehicle.status)" size="small" variant="flat">
            <v-icon :icon="getStatusIcon(vehicle.status)" start size="14" />
            {{ vehicle.status.replace('-', ' ') }}
          </v-chip>
        </CommonUiDetailItem>
      </v-col>
      <v-col v-if="locationName" cols="12" md="6">
        <CommonUiDetailItem label="Location" icon="mdi-map-marker" :value="locationName" />
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVehicles } from '~/composables/useVehicles'
import { useLocations } from '~/composables/useLocations'

interface Props {
  vehicle: {
    make: string
    model: string
    year: number
    color: string
    type: string
    status: string
    locationId?: string
  }
}

const props = defineProps<Props>()

const { getStatusColor, getTypeLabel, getTypeIcon, getStatusIcon } = useVehicles()
const { getLocationById } = useLocations()

const locationName = computed(() => {
  if (!props.vehicle.locationId) return null
  const location = getLocationById(props.vehicle.locationId)
  return location ? location.name : null
})
</script>
