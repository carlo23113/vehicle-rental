<template>
  <div class="bg-surface rounded-2xl border border-border/[0.08] p-8 transition-all duration-200 hover:border-border/[0.12] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
    <div class="flex items-start gap-4 mb-6">
      <div class="flex items-center justify-center w-10 h-10 rounded-[10px] bg-primary/[0.08] text-primary flex-shrink-0">
        <v-icon size="20">mdi-office-building</v-icon>
      </div>
      <div>
        <h2 class="text-lg font-semibold m-0 mb-1 text-on-surface">Company Information</h2>
        <p class="text-sm m-0 text-on-surface/60">Basic details that appear in the contract header</p>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        <v-text-field
          :model-value="modelValue.companyName"
          @update:model-value="update('companyName', $event)"
          label="Company Name"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          :rules="[rules.required]"
        />
        <v-text-field
          :model-value="modelValue.companyEmail"
          @update:model-value="update('companyEmail', $event)"
          label="Email"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          type="email"
          :rules="[rules.required, rules.email]"
        />
      </div>
      <v-textarea
        :model-value="modelValue.companyAddress"
        @update:model-value="update('companyAddress', $event)"
        label="Address"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        rows="2"
        :rules="[rules.required]"
      />
      <v-text-field
        :model-value="modelValue.companyPhone"
        @update:model-value="update('companyPhone', $event)"
        label="Phone Number"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        :rules="[rules.required]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormValidation } from '~/composables/useFormValidation'
import type { ContractTemplate } from '~/composables/useContractTemplate'

const { rules } = useFormValidation()

const props = defineProps<{
  modelValue: ContractTemplate
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ContractTemplate]
}>()

const update = (field: keyof ContractTemplate, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
