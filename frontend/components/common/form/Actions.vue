<template>
  <div class="flex justify-end gap-3 mt-8">
    <v-btn
      v-if="showCancel"
      variant="text"
      size="large"
      :disabled="loading"
      @click="$emit('cancel')"
    >
      {{ cancelText }}
    </v-btn>
    <v-btn
      :type="submitType"
      color="primary"
      variant="flat"
      size="large"
      class="submit-btn"
      :loading="loading"
      @click="submitType === 'button' ? $emit('submit') : undefined"
    >
      <v-icon v-if="submitIcon" start>{{ submitIcon }}</v-icon>
      {{ submitText }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface Props {
  submitText?: string
  submitIcon?: string
  submitType?: 'submit' | 'button'
  cancelText?: string
  showCancel?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  submitText: 'Submit',
  submitType: 'submit',
  cancelText: 'Cancel',
  showCancel: true,
  loading: false
})

defineEmits<{
  submit: []
  cancel: []
}>()
</script>

<style scoped>
.submit-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 0 2rem;
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.35);
}
</style>
