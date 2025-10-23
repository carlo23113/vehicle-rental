<script setup lang="ts">
interface ProgressItem {
  label: string
  value: string | number
  percentage: number
  color?: string
}

interface Props {
  items: ProgressItem[]
  showDot?: boolean
  height?: number
  getColor?: (item: ProgressItem) => string
}

const props = withDefaults(defineProps<Props>(), {
  showDot: false,
  height: 8
})

const getItemColor = (item: ProgressItem) => {
  if (item.color) return item.color
  if (props.getColor) return props.getColor(item)
  return 'primary'
}
</script>

<template>
  <CommonUiProgressItem
    v-for="item in items"
    :key="item.label"
    :label="item.label"
    :value="item.value"
    :percentage="item.percentage"
    :color="getItemColor(item)"
    :show-dot="showDot"
    :height="height"
    class="mb-3"
  />
</template>
