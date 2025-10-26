<template>
  <CommonPageContainer>
    <!-- Header Section -->
    <CommonPageHeader
      :title="title"
      :subtitle="subtitle"
      :action-text="actionText"
      :action-icon="actionIcon"
      :icon="icon"
      @action-click="$emit('action-click')"
    >
      <template v-if="$slots['header-actions']" #actions>
        <slot name="header-actions" />
      </template>
    </CommonPageHeader>

    <!-- Filters Section (optional) -->
    <slot
      v-if="$slots.filters"
      name="filters"
      :show-filters="showFilters"
      :sections-loaded="sectionsLoaded"
    />

    <!-- Stats Section with Intersection Observer -->
    <div v-if="$slots.stats || $slots['stats-skeleton']" ref="statsSection">
      <slot v-if="sectionsLoaded.stats" name="stats" />
      <slot v-else name="stats-skeleton">
        <LazyCommonUiStatsSkeleton />
      </slot>
    </div>

    <!-- Main Content Section with Intersection Observer -->
    <div ref="contentSection">
      <slot v-if="sectionsLoaded.content" name="content" />
      <slot v-else name="content-skeleton">
        <LazyCommonUiTableSkeleton />
      </slot>
    </div>

    <!-- Additional Sections (optional) -->
    <slot name="additional" />

    <!-- Dialogs/Modals (optional) -->
    <slot name="dialogs" />

    <!-- Snackbar (optional) -->
    <slot name="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    actionText?: string
    actionIcon?: string
    icon?: string
    autoLoadStats?: boolean
    autoLoadContent?: boolean
    observerRootMargin?: string
  }>(),
  {
    subtitle: '',
    actionText: '',
    actionIcon: '',
    icon: '',
    autoLoadStats: true,
    autoLoadContent: true,
    observerRootMargin: '100px',
  }
)

defineEmits<{
  'action-click': []
  'stats-loaded': []
  'content-loaded': []
}>()

// Section refs for intersection observer
const statsSection = ref<HTMLElement | null>(null)
const contentSection = ref<HTMLElement | null>(null)

// Section loading state
const sectionsLoaded = ref({
  stats: false,
  content: false,
})

// For filters - expose to parent via slot props
const showFilters = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  // Auto-load sections immediately if enabled
  if (props.autoLoadStats) {
    sectionsLoaded.value.stats = true
  }
  if (props.autoLoadContent) {
    sectionsLoaded.value.content = true
  }

  // Set up intersection observer for progressive loading (fallback for disabled auto-load)
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === statsSection.value && !sectionsLoaded.value.stats) {
            sectionsLoaded.value.stats = true
          } else if (entry.target === contentSection.value && !sectionsLoaded.value.content) {
            sectionsLoaded.value.content = true
          }
        }
      })
    },
    { rootMargin: props.observerRootMargin }
  )

  // Observe sections if they exist (only needed if auto-load is disabled)
  if (statsSection.value && !props.autoLoadStats) observer.observe(statsSection.value)
  if (contentSection.value && !props.autoLoadContent) observer.observe(contentSection.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

// Expose reactive values for parent components
defineExpose({
  sectionsLoaded,
  showFilters,
})
</script>
