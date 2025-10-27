<template>
  <transition name="slide-up-fade">
    <div
      v-if="selectedCount > 0"
      class="bulk-actions-bar"
    >
      <div class="bar-background" />
      <div class="bar-content">
        <!-- Selection Info -->
        <div class="selection-info">
          <div class="selection-icon-wrapper">
            <v-icon :icon="selectionIcon" size="24" class="selection-icon" />
          </div>
          <div class="selection-text">
            <div class="selection-count">
              <span class="count-number">{{ selectedCount }}</span>
              <span class="count-label">{{ itemLabel }}{{ selectedCount !== 1 ? 's' : '' }} selected</span>
            </div>
            <div v-if="showClearAll" class="selection-actions">
              <button class="clear-link" @click="$emit('clear-selection')">
                <v-icon icon="mdi-close-circle-outline" size="14" class="mr-1" />
                Clear selection
              </button>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="action-divider" />

        <!-- Action Buttons -->
        <div class="action-buttons">
          <slot name="actions" :selected-count="selectedCount" :selected-items="selectedItems">
            <!-- Default action buttons can be provided via slot -->
          </slot>

          <v-btn
            v-if="showClose"
            icon="mdi-close"
            variant="text"
            size="small"
            class="close-btn"
            @click="$emit('clear-selection')"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
export interface BulkActionsBarProps {
  selectedCount: number
  selectedItems?: any[]
  itemLabel?: string
  barColor?: string
  selectionIcon?: string
  showClearAll?: boolean
  showClose?: boolean
}

withDefaults(defineProps<BulkActionsBarProps>(), {
  selectedItems: () => [],
  itemLabel: 'items',
  barColor: 'primary',
  selectionIcon: 'mdi-checkbox-multiple-marked',
  showClearAll: true,
  showClose: true,
})

defineEmits<{
  'clear-selection': []
}>()
</script>

<style scoped lang="scss">
.bulk-actions-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  min-width: 600px;
  max-width: 900px;

  @media (max-width: 768px) {
    min-width: auto;
    left: 16px;
    right: 16px;
    transform: none;
    width: calc(100% - 32px);
  }
}

.bar-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary)) 100%
  );
  border-radius: 16px;
  opacity: 0.95;
  backdrop-filter: blur(20px);
  box-shadow:
    0 12px 40px rgba(var(--v-theme-primary), 0.35),
    0 4px 16px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.05)
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
  }
}

.bar-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  gap: 24px;
  color: white;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.selection-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: pulse 2s ease-in-out infinite;
}

.selection-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.selection-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.selection-count {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 0.875rem;
  color: white;
}

.count-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s ease;
}

.count-label {
  font-weight: 500;
  opacity: 0.95;
}

.selection-actions {
  display: flex;
  align-items: center;
}

.clear-link {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 4px 8px;
  margin: -4px -8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    transform: translateX(-2px);
  }

  &:active {
    transform: translateX(-1px);
    background: rgba(255, 255, 255, 0.2);
  }
}

.action-divider {
  width: 1px;
  height: 48px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.3) 80%,
    transparent
  );
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;

  :deep(.v-btn) {
    color: white;
    font-weight: 600;
    letter-spacing: 0.3px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(-1px);
    }
  }
}

.close-btn {
  opacity: 0.8;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.15) !important;
  }
}

// Animations
.slide-up-fade-enter-active,
.slide-up-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-fade-enter-from {
  transform: translate(-50%, 20px);
  opacity: 0;

  @media (max-width: 768px) {
    transform: translateY(20px);
  }
}

.slide-up-fade-leave-to {
  transform: translate(-50%, 20px);
  opacity: 0;

  @media (max-width: 768px) {
    transform: translateY(20px);
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 0 20px rgba(255, 255, 255, 0.2);
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
