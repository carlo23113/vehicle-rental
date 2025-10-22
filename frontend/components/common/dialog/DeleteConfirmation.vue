<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="440"
    persistent
  >
    <v-card class="delete-dialog">
      <v-card-text class="!p-0">
        <!-- Icon Section -->
        <div class="icon-section">
          <div class="icon-bounce">
            <div class="icon-ring" />
            <v-icon icon="mdi-alert-circle-outline" size="48" color="error" />
          </div>
        </div>

        <!-- Content -->
        <div class="content-slide !px-8 !pb-6">
          <h2 class="text-h6 !font-semibold text-center !mb-2">{{ title }}</h2>

          <!-- Item Info -->
          <div v-if="hasItemInfo" class="item-info">
            <div v-if="icon" class="item-icon icon-scale">
              <v-icon :icon="icon" size="20" />
            </div>
            <div class="item-text">
              <div v-if="itemName" class="item-name">{{ itemName }}</div>
              <div v-if="itemDetails" class="item-meta">{{ itemDetails }}</div>
            </div>
          </div>

          <!-- Custom Content Slot -->
          <slot name="content" />

          <!-- Warning Message -->
          <div class="warning">
            <v-icon icon="mdi-information-outline" size="16" class="!text-error/70" />
            <span>{{ message }}</span>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="!p-4 !gap-3">
        <v-btn
          variant="text"
          size="large"
          :disabled="loading"
          class="cancel-btn"
          @click="handleCancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          size="large"
          :loading="loading"
          class="delete-btn"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  itemName?: string
  itemDetails?: string
  icon?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Delete Item?',
  message: 'This action is permanent and cannot be undone',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  loading: false,
  icon: 'mdi-help-circle-outline'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const hasItemInfo = computed(() => props.itemName || props.itemDetails)

const handleConfirm = () => emit('confirm')

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.delete-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

/* Icon Section */
.icon-section {
  padding: 40px 32px 32px;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, rgba(var(--v-theme-error), 0.03), transparent);
}

.icon-bounce {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.icon-ring {
  position: absolute;
  width: 72px;
  height: 72px;
  border: 2px solid rgb(var(--v-theme-error));
  border-radius: 50%;
  opacity: 0.15;
  animation: pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Content */
.content-slide {
  animation: fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
}

/* Item Info */
.item-info {
  margin: 20px auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(var(--v-theme-surface), 1);
  border: 1.5px solid rgba(var(--v-border-color), 0.2);
  border-radius: 14px;
  max-width: 340px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.item-info::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(var(--v-theme-primary), 0.4), transparent);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.item-info:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  background: rgba(var(--v-theme-primary), 0.02);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.item-info:hover::before {
  opacity: 1;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.12), rgba(var(--v-theme-primary), 0.06));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgb(var(--v-theme-primary));
  transition: all 0.25s ease;
}

.item-info:hover .icon-scale {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.18), rgba(var(--v-theme-primary), 0.1));
  transform: scale(1.05);
}

.item-text {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 2px;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.item-meta {
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.3;
}

/* Warning */
.warning {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  background: rgba(var(--v-theme-error), 0.05);
  border-left: 3px solid rgba(var(--v-theme-error), 0.3);
  border-radius: 6px;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.warning :deep(.v-icon) {
  color: rgba(var(--v-theme-error), 0.7);
}

/* Buttons */
.cancel-btn,
.delete-btn {
  flex: 1;
  text-transform: none !important;
  font-weight: 600 !important;
  letter-spacing: 0.25px !important;
  border-radius: 10px !important;
  height: 44px !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.cancel-btn:hover {
  background: rgba(var(--v-theme-on-surface), 0.04) !important;
}

.delete-btn {
  box-shadow: 0 2px 8px rgba(var(--v-theme-error), 0.25) !important;
}

.delete-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(var(--v-theme-error), 0.35) !important;
  transform: translateY(-1px);
}

.delete-btn:active {
  transform: translateY(0);
}

/* Animations */
@keyframes pulseRing {
  0%, 100% {
    transform: scale(1);
    opacity: 0.15;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.08;
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
