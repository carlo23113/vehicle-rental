<template>
  <div class="detail-page-header">
    <!-- Breadcrumbs -->
    <CommonPageBreadcrumbs
      v-if="showBreadcrumbs && parentLabel && parentIcon"
      :parent-label="parentLabel"
      :parent-icon="parentIcon"
      :current-label="title"
      @back="$emit('back')"
    />

    <!-- Header Section -->
    <div class="relative mb-5">
      <div class="flex items-center mb-4">
        <div class="flex-grow">
          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-2xl font-semibold text-on-surface/87 mb-0">{{ title }}</h1>
            <v-chip
              v-if="badge"
              size="small"
              :color="badgeColor"
              :variant="badgeVariant"
              class="h-5 text-[0.6875rem]"
            >
              {{ badge }}
            </v-chip>
          </div>
          <p v-if="subtitle" class="text-[0.8125rem] text-on-surface/60 mt-0.5 mb-0">{{ subtitle }}</p>
        </div>
        <div class="flex gap-2">
          <slot name="actions">
            <v-btn
              v-for="action in actions"
              :key="action.key"
              :variant="action.variant || 'outlined'"
              :color="action.color"
              :size="action.size || 'default'"
              :prepend-icon="action.icon"
              :icon="action.iconOnly ? action.icon : undefined"
              class="normal-case font-medium"
              :disabled="action.disabled"
              @click="$emit('action', action.key)"
            >
              {{ action.iconOnly ? undefined : action.label }}
            </v-btn>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface DetailPageAction {
  key: string
  label: string
  icon?: string
  iconOnly?: boolean
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  color?: string
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  disabled?: boolean
}

interface Props {
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: string
  badgeVariant?: 'flat' | 'tonal' | 'outlined' | 'elevated' | 'plain'
  showBreadcrumbs?: boolean
  parentLabel?: string
  parentIcon?: string
  actions?: DetailPageAction[]
}

withDefaults(defineProps<Props>(), {
  badgeVariant: 'tonal',
  showBreadcrumbs: true,
  actions: () => []
})

defineEmits<{
  back: []
  action: [key: string]
}>()
</script>

<style scoped>
.detail-page-header {
  margin-bottom: 1.5rem;
}
</style>
