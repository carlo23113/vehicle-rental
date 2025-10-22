<template>
  <CommonUiDetailCard title="Quick Actions" icon="mdi-lightning-bolt" class="mb-6">
    <div class="flex flex-col gap-2">
      <!-- Start Rental -->
      <CommonUiActionButton
        v-if="status === 'reserved'"
        icon="mdi-play-circle"
        title="Start Rental"
        subtitle="Begin active rental period"
        color="success"
        @click="$emit('start')"
      />

      <!-- Complete Rental -->
      <CommonUiActionButton
        v-if="status === 'active'"
        icon="mdi-check-circle"
        title="Complete Rental"
        subtitle="Finalize and close rental"
        color="primary"
        @click="$emit('complete')"
      />

      <!-- Cancel Rental -->
      <CommonUiActionButton
        v-if="status !== 'completed' && status !== 'cancelled'"
        icon="mdi-cancel"
        title="Cancel Rental"
        subtitle="Void and cancel this rental"
        color="error"
        @click="$emit('cancel')"
      />

      <!-- Empty State -->
      <div v-if="status === 'completed' || status === 'cancelled'" class="empty-state">
        <v-icon icon="mdi-check-circle-outline" size="32" class="opacity-30" />
        <p class="text-sm text-on-surface/50 mt-2">No actions available</p>
      </div>
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
defineProps<{
  status: string
}>()

defineEmits<{
  start: []
  complete: []
  cancel: []
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
}
</style>
