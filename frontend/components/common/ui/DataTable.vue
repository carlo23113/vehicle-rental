<template>
  <v-card elevation="0" class="table-card">
    <v-card-text class="!p-0">
      <v-data-table
        v-model="selectedItemsModel"
        :headers="headers"
        :items="items"
        :items-per-page="itemsPerPage"
        :loading="loading"
        :search="search"
        :density="density"
        :hover="hover"
        :fixed-header="fixedHeader"
        :height="height"
        :class="tableClass"
        :items-per-page-options="itemsPerPageOptions"
        :show-select="showSelect"
        :item-value="itemValue"
        @click:row="(_event: any, { item }: any) => handleRowClick(item)"
      >
        <!-- Pass through all slots -->
        <template v-for="(_, slot) in $slots" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>

        <!-- Loading state -->
        <template v-if="!$slots['loading']" #loading>
          <div class="loading-state">
            <v-progress-circular indeterminate color="primary" size="48" />
            <p class="text-sm text-medium-emphasis mt-4">{{ loadingText }}</p>
          </div>
        </template>

        <!-- Default empty state -->
        <template v-if="!$slots['no-data']" #no-data>
          <div class="empty-state">
            <v-icon :icon="emptyIcon" size="64" class="empty-icon" />
            <h3 class="text-lg font-bold mt-4">{{ emptyTitle }}</h3>
            <p class="text-sm text-medium-emphasis mt-2">{{ emptyMessage }}</p>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
export interface TableHeader {
  title: string
  key: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
}

export interface DataTableProps {
  headers: TableHeader[]
  items: Array<any>
  itemsPerPage?: number
  itemsPerPageOptions?: Array<number | { title: string; value: number }>
  loading?: boolean
  search?: string
  tableClass?: string
  density?: 'default' | 'comfortable' | 'compact'
  hover?: boolean
  fixedHeader?: boolean
  height?: string | number
  emptyIcon?: string
  emptyTitle?: string
  emptyMessage?: string
  loadingText?: string
  showSelect?: boolean
  itemValue?: string
  selectedItems?: any[]
}

const props = withDefaults(defineProps<DataTableProps>(), {
  itemsPerPage: 10,
  itemsPerPageOptions: () => [10, 25, 50, 100],
  loading: false,
  search: '',
  tableClass: 'data-table',
  density: 'default',
  hover: true,
  fixedHeader: false,
  emptyIcon: 'mdi-database-off',
  emptyTitle: 'No data found',
  emptyMessage: 'Try adjusting your filters or add new items',
  loadingText: 'Loading data...',
  showSelect: false,
  itemValue: 'id',
  selectedItems: () => [],
})

const emit = defineEmits<{
  'row-click': [item: any]
  'update:selectedItems': [items: any[]]
}>()

const selectedItemsModel = computed({
  get: () => props.selectedItems || [],
  set: (value) => emit('update:selectedItems', value || []),
})

const handleRowClick = (item: any) => {
  // Only emit row-click if selection mode is disabled
  // This prevents conflict between selection and row click
  if (!props.showSelect) {
    emit('row-click', item)
  }
}
</script>

<style scoped>
.table-card {
  border: 1px solid rgba(var(--v-border-color), 0.08);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.table-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.12);
  box-shadow: 0 8px 32px rgba(var(--v-theme-primary), 0.08);
}

.data-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.8px;
  padding: 1.25rem 1rem !important;
  background: rgba(var(--v-theme-primary), 0.02) !important;
}

.data-table :deep(.v-data-table-header__icon) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.4;
}

.data-table :deep(th:hover .v-data-table-header__icon) {
  opacity: 0.8;
  transform: scale(1.1);
}

.data-table
  :deep(th.v-data-table__th--sortable.v-data-table__th--sorted .v-data-table-header__icon) {
  opacity: 1 !important;
  transform: scale(1.15);
  color: rgb(var(--v-theme-primary)) !important;
}

.data-table :deep(.v-data-table__th--sorted .v-data-table-header__sort-badge) {
  background: rgb(var(--v-theme-primary)) !important;
}

/* Specific animations for ascending/descending */
.data-table :deep(th[aria-sort='ascending'] .v-data-table-header__icon) {
  animation: sortAscend 0.3s ease;
}

.data-table :deep(th[aria-sort='descending'] .v-data-table-header__icon) {
  animation: sortDescend 0.3s ease;
}

@keyframes sortAscend {
  0% {
    transform: scale(1) rotate(180deg);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.3) rotate(90deg);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.15) rotate(0deg);
    opacity: 1;
  }
}

@keyframes sortDescend {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.3) rotate(90deg);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.15) rotate(180deg);
    opacity: 1;
  }
}

.data-table :deep(td) {
  padding: 0.75rem 1rem !important;
}

.data-table :deep(tbody tr) {
  transition: all 0.2s ease;
  cursor: pointer;
}

.data-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
  transform: translateX(2px);
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  opacity: 0.3;
}

.loading-state {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .table-card {
    border-radius: 12px;
  }

  .data-table :deep(th),
  .data-table :deep(td) {
    padding: 0.5rem !important;
    font-size: 0.875rem;
  }

  .empty-state,
  .loading-state {
    padding: 2rem 1rem;
  }
}
</style>
