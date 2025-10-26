<template>
  <CommonUiDetailCard title="Vehicle Information" icon="mdi-car">
    <template v-if="vehicleId" #actions>
      <v-btn
        variant="outlined"
        color="primary"
        size="small"
        prepend-icon="mdi-car-info"
        @click="viewVehicle"
      >
        View Vehicle
      </v-btn>
    </template>

    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4" style="gap: 12px">
          <div>
            <h4 class="text-subtitle-1 font-weight-bold">{{ vehicle.make }} {{ vehicle.model }}</h4>
            <div class="text-caption text-medium-emphasis">
              {{ vehicle.year }} • {{ vehicle.licensePlate }}
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Type" icon="mdi-car-info" :value="vehicle.type" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Color" icon="mdi-palette" :value="vehicle.color" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem
          label="License Plate"
          icon="mdi-card-account-details"
          :value="vehicle.licensePlate"
        />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Mileage" icon="mdi-speedometer">
          <span>{{ vehicle.mileage?.toLocaleString() || 'N/A' }} mi</span>
        </CommonUiDetailItem>
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  vehicle: {
    make: string
    model: string
    year: number
    licensePlate: string
    type: string
    color: string
    mileage?: number
  }
  vehicleId?: number | string
}

const props = defineProps<Props>()
const router = useRouter()

const viewVehicle = () => {
  if (props.vehicleId) {
    router.push(`/owner/vehicles/${props.vehicleId}`)
  }
}
</script>
