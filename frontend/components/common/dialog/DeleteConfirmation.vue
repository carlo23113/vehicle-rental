<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="440"
    persistent
  >
    <v-card class="rounded-2xl overflow-hidden">
      <v-card-text class="!p-0">
        <!-- Icon Section -->
        <div class="icon-section pt-10 px-8 pb-8 flex justify-center">
          <div class="relative inline-flex items-center justify-center animate-[fadeInScale_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div class="icon-ring absolute w-[72px] h-[72px] border-2 rounded-full animate-[pulseRing_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            <v-icon icon="mdi-alert-circle-outline" size="48" color="error" />
          </div>
        </div>

        <!-- Content -->
        <div class="!px-8 !pb-6 animate-[fadeInUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)_0.1s_both]">
          <h2 class="text-h6 !font-semibold text-center !mb-2">{{ title }}</h2>

          <!-- Item Info -->
          <div v-if="hasItemInfo" class="item-info group my-5 mx-auto py-4 px-5 flex items-center gap-[14px] border-[1.5px] rounded-[14px] max-w-[340px] relative overflow-hidden transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <div v-if="icon" class="item-icon w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all duration-[250ms] group-hover:scale-105">
              <v-icon :icon="icon" size="20" />
            </div>
            <div class="flex-1 min-w-0">
              <div v-if="itemName" class="item-name text-[0.9375rem] font-semibold mb-0.5 tracking-[-0.01em] leading-[1.4]">{{ itemName }}</div>
              <div v-if="itemDetails" class="item-meta text-[0.8125rem] font-medium tracking-[0.01em] leading-[1.3]">{{ itemDetails }}</div>
            </div>
          </div>

          <!-- Custom Content Slot -->
          <slot name="content" />

          <!-- Warning Message -->
          <div class="warning mt-5 flex items-center justify-center gap-1.5 py-3 px-4 border-l-[3px] rounded-md text-sm">
            <v-icon icon="mdi-information-outline" size="16" />
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
          class="flex-1 !normal-case !font-semibold !tracking-[0.25px] !rounded-[10px] !h-11 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:!bg-on-surface/[0.04]"
          @click="handleCancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          size="large"
          :loading="loading"
          class="flex-1 !normal-case !font-semibold !tracking-[0.25px] !rounded-[10px] !h-11 !shadow-[0_2px_8px_rgba(var(--v-theme-error),0.25)] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:!shadow-[0_4px_12px_rgba(var(--v-theme-error),0.35)] hover:-translate-y-px active:translate-y-0"
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
/* Icon Section */
.icon-section {
  background: linear-gradient(180deg, rgba(var(--v-theme-error), 0.03), transparent);
}

.icon-ring {
  border-color: rgb(var(--v-theme-error));
  opacity: 0.15;
}

/* Item Info */
.item-info {
  background: rgba(var(--v-theme-surface), 1);
  border-color: rgba(var(--v-border-color), 0.2);
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
}

.item-info:hover::before {
  opacity: 1;
}

.item-icon {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.12), rgba(var(--v-theme-primary), 0.06));
  color: rgb(var(--v-theme-primary));
}

.item-info:hover .item-icon {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.18), rgba(var(--v-theme-primary), 0.1));
}

.item-name {
  color: rgb(var(--v-theme-on-surface));
}

.item-meta {
  color: rgba(var(--v-theme-on-surface), 0.55);
}

/* Warning */
.warning {
  background: rgba(var(--v-theme-error), 0.05);
  border-color: rgba(var(--v-theme-error), 0.3);
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.warning :deep(.v-icon) {
  color: rgba(var(--v-theme-error), 0.7);
}

/* Custom Animations */
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
