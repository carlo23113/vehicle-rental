<template>
  <div class="status-action-buttons d-flex align-center gap-1">
    <CommonUiTableActionButton
      v-for="action in availableActions"
      :key="action.action"
      :icon="action.icon"
      :color="action.color"
      :tooltip="action.tooltip"
      :disabled="isDisabled(action)"
      @click="handleAction(action)"
    />
  </div>
</template>

<script setup lang="ts">
import type { StatusAction, StatusActionsConfig } from '~/composables/useStatusActions'
import { getAvailableActions, isActionDisabled } from '~/composables/useStatusActions'

interface StatusActionButtonsProps {
  /** The item (vehicle, user, etc.) to show actions for */
  item: any
  /** Status actions configuration */
  config: StatusActionsConfig
}

const props = defineProps<StatusActionButtonsProps>()

const emit = defineEmits<{
  action: [payload: { action: string; item: any }]
}>()

const availableActions = computed(() => getAvailableActions(props.item, props.config))

const isDisabled = (action: StatusAction): boolean => {
  return isActionDisabled(props.item, action)
}

const handleAction = (action: StatusAction) => {
  emit('action', {
    action: action.action,
    item: props.item,
  })
}
</script>

<style scoped>
.status-action-buttons {
  min-width: fit-content;
}
</style>
