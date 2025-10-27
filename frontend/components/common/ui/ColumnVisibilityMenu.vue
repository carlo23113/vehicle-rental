<template>
  <v-menu :close-on-content-click="false" location="bottom end">
    <template #activator="{ props: menuProps }">
      <div
        v-bind="menuProps"
        class="column-visibility-trigger"
        :class="{ 'has-hidden': hiddenCount > 0 }"
      >
        <div class="trigger-icon">
          <v-icon :icon="icon" :size="20" />
          <div v-if="hiddenCount > 0" class="icon-badge">
            {{ hiddenCount }}
          </div>
        </div>
        <div v-if="!iconOnly" class="trigger-content">
          <div class="trigger-label">{{ buttonText }}</div>
          <div class="trigger-subtitle">
            {{ visibleCount }}/{{ totalCount }} visible
          </div>
        </div>
        <v-icon
          v-if="!iconOnly"
          icon="mdi-chevron-down"
          :size="16"
          class="trigger-chevron"
        />
      </div>
    </template>

    <v-card min-width="280" max-width="400" class="column-visibility-menu">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between py-3">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-table-column" size="20" />
          <span class="text-subtitle-1 font-weight-bold">{{ title }}</span>
        </div>
        <v-chip size="small" variant="tonal" color="primary">
          {{ visibleCount }}/{{ totalCount }}
        </v-chip>
      </v-card-title>

      <v-divider />

      <!-- Search -->
      <div v-if="searchable" class="pa-3">
        <v-text-field
          v-model="searchQuery"
          density="compact"
          variant="outlined"
          placeholder="Search columns..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
        />
      </div>

      <!-- Column List -->
      <v-card-text class="pa-0" style="max-height: 400px; overflow-y: auto">
        <v-list density="compact">
          <v-list-item
            v-for="column in filteredColumns"
            :key="column.key"
            :disabled="column.required"
            @click="!column.required && toggleColumn(column.key)"
          >
            <template #prepend>
              <v-checkbox-btn
                :model-value="isColumnVisible(column.key)"
                :disabled="column.required"
                @click.stop="!column.required && toggleColumn(column.key)"
              />
            </template>

            <v-list-item-title>
              {{ column.title }}
              <v-chip
                v-if="column.required"
                size="x-small"
                variant="flat"
                color="primary"
                class="ml-2"
              >
                Required
              </v-chip>
            </v-list-item-title>
          </v-list-item>

          <!-- No results -->
          <v-list-item v-if="filteredColumns.length === 0">
            <v-list-item-title class="text-center text-medium-emphasis">
              No columns found
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="pa-3">
        <v-btn
          variant="text"
          size="small"
          prepend-icon="mdi-eye"
          @click="showAllColumns"
        >
          Show All
        </v-btn>
        <v-spacer />
        <v-btn
          variant="text"
          size="small"
          prepend-icon="mdi-refresh"
          @click="resetToDefaults"
        >
          Reset
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableColumn } from '~/composables/useColumnVisibility'

interface Props {
  columns: TableColumn[]
  visibleCount: number
  hiddenCount: number
  totalCount: number
  isColumnVisible: (key: string) => boolean
  // Customization
  title?: string
  buttonText?: string
  icon?: string
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  color?: string
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  iconOnly?: boolean
  searchable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Column Visibility',
  buttonText: 'Columns',
  icon: 'mdi-view-column',
  variant: 'tonal',
  color: undefined,
  size: 'default',
  iconOnly: false,
  searchable: true,
})

const emit = defineEmits<{
  toggle: [columnKey: string]
  'show-all': []
  reset: []
}>()

const searchQuery = ref('')

// Filter columns based on search
const filteredColumns = computed(() => {
  if (!searchQuery.value) return props.columns

  const query = searchQuery.value.toLowerCase()
  return props.columns.filter((col) =>
    col.title.toLowerCase().includes(query),
  )
})

const toggleColumn = (columnKey: string) => {
  emit('toggle', columnKey)
}

const showAllColumns = () => {
  emit('show-all')
}

const resetToDefaults = () => {
  emit('reset')
}
</script>

<style scoped lang="scss">
.column-visibility-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgb(var(--v-theme-surface));
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 56px;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(var(--v-theme-primary), 0.4);
    box-shadow:
      0 4px 12px rgba(var(--v-theme-primary), 0.15),
      0 0 0 3px rgba(var(--v-theme-primary), 0.08);
  }

  &.has-hidden {
    border-color: rgba(var(--v-theme-warning), 0.5);
    background: rgba(var(--v-theme-warning), 0.05);

    &:hover {
      border-color: rgba(var(--v-theme-warning), 0.7);
      box-shadow:
        0 4px 12px rgba(var(--v-theme-warning), 0.2),
        0 0 0 3px rgba(var(--v-theme-warning), 0.1);
    }
  }

  &:active {
    transform: translateY(0);
  }
}

.trigger-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.icon-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  background: rgb(var(--v-theme-warning));
  color: rgb(var(--v-theme-on-warning));
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 9px;
  line-height: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.trigger-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.trigger-label {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-surface));
}

.trigger-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.2;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.trigger-chevron {
  flex-shrink: 0;
  opacity: 0.6;
  transition: transform 0.2s ease;

  .column-visibility-trigger:hover & {
    opacity: 1;
  }
}

.column-visibility-menu :deep(.v-list-item) {
  cursor: pointer;
  transition: background-color 0.2s;
}

.column-visibility-menu :deep(.v-list-item:hover:not(.v-list-item--disabled)) {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.column-visibility-menu :deep(.v-list-item--disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
