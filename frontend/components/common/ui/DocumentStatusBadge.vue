<template>
  <v-tooltip :text="tooltipText" location="top">
    <template #activator="{ props: tooltipProps }">
      <v-chip
        v-bind="tooltipProps"
        :color="statusConfig.color"
        :variant="variant"
        :size="size"
        :prepend-icon="statusConfig.icon"
        :class="chipClass"
      >
        <span v-if="showLabel">{{ statusConfig.label }}</span>
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    isComplete: boolean
    showLabel?: boolean
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
    variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
    chipClass?: string
    completeLabel?: string
    incompleteLabel?: string
    completeTooltip?: string
    incompleteTooltip?: string
  }>(),
  {
    showLabel: true,
    size: 'x-small',
    variant: 'tonal',
    completeLabel: 'Complete',
    incompleteLabel: 'Incomplete',
    completeTooltip: 'All documents verified',
    incompleteTooltip: 'Missing required documents',
  }
)

const statusConfig = computed(() => {
  if (props.isComplete) {
    return {
      color: 'success',
      icon: 'mdi-check-circle',
      label: props.completeLabel,
    }
  }
  return {
    color: 'warning',
    icon: 'mdi-alert-circle',
    label: props.incompleteLabel,
  }
})

const tooltipText = computed(() => {
  return props.isComplete ? props.completeTooltip : props.incompleteTooltip
})
</script>
