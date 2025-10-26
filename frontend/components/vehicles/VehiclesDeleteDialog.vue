<template>
  <CommonDialogDeleteConfirmation
    v-model="modelValue"
    title="Delete Vehicle?"
    :item-name="vehicle ? `${vehicle.make} ${vehicle.model}` : ''"
    :item-details="vehicle ? `${vehicle.licensePlate} · ${vehicle.year}` : ''"
    icon="mdi-car-outline"
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
  vehicle: any
  deleting: boolean
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
