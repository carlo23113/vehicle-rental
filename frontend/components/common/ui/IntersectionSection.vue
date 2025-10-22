<template>
  <div ref="target">
    <slot v-if="isVisible" name="default" />
    <slot v-else name="placeholder">
      <v-skeleton-loader v-if="showSkeleton" :type="skeletonType" :height="height" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useLazyLoad } from '~/composables/useLazyLoad'

interface Props {
  rootMargin?: string
  threshold?: number
  once?: boolean
  showSkeleton?: boolean
  skeletonType?: string
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  rootMargin: '50px',
  threshold: 0.1,
  once: true,
  showSkeleton: true,
  skeletonType: 'card',
  height: '200'
})

const { target, isVisible } = useLazyLoad({
  rootMargin: props.rootMargin,
  threshold: props.threshold,
  once: props.once
})
</script>

<style scoped>
/* Add any necessary styles */
</style>
