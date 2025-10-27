<template>
  <CommonDialogDeleteConfirmation
    v-model="localValue"
    :title="`Delete ${tenant?.name || 'Tenant'}`"
    :item-name="tenant?.name || ''"
    :loading="deleting"
    @confirm="$emit('confirm')"
    @cancel="$emit('cancel')"
  >
    <template #additional-warning>
      <v-alert type="error" variant="tonal" class="mb-4">
        <strong>Warning:</strong> This will permanently delete all tenant data including users, vehicles, and rentals.
      </v-alert>
    </template>
  </CommonDialogDeleteConfirmation>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Tenant } from '~/types/tenant'

interface Props {
  modelValue: boolean
  tenant: Tenant | null
  deleting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue
  }
)

watch(localValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>
