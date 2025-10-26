<template>
  <div>
    <!-- Vehicle & Service Type -->
    <CommonFormSection title="Vehicle & Service Type" icon="mdi-car-wrench">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.vehicleId"
            label="Select Vehicle"
            placeholder="Choose a vehicle"
            variant="outlined"
            density="comfortable"
            :items="availableVehicles"
            item-title="label"
            item-value="value"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-car-outline"
            @update:model-value="handleVehicleChange"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #prepend>
                  <CommonUiIconAvatar icon="mdi-car" :size="40" :icon-size="20" />
                </template>
                <template #subtitle>
                  <span class="text-xs">{{ item.raw.subtitle }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.type"
            label="Maintenance Type"
            placeholder="Select maintenance type"
            variant="outlined"
            density="comfortable"
            :items="typeOptions"
            item-title="label"
            item-value="value"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-tools"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #subtitle>
                  <span class="text-caption">{{ item.raw.description }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="localForm.description"
            label="Description"
            placeholder="Describe the maintenance or repair needed..."
            variant="outlined"
            density="comfortable"
            rows="3"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-text"
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Schedule & Status -->
    <CommonFormSection title="Schedule & Status" icon="mdi-calendar-clock">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="localForm.scheduledDate"
            label="Scheduled Date"
            type="date"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-calendar-start"
            :min="todayDate"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="localForm.status"
            label="Status"
            placeholder="Select status"
            variant="outlined"
            density="comfortable"
            :items="statusOptions"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-flag-outline"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="localForm.priority"
            label="Priority"
            placeholder="Select priority"
            variant="outlined"
            density="comfortable"
            :items="priorityOptions"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-alert-circle"
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Details & Cost -->
    <CommonFormSection title="Details & Cost" icon="mdi-information-outline">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="localForm.mileage"
            label="Current Mileage"
            placeholder="0"
            variant="outlined"
            density="comfortable"
            type="number"
            suffix="miles"
            min="0"
            prepend-inner-icon="mdi-speedometer"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="localForm.cost"
            label="Estimated Cost"
            placeholder="0.00"
            variant="outlined"
            density="comfortable"
            type="number"
            :prefix="getCurrencySymbol()"
            step="0.01"
            min="0"
            prepend-inner-icon="mdi-currency-usd"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="localForm.performedBy"
            label="Service Provider"
            placeholder="e.g., AutoCare Service Center"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-account-wrench"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="localForm.notes"
            label="Notes"
            placeholder="Additional notes or special instructions..."
            variant="outlined"
            density="comfortable"
            rows="2"
            prepend-inner-icon="mdi-note-text-outline"
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Completion Information (only if status is completed) -->
    <CommonFormSection v-if="localForm.status === 'completed'" title="Completion Information" icon="mdi-check-circle">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.completedDate"
            label="Completion Date"
            type="date"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-calendar-check"
            :max="todayDate"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="localForm.cost"
            label="Actual Cost"
            placeholder="0.00"
            variant="outlined"
            density="comfortable"
            type="number"
            :prefix="getCurrencySymbol()"
            step="0.01"
            min="0"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-currency-usd"
          />
        </v-col>
      </v-row>

      <!-- Cost Summary Alert -->
      <v-alert
        v-if="localForm.cost > 0"
        type="success"
        variant="tonal"
        class="mt-4"
        border="start"
      >
        <template #text>
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 font-weight-bold mb-1">Maintenance Completed</div>
              <div class="text-caption">
                Total cost: {{ formatCurrency(localForm.cost) }}
              </div>
            </div>
          </div>
        </template>
      </v-alert>
    </CommonFormSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '~/composables/useCurrency'
import { useVehicles } from '~/composables/useVehicles'
import { useFormValidation } from '~/composables/useFormValidation'

export interface MaintenanceFormData {
  vehicleId: number | null
  vehicleName: string
  type: string
  description: string
  scheduledDate: string
  completedDate: string
  status: string
  priority: string
  mileage: number | null
  cost: number
  performedBy: string
  notes: string
}

const props = defineProps<{
  modelValue: MaintenanceFormData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: MaintenanceFormData]
}>()

const { formatCurrency, getCurrencySymbol } = useCurrency()
const { vehicles } = useVehicles()
const { rules } = useFormValidation()

const localForm = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const todayDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Available vehicles for maintenance
const availableVehicles = computed(() =>
  vehicles.value.map(v => ({
    value: v.id,
    label: `${v.make} ${v.model} (${v.year})`,
    subtitle: `${v.licensePlate} • ${v.status}`,
  }))
)

const typeOptions = [
  {
    value: 'oil-change',
    label: 'Oil Change',
    description: 'Regular oil and filter replacement',
  },
  {
    value: 'tire-rotation',
    label: 'Tire Rotation',
    description: 'Rotate and balance tires',
  },
  {
    value: 'brake-service',
    label: 'Brake Service',
    description: 'Brake pad and rotor maintenance',
  },
  {
    value: 'inspection',
    label: 'Inspection',
    description: 'General vehicle inspection',
  },
  {
    value: 'repair',
    label: 'Repair',
    description: 'General repairs and fixes',
  },
  {
    value: 'cleaning',
    label: 'Cleaning',
    description: 'Interior and exterior cleaning',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other maintenance services',
  },
]

const statusOptions = [
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in-progress' },
  { title: 'Completed', value: 'completed' },
]

const priorityOptions = [
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
  { title: 'Urgent', value: 'urgent' },
]

const handleVehicleChange = (vehicleId: number) => {
  const vehicle = vehicles.value.find(v => v.id === vehicleId)
  if (!vehicle) return

  localForm.value.vehicleName = `${vehicle.make} ${vehicle.model} (${vehicle.year})`
  localForm.value.mileage = vehicle.mileage
}
</script>

