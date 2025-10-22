<template>
  <CommonUiDetailCard :title="title" :icon="icon" class="stat-display-card">
    <div class="text-center py-4">
      <div :class="valueClass">{{ displayValue }}</div>
      <div class="text-sm text-medium-emphasis mt-1">{{ suffix }}</div>
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  icon: string
  value: string | number
  suffix?: string
  size?: 'small' | 'medium' | 'large'
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large',
  color: 'default'
})

const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const valueClass = computed(() => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl'
  }

  const colorClasses = {
    default: '',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error'
  }

  return `font-bold ${sizeClasses[props.size]} ${colorClasses[props.color]}`
})
</script>

<style scoped>
.stat-display-card :deep(.v-card-text) {
  padding: 1.5rem !important;
}
</style>
