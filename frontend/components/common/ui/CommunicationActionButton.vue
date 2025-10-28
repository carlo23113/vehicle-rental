<template>
  <v-menu>
    <template #activator="{ props: menuProps }">
      <v-tooltip :text="tooltip" location="top">
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="{ ...menuProps, ...tooltipProps }"
            :icon="icon"
            :color="color"
            :size="size"
            variant="text"
            density="comfortable"
          />
        </template>
      </v-tooltip>
    </template>

    <v-list density="compact" class="communication-menu">
      <v-list-item
        v-for="action in actions"
        :key="action.type"
        :prepend-icon="action.icon"
        :title="action.label"
        :subtitle="action.subtitle"
        @click="$emit('action', action.type)"
      >
        <template v-if="action.badge" #append>
          <v-chip size="x-small" :color="action.badgeColor || 'primary'" variant="tonal">
            {{ action.badge }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
export interface CommunicationAction {
  type: string
  label: string
  subtitle?: string
  icon: string
  badge?: string
  badgeColor?: string
}

withDefaults(
  defineProps<{
    icon?: string
    tooltip?: string
    color?: string
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
    actions: CommunicationAction[]
  }>(),
  {
    icon: 'mdi-message-text',
    tooltip: 'Contact Customer',
    color: 'primary',
    size: 'small',
  }
)

defineEmits<{
  action: [type: string]
}>()
</script>

<style scoped lang="scss">
.communication-menu {
  :deep(.v-list-item-subtitle) {
    @apply text-xs opacity-70;
  }
}
</style>
