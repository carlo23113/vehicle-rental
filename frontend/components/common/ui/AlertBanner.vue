<template>
  <v-alert
    v-if="count > 0"
    :type="type"
    :variant="variant"
    :color="color"
    :closable="closable"
    class="mb-3"
    density="compact"
  >
    <div class="d-flex align-center justify-space-between">
      <div class="flex-grow-1">
        <div class="d-flex align-center gap-2 mb-1">
          <v-icon v-if="icon" :icon="icon" size="20" />
          <span class="text-subtitle-2 font-weight-bold">{{ title }}</span>
        </div>
        <p class="text-body-2 mb-0">{{ message }}</p>

        <!-- Optional List -->
        <ul v-if="items && items.length > 0" class="mt-2 mb-0 text-body-2">
          <li v-for="(item, index) in displayItems" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- Action Button -->
      <div v-if="showAction" class="ml-4">
        <v-btn
          :variant="actionVariant"
          :color="actionColor || color"
          size="small"
          @click="$emit('action')"
        >
          {{ actionText }}
        </v-btn>
      </div>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    count: number
    title: string
    message: string
    type?: 'success' | 'info' | 'warning' | 'error'
    variant?: 'tonal' | 'elevated' | 'outlined' | 'flat' | 'text'
    color?: string
    icon?: string
    closable?: boolean
    prominent?: boolean
    items?: string[]
    maxItems?: number
    showAction?: boolean
    actionText?: string
    actionVariant?: 'flat' | 'elevated' | 'outlined' | 'text'
    actionColor?: string
  }>(),
  {
    type: 'warning',
    variant: 'tonal',
    closable: true,
    maxItems: 5,
    showAction: true,
    actionText: 'View All',
    actionVariant: 'flat',
  }
)

defineEmits<{
  action: []
}>()

const displayItems = computed(() => {
  if (!props.items || props.items.length === 0) return []
  return props.items.slice(0, props.maxItems)
})
</script>
