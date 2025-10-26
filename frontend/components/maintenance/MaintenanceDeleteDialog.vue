<template>
  <CommonDialogDeleteConfirmation
    v-model="modelValue"
    title="Delete Maintenance Record?"
    :item-name="`${record?.vehicleName} - ${record ? getTypeLabel(record.type) : ''}`"
    :item-details="record ? `Scheduled: ${formatDate(record.scheduledDate)}` : ''"
    icon="mdi-delete"
    message="This action is permanent and cannot be undone"
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
