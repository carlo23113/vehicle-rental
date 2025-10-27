<template>
  <v-row>
    <v-col cols="12">
      <LazyNotificationsList
        :notifications="notifications"
        @click="$emit('click', $event)"
        @menu="$emit('menu', $event)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface Notification {
  id: number
  title: string
  message: string
  time: string
  icon: string
  color: string
  type: string
  priority: string
  read: boolean
}

defineProps<{
  notifications: Notification[]
}>()

defineEmits<{
  click: [notification: Notification]
  menu: [notification: Notification]
}>()
</script>
