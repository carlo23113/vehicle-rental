<template>
  <div class="flex justify-between px-8 py-6 bg-surface border-b border-border/[0.08] sticky top-0 z-10 backdrop-blur-xl md:flex-row md:items-center flex-col items-stretch gap-4 md:gap-0">
    <div class="flex items-center gap-4">
      <v-btn
        icon
        variant="text"
        size="small"
        class="opacity-70 hover:opacity-100 transition-opacity duration-200"
        @click="$emit('back')"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div>
        <h1 class="text-2xl font-semibold m-0 text-on-surface">{{ title }}</h1>
        <p class="text-sm m-0 text-on-surface/60">{{ subtitle }}</p>
      </div>
    </div>
    <div class="flex gap-3 md:justify-start justify-end">
      <v-btn
        variant="text"
        prepend-icon="mdi-refresh"
        @click="$emit('reset')"
        :disabled="saving"
      >
        Reset
      </v-btn>
      <v-btn
        :variant="hasUnsavedChanges ? 'flat' : 'tonal'"
        :color="hasUnsavedChanges ? 'primary' : 'default'"
        prepend-icon="mdi-content-save"
        :loading="saving"
        @click="$emit('save')"
      >
        {{ hasUnsavedChanges ? 'Save Changes' : 'Saved' }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  hasUnsavedChanges: boolean
  saving: boolean
}>()

defineEmits<{
  back: []
  reset: []
  save: []
}>()
</script>
