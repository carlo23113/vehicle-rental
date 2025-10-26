<template>
  <v-alert
    v-if="count > 0"
    type="warning"
    variant="tonal"
    closable
    class="mb-6"
    prominent
  >
    <v-alert-title class="font-weight-bold">
      {{ count }} {{ itemName }}{{ count !== 1 ? 's' : '' }} expiring soon
    </v-alert-title>
    <p class="mt-2">{{ message }}</p>
    <template #append>
      <v-btn variant="flat" color="warning" @click="$emit('view-all')">View All</v-btn>
    </template>
  </v-alert>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count: number
    itemName?: string
    message?: string
  }>(),
  {
    itemName: 'document',
    message: 'Review and renew expiring items to maintain compliance.',
  }
)

defineEmits<{
  'view-all': []
}>()
</script>
