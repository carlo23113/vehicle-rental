<template>
  <CommonDialogDeleteConfirmation
    v-model="modelValue"
    title="Delete Rental?"
    :item-name="rental ? rental.customerName : ''"
    :item-details="
      rental ? `${rental.vehicleName} • ${formatDate(rental.startDate)} - ${formatDate(rental.endDate)}` : ''
    "
    icon="mdi-calendar-remove"
    message="This action is permanent and cannot be undone"
    :loading="deleting"
    @confirm="$emit('confirm')"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  rental: any
  deleting: boolean
  formatDate: (date: string) => string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
