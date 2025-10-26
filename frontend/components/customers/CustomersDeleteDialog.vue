<template>
  <CommonDialogDeleteConfirmation
    v-model="modelValue"
    title="Delete Customer?"
    :item-name="customer ? getFullName(customer) : ''"
    :item-details="customer ? `${customer.email} · ${customer.phone}` : ''"
    icon="mdi-account-outline"
    message="This action is permanent and cannot be undone. All customer data and history will be removed."
    :loading="deleting"
    @confirm="$emit('confirm')"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  customer: any
  deleting: boolean
  getFullName: (customer: any) => string
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
