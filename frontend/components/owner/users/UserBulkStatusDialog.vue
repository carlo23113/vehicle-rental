<template>
  <CommonUiBulkActionDialog
    v-model="dialogModel"
    :selected-items="selectedUsers"
    :loading="loading"
    title="Update User Status"
    icon="mdi-account-multiple"
    item-label="user"
    confirm-text="Update Status"
    :confirm-disabled="!selectedStatus"
    :item-label-key="getUserLabel"
    @confirm="handleConfirm"
    @cancel="$emit('cancel')"
  >
    <template #form>
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
        class="mt-4"
      />
    </template>
  </CommonUiBulkActionDialog>
</template>

<script setup lang="ts">
import { USER_STATUS_OPTIONS } from '~/constants/filterOptions'

interface UserBulkStatusDialogProps {
  modelValue: boolean
  selectedUsers: any[]
  loading?: boolean
}

const props = withDefaults(defineProps<UserBulkStatusDialogProps>(), {
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
  USER_STATUS_OPTIONS.filter((option) => option.value !== 'all'),
)

const getUserLabel = (user: any): string => {
  return `${user.firstName} ${user.lastName} (${user.email})`
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    active: 'mdi-check-circle',
    inactive: 'mdi-minus-circle',
    suspended: 'mdi-alert-circle',
  }
  return icons[status] || 'mdi-help-circle'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    suspended: 'error',
  }
  return colors[status] || 'default'
}

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

// Reset form when dialog closes
watch(dialogModel, (newValue) => {
  if (!newValue) {
    selectedStatus.value = ''
    notes.value = ''
    errorMessage.value = ''
  }
})
</script>
