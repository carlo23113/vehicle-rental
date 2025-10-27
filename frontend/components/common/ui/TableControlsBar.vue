<template>
  <div class="table-controls-bar mb-4">
    <div class="d-flex align-center gap-3">
      <!-- Enhanced Bulk Selection Toggle -->
      <div
        class="bulk-selection-toggle"
        :class="{ 'is-active': modelValue }"
        @click="$emit('update:modelValue', !modelValue)"
      >
        <div class="toggle-icon">
          <v-icon
            :icon="modelValue ? 'mdi-checkbox-multiple-marked' : 'mdi-checkbox-multiple-outline'"
            :size="20"
          />
        </div>
        <div class="toggle-content">
          <div class="toggle-label">{{ toggleLabel }}</div>
          <div class="toggle-status">
            <v-chip
              :color="modelValue ? 'success' : 'default'"
              size="x-small"
              variant="flat"
              class="status-chip"
            >
              {{ modelValue ? 'ON' : 'OFF' }}
            </v-chip>
          </div>
        </div>
      </div>

      <!-- Selection Count -->
      <transition name="slide-fade">
        <v-chip
          v-if="modelValue && selectedCount > 0"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-check-circle"
          class="selection-count-chip"
        >
          {{ selectedCount }} {{ itemLabel }}{{ selectedCount !== 1 ? 's' : '' }} selected
        </v-chip>
      </transition>

      <!-- Additional Left Actions Slot -->
      <slot name="left-actions" />
    </div>

    <div class="d-flex align-center gap-2">
      <!-- Clear Selection Button -->
      <transition name="slide-fade">
        <v-btn
          v-if="modelValue && selectedCount > 0"
          variant="text"
          size="small"
          prepend-icon="mdi-close-circle"
          color="error"
          @click="$emit('clear-selection')"
        >
          Clear Selection
        </v-btn>
      </transition>

      <!-- Right Actions Slot (e.g., Column Visibility Menu) -->
      <slot name="right-actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TableControlsBarProps {
  modelValue: boolean // Bulk selection mode
  selectedCount: number
  toggleLabel?: string
  itemLabel?: string
}

withDefaults(defineProps<TableControlsBarProps>(), {
  toggleLabel: 'Bulk Selection',
  itemLabel: 'item',
})

defineEmits<{
  'update:modelValue': [value: boolean]
  'clear-selection': []
}>()
</script>

<style scoped lang="scss">
.table-controls-bar {
  @apply flex items-center justify-between;
  padding: 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(var(--v-theme-primary), 0.2);
    box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.08);
  }
}

.bulk-selection-toggle {
  @apply flex items-center gap-3;
  padding: 12px 16px;
  background: rgb(var(--v-theme-surface));
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  min-width: 200px;

  &:hover {
    border-color: rgba(var(--v-theme-primary), 0.4);
    background: rgba(var(--v-theme-primary), 0.04);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(var(--v-theme-primary), 0.1);
  }

  &.is-active {
    border-color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.08);
    box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.12);

    .toggle-icon {
      background: rgb(var(--v-theme-primary));
      color: white;
    }

    .toggle-label {
      color: rgb(var(--v-theme-primary));
      font-weight: 600;
    }
  }
}

.toggle-icon {
  @apply flex items-center justify-center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgba(var(--v-theme-on-surface), 0.6);
  transition: all 0.3s ease;
}

.toggle-content {
  @apply flex flex-col gap-1;
  flex: 1;
}

.toggle-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.87);
  transition: all 0.3s ease;
}

.toggle-status {
  @apply flex items-center;
}

.status-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.selection-count-chip {
  font-weight: 600;
  animation: slideIn 0.3s ease;
}

// Transitions
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(-10px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}
</style>
