<template>
  <div class="bg-surface rounded-2xl border border-border/[0.08] p-8 transition-all duration-200 hover:border-border/[0.12] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
    <div class="flex items-start gap-4 mb-6">
      <div class="flex items-center justify-center w-10 h-10 rounded-[10px] bg-primary/[0.08] text-primary flex-shrink-0">
        <v-icon size="20">{{ icon }}</v-icon>
      </div>
      <div class="flex-grow">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold m-0 mb-1 text-on-surface">{{ title }}</h2>
            <p class="text-sm m-0 text-on-surface/60">{{ subtitle }}</p>
          </div>
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <CommonTiptapEditor
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  title: string
  subtitle: string
  icon: string
  placeholder: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
