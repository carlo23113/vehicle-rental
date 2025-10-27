<template>
  <CommonDialogDeleteConfirmation
    v-model="modelValue"
    title="Delete Location?"
    :item-name="location ? location.name : ''"
    :item-details="location ? `${location.city}, ${location.state}` : ''"
    icon="mdi-map-marker-outline"
    message="This action is permanent and cannot be undone. All location data will be removed."
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

const modelValue = defineModel<boolean>()

defineProps<{
  location: Location | null
  loading: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleConfirm = () => emit('confirm')
const handleCancel = () => emit('cancel')
</script>
