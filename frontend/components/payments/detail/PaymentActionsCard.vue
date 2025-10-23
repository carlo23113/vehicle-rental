<template>
  <CommonUiDetailCard title="Actions" icon="mdi-lightning-bolt">
    <div class="actions-grid">
      <CommonUiActionButton
        v-if="status === 'pending'"
        icon="mdi-credit-card-check"
        title="Process Payment"
        subtitle="Mark payment as completed"
        color="success"
        @click="$emit('process')"
      />

      <CommonUiActionButton
        v-if="status === 'completed'"
        icon="mdi-keyboard-return"
        title="Issue Refund"
        subtitle="Refund payment to customer"
        color="warning"
        @click="$emit('refund')"
      />

      <CommonUiActionButton
        icon="mdi-printer"
        title="Print Receipt"
        subtitle="Print payment receipt"
        color="primary"
        @click="$emit('print')"
      />

      <CommonUiActionButton
        icon="mdi-email"
        title="Email Receipt"
        subtitle="Send receipt to customer"
        color="info"
        @click="$emit('email')"
      />

      <CommonUiActionButton
        v-if="status === 'failed'"
        icon="mdi-refresh"
        title="Retry Payment"
        subtitle="Attempt to process again"
        color="error"
        @click="$emit('retry')"
      />
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
defineProps<{
  status: string
}>()

defineEmits<{
  process: []
  refund: []
  print: []
  email: []
  retry: []
}>()
</script>

<style scoped>
.actions-grid {
  @apply flex flex-col gap-3;
}
</style>
