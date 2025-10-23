<script setup lang="ts">
interface RankingItem {
  id: string | number
  name: string
  subtitle: string
  value: string | number
}

interface Props {
  items: RankingItem[]
  getRankColor?: (index: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  getRankColor: (index: number) => {
    const colors = ['warning', 'info', 'success', 'primary', 'secondary']
    return colors[index] || 'primary'
  }
})
</script>

<template>
  <CommonUiRankingCard
    v-for="(item, index) in items"
    :key="item.id"
    :rank="index + 1"
    :title="item.name"
    :subtitle="item.subtitle"
    :value="item.value"
    :rank-color="getRankColor(index)"
  />
</template>
