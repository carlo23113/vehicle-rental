<template>
  <v-row class="mb-6">
    <v-col cols="12">
      <div class="d-flex justify-space-between align-center flex-wrap ga-4">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">{{ title }}</h1>
          <p class="text-body-1 text-medium-emphasis font-weight-regular">
            {{ subtitle }}
          </p>
        </div>
        <slot name="actions">
          <v-btn
            v-if="actionText"
            color="primary"
            size="large"
            elevation="2"
            class="rounded-lg"
            @click="$emit('action-click')"
          >
            <v-icon v-if="actionIcon" :icon="actionIcon" start></v-icon>
            {{ actionText }}
          </v-btn>
        </slot>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  actionText?: string
  actionIcon?: string
}>()

defineEmits<{
  'action-click': []
}>()
</script>
