<script setup lang="ts">
defineProps<{
  parentLabel: string
  parentIcon: string
  currentLabel: string
}>()

defineEmits<{
  back: []
}>()
</script>

<template>
  <v-breadcrumbs class="px-0 pb-3">
    <v-breadcrumbs-item>
      <v-btn
        variant="text"
        size="small"
        :prepend-icon="parentIcon"
        class="normal-case font-medium text-[0.8125rem] text-on-surface/70 px-2 py-1 h-auto min-h-0 hover:text-on-surface/87"
        @click="$emit('back')"
      >
        {{ parentLabel }}
      </v-btn>
    </v-breadcrumbs-item>
    <v-breadcrumbs-divider>
      <v-icon size="16">mdi-chevron-right</v-icon>
    </v-breadcrumbs-divider>
    <v-breadcrumbs-item>
      <span class="text-[0.8125rem] font-medium text-on-surface/87">{{ currentLabel }}</span>
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>
