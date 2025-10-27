<template>
  <div class="advanced-filters-wrapper">
    <!-- Advanced Filters Toggle -->
    <v-card
      variant="outlined"
      class="advanced-filters-toggle"
      :class="{ 'filters-active': activeFiltersCount > 0 }"
      @click="isExpanded = !isExpanded"
    >
      <v-card-text class="pa-3 d-flex align-center justify-space-between cursor-pointer">
        <div class="d-flex align-center gap-3">
          <v-icon
            :icon="icon"
            size="24"
            :color="activeFiltersCount > 0 ? 'primary' : 'default'"
          />
          <div>
            <div class="text-subtitle-2 font-weight-bold">{{ title }}</div>
            <div v-if="activeFiltersCount > 0" class="text-caption text-medium-emphasis">
              {{ activeFiltersCount }} active filter{{ activeFiltersCount > 1 ? 's' : '' }}
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              {{ description }}
            </div>
          </div>
        </div>

        <div class="d-flex align-center gap-2">
          <v-chip v-if="activeFiltersCount > 0" size="small" color="primary" variant="flat">
            {{ activeFiltersCount }}
          </v-chip>
          <v-btn
            :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            variant="tonal"
            color="primary"
            size="small"
          />
        </div>
      </v-card-text>
    </v-card>

    <!-- Advanced Filters Content -->
    <v-expand-transition>
      <div v-show="isExpanded" class="mt-4">
        <v-row dense>
          <!-- Filters Slot -->
          <slot :active-count="activeFiltersCount" />
        </v-row>

        <!-- Clear Filters Button -->
        <div v-if="activeFiltersCount > 0 && showClearButton" class="mt-4 text-center">
          <v-btn
            variant="outlined"
            color="error"
            prepend-icon="mdi-filter-remove"
            @click="$emit('clear-filters')"
          >
            {{ clearButtonText }}
          </v-btn>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface AdvancedFiltersPanelProps {
  activeFiltersCount: number
  title?: string
  description?: string
  icon?: string
  showClearButton?: boolean
  clearButtonText?: string
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<AdvancedFiltersPanelProps>(), {
  title: 'Advanced Filters',
  description: 'Click to expand filters',
  icon: 'mdi-filter-variant',
  showClearButton: true,
  clearButtonText: 'Clear Advanced Filters',
  defaultExpanded: false,
})

defineEmits<{
  'clear-filters': []
}>()

const isExpanded = ref(props.defaultExpanded)
</script>

<style scoped lang="scss">
.advanced-filters-wrapper {
  width: 100%;
}

.advanced-filters-toggle {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(var(--v-border-color), 0.12) !important;

  &:hover {
    border-color: rgba(var(--v-theme-primary), 0.4) !important;
    box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.12);
    transform: translateY(-1px);
  }

  &.filters-active {
    border-color: rgb(var(--v-theme-primary)) !important;
    background: rgba(var(--v-theme-primary), 0.04);
    box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.08);
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
