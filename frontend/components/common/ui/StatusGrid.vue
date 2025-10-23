<script setup lang="ts">
interface StatusItem {
  status: string
  count: number | string
  percentage?: number
  icon?: string
  color?: string
}

interface Props {
  items: StatusItem[]
  cols?: number
  getIcon?: (status: string) => string
  getColor?: (status: string) => string
}

const props = withDefaults(defineProps<Props>(), {
  cols: 6
})

const getItemIcon = (item: StatusItem) => {
  return item.icon || (props.getIcon ? props.getIcon(item.status) : undefined)
}

const getItemColor = (item: StatusItem) => {
  return item.color || (props.getColor ? props.getColor(item.status) : 'primary')
}
</script>

<template>
  <v-row dense>
    <v-col v-for="item in items" :key="item.status" :cols="cols">
      <CommonUiStatusCard
        :status="item.status"
        :count="item.count"
        :percentage="item.percentage"
        :icon="getItemIcon(item)"
        :color="getItemColor(item)"
      />
    </v-col>
  </v-row>
</template>
