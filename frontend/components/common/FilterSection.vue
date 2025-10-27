<template>
  <div class="filter-section">
    <!-- Filter Toggle Button -->
    <v-btn
      :variant="showFilters ? 'flat' : 'outlined'"
      :color="showFilters ? 'primary' : undefined"
      prepend-icon="mdi-filter-variant"
      @click="showFilters = !showFilters"
    >
      {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      <v-badge
        v-if="activeFilterCount > 0 && !showFilters"
        :content="activeFilterCount"
        color="primary"
        inline
        class="ml-2"
      />
    </v-btn>

    <!-- Expandable Filter Card -->
    <v-expand-transition>
      <v-card v-if="showFilters" class="mt-6 filter-card" elevation="0">
        <v-card-text class="pa-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center gap-3">
              <div class="filter-icon">
                <v-icon color="primary" size="20">mdi-filter-variant</v-icon>
              </div>
              <div>
                <h3 class="text-sm font-weight-bold">Filters</h3>
                <p class="text-xs text-medium-emphasis">Refine your search results</p>
              </div>
            </div>
            <v-btn
              v-if="activeFilterCount > 0"
              variant="text"
              color="error"
              size="small"
              prepend-icon="mdi-filter-remove"
              @click="clearFilters"
            >
              Clear all ({{ activeFilterCount }})
            </v-btn>
          </div>

          <slot></slot>
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue?: boolean
  filters?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  filters: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  clear: []
}>()

const showFilters = ref(props.modelValue)

watch(
  () => props.modelValue,
  value => {
    showFilters.value = value
  }
)

watch(showFilters, value => {
  emit('update:modelValue', value)
})

const activeFilterCount = computed(() => {
  return Object.values(props.filters).filter(value => {
    if (value === null || value === undefined || value === '') return false
    if (value === 'all') return false
    if (Array.isArray(value) && value.length === 0) return false
    return true
  }).length
})

const clearFilters = () => {
  emit('clear')
}
</script>

<style scoped>
.filter-section {
  margin-bottom: 1.5rem;
}

.filter-card {
  border: 1px solid rgba(var(--v-border-color), 0.08);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.12);
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.08);
}

.filter-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1) 0%,
    rgba(var(--v-theme-secondary), 0.1) 100%
  );
}

.gap-3 {
  gap: 0.75rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.filter-card :deep(.search-field .v-field) {
  transition: all 0.3s ease;
}

.filter-card :deep(.search-field .v-field:hover) {
  background: rgba(var(--v-theme-primary), 0.02);
}
</style>
