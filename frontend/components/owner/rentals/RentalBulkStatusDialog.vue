<template>
  <v-dialog v-model="dialogModel" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center gap-2 bg-primary pa-4">
        <v-icon icon="mdi-calendar-multiple" size="24" />
        <span class="text-h6">Update Rental Status</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <div class="mb-4">
          <div class="text-subtitle-2 text-medium-emphasis mb-2">
            You are updating the status for {{ selectedCount }} rental{{
              selectedCount > 1 ? 's' : ''
            }}
          </div>
          <v-chip
            v-for="rental in previewRentals"
            :key="rental.id"
            size="small"
            class="mr-2 mb-2"
            variant="outlined"
          >
            {{ rental.vehicleName }} - {{ rental.customerName }}
          </v-chip>
          <v-chip v-if="remainingCount > 0" size="small" variant="outlined" class="mb-2">
            +{{ remainingCount }} more
          </v-chip>
        </div>

        <v-select
          v-model="selectedStatus"
          :items="statusOptions"
          label="New Status"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-status-line"
          :error-messages="errorMessage"
        >
          <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
              <template #prepend>
                <v-icon :icon="getStatusIcon(item.value)" :color="getStatusColor(item.value)" />
              </template>
            </v-list-item>
          </template>
          <template #selection="{ item }">
            <div class="d-flex align-center gap-2">
              <v-icon :icon="getStatusIcon(item.value)" :color="getStatusColor(item.value)" />
              <span>{{ item.title }}</span>
            </div>
          </template>
        </v-select>

        <v-textarea
          v-model="notes"
          label="Notes (Optional)"
          variant="outlined"
          density="comfortable"
          rows="3"
          prepend-inner-icon="mdi-note-text"
          placeholder="Add any notes about this status change..."
          counter="500"
          maxlength="500"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="handleCancel"> Cancel </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!selectedStatus"
          :loading="loading"
          @click="handleConfirm"
        >
          Update Status
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { RENTAL_STATUS_OPTIONS } from '~/constants/filterOptions'

interface RentalBulkStatusDialogProps {
  modelValue: boolean
  selectedRentals: any[]
  loading?: boolean
}

const props = withDefaults(defineProps<RentalBulkStatusDialogProps>(), {
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [payload: { status: string; notes: string }]
  cancel: []
}>()

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const selectedStatus = ref<string>('')
const notes = ref<string>('')
const errorMessage = ref<string>('')

// Filter out "All Statuses" option
const statusOptions = computed(() =>
  RENTAL_STATUS_OPTIONS.filter((option) => option.value !== 'all'),
)

const selectedCount = computed(() => props.selectedRentals.length)

const previewRentals = computed(() => props.selectedRentals.slice(0, 3))

const remainingCount = computed(() => Math.max(0, selectedCount.value - 3))

const { getStatusIcon, getStatusColor } = useRentals()

const handleConfirm = () => {
  if (!selectedStatus.value) {
    errorMessage.value = 'Please select a status'
    return
  }

  emit('confirm', {
    status: selectedStatus.value,
    notes: notes.value,
  })
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

// Reset form when dialog closes
watch(dialogModel, (newValue) => {
  if (!newValue) {
    selectedStatus.value = ''
    notes.value = ''
    errorMessage.value = ''
  }
})
</script>

<style scoped>
.v-card-title {
  color: white;
}
</style>
