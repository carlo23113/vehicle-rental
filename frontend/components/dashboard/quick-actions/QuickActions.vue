<script setup lang="ts">
type ActionColor = 'success' | 'primary' | 'error' | 'warning' | 'info'

interface QuickAction {
  title: string
  icon: string
  action: string
  color: ActionColor
}

defineProps<{
  actions: QuickAction[]
}>()

defineEmits<{
  'action-click': [action: string]
}>()
</script>

<template>
  <CommonUiDetailCard title="Quick Actions" icon="mdi-lightning-bolt" class="mb-4">
    <div class="flex flex-col gap-2">
      <CommonUiActionButton
        v-for="action in actions"
        :key="action.title"
        :icon="action.icon"
        :title="action.title"
        :subtitle="`Quick access to ${action.title.toLowerCase()}`"
        :color="action.color"
        @click="$emit('action-click', action.action)"
      />
    </div>
  </CommonUiDetailCard>
</template>
