<template>
  <v-dialog v-model="dialogModel" max-width="500" persistent>
    <v-card>
      <v-card-title :class="`d-flex align-center gap-2 pa-4 bg-${actionColor}`">
        <v-icon :icon="actionIcon" size="24" />
        <span class="text-h6">{{ actionTitle }}</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Confirmation Message -->
        <div class="mb-4">
          <p class="text-body-1">{{ confirmMessage }}</p>
        </div>

        <!-- Additional Info (Optional) -->
        <v-alert v-if="showInfo" type="info" variant="tonal" class="mb-4">
          <slot name="info" />
        </v-alert>

        <!-- Optional Notes Field -->
        <v-textarea
          v-if="showNotesField"
          v-model="notes"
          label="Notes (Optional)"
          variant="outlined"
          density="comfortable"
          rows="3"
          prepend-inner-icon="mdi-note-text"
          placeholder="Add any notes about this action..."
          counter="500"
          maxlength="500"
        />

        <!-- Custom Content Slot -->
        <slot name="content" :notes="notes" />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="handleCancel">
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="actionColor"
          variant="flat"
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
export interface StatusActionDialogProps {
  modelValue: boolean
  actionTitle: string
  actionIcon: string
  actionColor: string
  confirmMessage: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  showNotesField?: boolean
  showInfo?: boolean
}

const props = withDefaults(defineProps<StatusActionDialogProps>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loading: false,
  showNotesField: false,
  showInfo: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [notes: string]
  cancel: []
}>()

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const notes = ref<string>('')

const handleConfirm = () => {
  emit('confirm', notes.value)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

// Reset notes when dialog closes
watch(dialogModel, (newValue) => {
  if (!newValue) {
    notes.value = ''
  }
})
</script>

<style scoped>
.v-card-title {
  color: white;
}
</style>
