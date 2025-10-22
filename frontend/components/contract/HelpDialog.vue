<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="500px">
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between pa-6">
        <div class="d-flex align-center ga-2">
          <v-icon color="primary">mdi-help-circle</v-icon>
          <span class="text-h6">Editor Help</span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)" />
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-6">
        <div class="help-content">
          <div v-for="item in helpItems" :key="item.title" class="help-item">
            <v-icon size="18">{{ item.icon }}</v-icon>
            <div>
              <div class="help-title">{{ item.title }}</div>
              <div class="help-desc">{{ item.description }}</div>
            </div>
          </div>
        </div>
        <v-alert type="info" variant="tonal" class="mt-4">
          <strong>Tip:</strong> {{ tip }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
export interface HelpItem {
  icon: string
  title: string
  description: string
}

withDefaults(
  defineProps<{
    modelValue: boolean
    helpItems?: HelpItem[]
    tip?: string
  }>(),
  {
    helpItems: () => [
      {
        icon: 'mdi-format-bold',
        title: 'Text Formatting',
        description: 'Bold, italic, and underline text',
      },
      {
        icon: 'mdi-format-header-1',
        title: 'Headings',
        description: 'Use H1, H2, or H3 for section headers',
      },
      {
        icon: 'mdi-format-list-numbered',
        title: 'Lists',
        description: 'Create bullet or numbered lists',
      },
      {
        icon: 'mdi-format-align-left',
        title: 'Alignment',
        description: 'Align text left, center, right, or justify',
      },
    ],
    tip: 'Use numbered lists for terms to make them easier to reference.',
  }
)

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.help-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.help-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.help-item .v-icon {
  color: rgb(var(--v-theme-primary));
  margin-top: 2px;
}

.help-title {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.help-desc {
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>
