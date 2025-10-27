<template>
  <div class="bg-transparent border-none border-b border-gray-200/8 py-2 last:border-b-0">
    <v-checkbox
      :model-value="modelValue"
      @update:model-value="handleUpdate"
      :value="permission.id"
      hide-details
      density="compact"
    >
      <template #label>
        <div class="flex flex-col gap-0.5 ml-1">
          <span class="font-medium text-[0.8125rem] leading-[1.3]">{{ permission.name }}</span>
          <span class="text-[0.6875rem] text-on-surface/50 leading-[1.3]">{{
            permission.description
          }}</span>
        </div>
      </template>
    </v-checkbox>
  </div>
</template>

<script setup lang="ts">
import type { Permission } from '~/types/role'

defineProps<{
  permission: Permission
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const handleUpdate = (value: string[] | null) => {
  if (value) emit('update:modelValue', value)
}
</script>
