<template>
  <CommonUiDetailCard title="Quick Actions" icon="mdi-lightning-bolt">
    <div class="actions-grid">
      <CommonUiActionButton
        v-if="maintenance.status === 'scheduled' || maintenance.status === 'in-progress'"
        icon="mdi-check-circle"
        title="Mark Complete"
        subtitle="Mark this maintenance as completed"
        color="success"
        @click="$emit('complete')"
      />

      <CommonUiActionButton
        icon="mdi-pencil"
        title="Edit Details"
        subtitle="Update maintenance information"
        color="primary"
        @click="$emit('edit')"
      />

      <CommonUiActionButton
        icon="mdi-delete"
        title="Delete Record"
        subtitle="Permanently remove this maintenance record"
        color="error"
        @click="$emit('delete')"
      />

      <CommonUiActionButton
        icon="mdi-printer"
        title="Print Report"
        subtitle="Generate maintenance report PDF"
        color="info"
        @click="$emit('print')"
      />
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
defineProps<{
  maintenance: any
}>()

defineEmits<{
  complete: []
  edit: []
  delete: []
  print: []
}>()
</script>

<style scoped>
.actions-grid {
  @apply flex flex-col gap-3;
}
</style>
