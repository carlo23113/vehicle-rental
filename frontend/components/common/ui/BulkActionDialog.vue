<template>
  <v-dialog v-model="dialogModel" :max-width="maxWidth" persistent>
    <v-card>
      <v-card-title class="d-flex align-center gap-2 bg-primary pa-4">
        <v-icon :icon="icon" size="24" />
        <span class="text-h6">{{ title }}</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Selection Preview -->
        <div class="mb-4">
          <div class="text-subtitle-2 text-medium-emphasis mb-2">
            {{ description || `You are updating ${selectedCount} ${itemLabel}${selectedCount > 1 ? 's' : ''}` }}
          </div>

          <!-- Preview Chips -->
          <div v-if="showPreview" class="preview-chips">
            <v-chip
              v-for="item in previewItems"
              :key="getItemKey(item)"
              size="small"
              class="mr-2 mb-2"
              variant="outlined"
            >
              {{ getItemLabel(item) }}
            </v-chip>
            <v-chip v-if="remainingCount > 0" size="small" variant="outlined" class="mb-2">
              +{{ remainingCount }} more
            </v-chip>
          </div>
        </div>

        <!-- Custom Form Content Slot -->
        <slot
          name="form"
          :selected-items="selectedItems"
          :selected-count="selectedCount"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <slot name="actions-prepend" />
        <v-spacer />
        <v-btn variant="text" @click="handleCancel">
          {{ cancelText }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="confirmDisabled"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
export interface BulkActionDialogProps {
  modelValue: boolean
  selectedItems: any[]
  loading?: boolean
  title?: string
  description?: string
  icon?: string
  itemLabel?: string
  confirmText?: string
  cancelText?: string
  confirmDisabled?: boolean
  maxWidth?: string | number
  showPreview?: boolean
  previewLimit?: number
  itemLabelKey?: string | ((item: any) => string)
  itemValueKey?: string
}

const props = withDefaults(defineProps<BulkActionDialogProps>(), {
  loading: false,
  title: 'Bulk Action',
  description: '',
  icon: 'mdi-checkbox-multiple-marked',
  itemLabel: 'item',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmDisabled: false,
  maxWidth: 500,
  showPreview: true,
  previewLimit: 3,
  itemLabelKey: 'name',
  itemValueKey: 'id',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const selectedCount = computed(() => props.selectedItems.length)

const previewItems = computed(() => props.selectedItems.slice(0, props.previewLimit))

const remainingCount = computed(() => Math.max(0, selectedCount.value - props.previewLimit))

const getItemLabel = (item: any): string => {
  if (typeof props.itemLabelKey === 'function') {
    return props.itemLabelKey(item)
  }
  return item[props.itemLabelKey] || item.id || 'Unknown'
}

const getItemKey = (item: any): string | number => {
  return item[props.itemValueKey] || item.id
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.v-card-title {
  color: white;
}

.preview-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
