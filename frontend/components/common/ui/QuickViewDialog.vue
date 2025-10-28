<template>
  <v-dialog
    :model-value="modelValue"
    max-width="700"
    :scrim="true"
    transition="dialog-bottom-transition"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="quick-view-card" elevation="24" rounded="lg">
      <!-- Header -->
      <v-card-title class="quick-view-header">
        <div class="d-flex align-center gap-3">
          <div v-if="icon" class="icon-wrapper">
            <v-icon :icon="icon" size="28" />
          </div>
          <div class="title-wrapper">
            <span class="text-h5 font-weight-bold">{{ title }}</span>
            <slot name="subtitle" />
          </div>
        </div>
        <v-btn
          icon="mdi-close"
          variant="flat"
          size="small"
          class="close-button"
          @click="$emit('update:modelValue', false)"
        />
      </v-card-title>

      <v-divider />

      <!-- Content -->
      <v-card-text class="quick-view-content">
        <slot />
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="quick-view-actions">
        <v-spacer />
        <slot name="actions">
          <v-btn
            variant="outlined"
            size="large"
            @click="$emit('update:modelValue', false)"
          >
            Close
          </v-btn>
          <v-btn
            v-if="showViewDetails"
            variant="elevated"
            color="primary"
            size="large"
            prepend-icon="mdi-open-in-new"
            @click="$emit('view-details')"
          >
            View Full Details
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
  icon?: string
  showViewDetails?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'view-details': []
}>()
</script>

<style scoped lang="scss">
.quick-view-card {
  @apply overflow-hidden;
  border-radius: 16px !important;
}

.quick-view-header {
  @apply px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 80px;

  .icon-wrapper {
    @apply flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm;
    width: 56px;
    height: 56px;
    flex-shrink: 0;

    .v-icon {
      color: white;
    }
  }

  .title-wrapper {
    @apply flex flex-col gap-1;
    flex: 1;
    color: white;
  }

  .close-button {
    @apply bg-white/10 hover:bg-white/20;
    backdrop-filter: blur(8px);
    transition: all 0.2s ease;
    flex-shrink: 0;

    :deep(.v-icon) {
      color: white;
    }

    &:hover {
      transform: scale(1.05);
    }
  }
}

.quick-view-content {
  @apply px-6 py-6;
  max-height: calc(90vh - 200px);
  overflow-y: auto;

  // Custom scrollbar
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded-full;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full;

    &:hover {
      @apply bg-gray-400;
    }
  }
}

.quick-view-actions {
  @apply px-6 py-4 bg-gray-50;
  gap: 12px;

  .v-btn {
    @apply font-semibold;
    text-transform: none;
    letter-spacing: 0.25px;
    border-radius: 8px;
    padding: 0 24px;
  }
}
</style>
