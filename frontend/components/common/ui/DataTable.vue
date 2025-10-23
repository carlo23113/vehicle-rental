<script setup lang="ts">
import { computed } from 'vue'

interface Column {
  key: string
  label?: string
  title?: string
  align?: 'left' | 'center' | 'right' | 'end' | 'start'
  width?: string
  sortable?: boolean
}

interface Props {
  columns?: Column[]
  headers?: Column[]
  items: any[]
  itemKey?: string
  itemsPerPage?: number
  tableClass?: string
  emptyIcon?: string
  emptyTitle?: string
  emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  itemKey: 'id',
  itemsPerPage: 10,
  tableClass: '',
  emptyIcon: 'mdi-information-outline',
  emptyTitle: 'No data',
  emptyMessage: 'No data available',
})

// Support both 'columns' and 'headers' props, and both 'label' and 'title' for column names
const normalizedColumns = computed(() => {
  const cols = props.columns || props.headers || []
  return cols.map(col => ({
    ...col,
    label: col.label || col.title || col.key,
    align: col.align === 'end' ? 'right' : col.align === 'start' ? 'left' : col.align || 'left',
  }))
})
</script>

<template>
  <v-table :class="['data-table', tableClass]">
    <thead>
      <tr>
        <th
          v-for="column in normalizedColumns"
          :key="column.key"
          :class="column.align ? `text-${column.align}` : ''"
          :style="column.width ? `width: ${column.width}` : ''"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item[itemKey]" class="table-row">
        <td
          v-for="column in normalizedColumns"
          :key="column.key"
          :class="column.align ? `text-${column.align}` : ''"
        >
          <slot :name="`item.${column.key}`" :item="item">
            {{ item[column.key] }}
          </slot>
        </td>
      </tr>
      <tr v-if="items.length === 0">
        <td :colspan="normalizedColumns.length" class="text-center py-8">
          <div class="empty-state">
            <v-icon :icon="emptyIcon" size="48" color="grey-lighten-1" class="mb-2"></v-icon>
            <div class="text-h6 text-medium-emphasis">{{ emptyTitle }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ emptyMessage }}</div>
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
.data-table {
  background: transparent;
}

.data-table thead tr th {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  border-bottom: 2px solid rgba(var(--v-border-color), 0.12);
  padding: 1rem;
}

.data-table tbody tr.table-row {
  transition: background-color 0.2s ease;
}

.data-table tbody tr.table-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.data-table tbody tr td {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
  padding: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
</style>
