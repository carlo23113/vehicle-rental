<template>
  <div
    class="action-item group"
    :class="{ disabled: disabled }"
    @click="handleClick"
  >
    <div class="action-icon" :class="iconColorClass">
      <v-icon :icon="icon" size="20" />
    </div>
    <div class="action-content">
      <div class="action-title">{{ title }}</div>
      <div class="action-subtitle">{{ subtitle }}</div>
    </div>
    <v-icon icon="mdi-chevron-right" size="20" class="action-arrow" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  subtitle: string
  color?: 'success' | 'primary' | 'error' | 'warning' | 'info'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

const iconColorClass = computed(() => {
  return `${props.color}-icon`
})

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.action-item {
  @apply flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] border;
  background: rgba(var(--v-theme-surface), 0.6);
  border-color: rgba(var(--v-border-color), 0.08);

  &:hover:not(.disabled) {
    background: rgba(var(--v-theme-surface), 1);
    border-color: rgba(var(--v-border-color), 0.15);
    @apply translate-x-1;

    .action-icon {
      @apply scale-105;
    }

    .action-arrow {
      color: rgba(var(--v-theme-on-surface), 0.6);
      @apply translate-x-0.5;
    }
  }

  &.disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}

.action-icon {
  @apply w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all duration-200;

  &.success-icon {
    background: rgba(var(--v-theme-success), 0.1);
    color: rgb(var(--v-theme-success));
  }

  &.primary-icon {
    background: rgba(var(--v-theme-primary), 0.1);
    color: rgb(var(--v-theme-primary));
  }

  &.error-icon {
    background: rgba(var(--v-theme-error), 0.1);
    color: rgb(var(--v-theme-error));
  }

  &.warning-icon {
    background: rgba(var(--v-theme-warning), 0.1);
    color: rgb(var(--v-theme-warning));
  }

  &.info-icon {
    background: rgba(var(--v-theme-info), 0.1);
    color: rgb(var(--v-theme-info));
  }
}

.action-content {
  @apply flex-1 min-w-0;
}

.action-title {
  @apply text-sm font-semibold mb-0.5 leading-[1.3];
  color: rgb(var(--v-theme-on-surface));
}

.action-subtitle {
  @apply text-xs leading-[1.2];
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.action-arrow {
  @apply transition-all duration-200;
  color: rgba(var(--v-theme-on-surface), 0.3);
}
</style>
