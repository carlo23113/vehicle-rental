<template>
  <div class="activity-timestamp" :class="{ 'activity-timestamp--compact': compact }">
    <v-tooltip :text="tooltipText" location="top">
      <template #activator="{ props: tooltipProps }">
        <div v-bind="tooltipProps" class="d-flex align-center gap-2">
          <v-icon
            v-if="showIcon"
            :icon="computedIcon"
            :color="computedColor"
            :size="iconSize"
          />
          <div class="activity-timestamp__content">
            <div
              v-if="label"
              class="activity-timestamp__label text-caption text-medium-emphasis"
            >
              {{ label }}
            </div>
            <div
              class="activity-timestamp__value"
              :class="[
                compact ? 'text-body-2' : 'text-subtitle-2',
                { 'font-weight-medium': !compact },
              ]"
            >
              {{ displayValue }}
            </div>
          </div>
        </div>
      </template>
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate, isOverdue, isUpcoming } from '~/utils/dateFormatter'
import type { DateFormatStyle } from '~/utils/dateFormatter'

interface Props {
  date: string | Date | null | undefined
  label?: string
  format?: DateFormatStyle
  icon?: string
  color?: string
  showIcon?: boolean
  compact?: boolean
  iconSize?: string | number
  emptyText?: string
  // Automatic color coding based on date
  colorCode?: boolean
  // For overdue detection (e.g., maintenance due dates)
  detectOverdue?: boolean
  // For upcoming detection (e.g., upcoming maintenance)
  detectUpcoming?: boolean
  upcomingDays?: number
}

const props = withDefaults(defineProps<Props>(), {
  format: 'relative',
  showIcon: true,
  compact: false,
  iconSize: 'small',
  emptyText: 'N/A',
  colorCode: false,
  detectOverdue: false,
  detectUpcoming: false,
  upcomingDays: 7,
})

const displayValue = computed(() => {
  if (!props.date) return props.emptyText
  return formatDate(props.date, props.format)
})

const computedIcon = computed(() => {
  if (props.icon) return props.icon

  // Auto icon based on format
  if (props.format === 'relative') return 'mdi-clock-outline'
  if (props.format === 'time' || props.format === 'datetime') return 'mdi-clock'
  return 'mdi-calendar'
})

const computedColor = computed(() => {
  if (props.color) return props.color

  if (!props.colorCode || !props.date) return undefined

  // Check for overdue
  if (props.detectOverdue && isOverdue(props.date)) {
    return 'error'
  }

  // Check for upcoming
  if (props.detectUpcoming && isUpcoming(props.date, props.upcomingDays)) {
    return 'warning'
  }

  return undefined
})

const tooltipText = computed(() => {
  if (!props.date) return props.emptyText

  // Show full datetime in tooltip if using relative time
  if (props.format === 'relative') {
    return formatDate(props.date, 'datetime')
  }

  // Show relative time in tooltip if using absolute format
  return formatDate(props.date, 'relative')
})
</script>

<style scoped>
.activity-timestamp {
  min-width: 0;
}

.activity-timestamp--compact .activity-timestamp__content {
  gap: 0;
}

.activity-timestamp__label {
  line-height: 1.2;
  margin-bottom: 2px;
}

.activity-timestamp__value {
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
