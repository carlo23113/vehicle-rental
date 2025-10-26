<template>
  <CommonDialogConfirmationDialog
    v-model="modelValue"
    title="Mark Maintenance as Complete?"
    :item-name="`${record?.vehicleName} - ${record ? getTypeLabel(record.type) : ''}`"
    :item-details="record ? `Scheduled: ${formatDate(record.scheduledDate)}` : ''"
    icon="mdi-wrench"
    icon-name="mdi-check-circle-outline"
    message="This will update the status to completed"
    confirm-text="Mark Complete"
    color="success"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>()

defineProps<{
  record: any | null
  loading: boolean
  formatDate: (date: string) => string
  getTypeLabel: (type: string) => string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleConfirm = () => emit('confirm')
const handleCancel = () => emit('cancel')
</script>
