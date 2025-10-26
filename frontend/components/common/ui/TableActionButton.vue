<template>
  <v-btn
    :icon="icon"
    size="x-small"
    variant="tonal"
    :color="color"
    class="action-btn"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <v-icon size="18">{{ icon }}</v-icon>
    <ClientOnly>
      <v-tooltip activator="parent" location="top">{{ tooltip }}</v-tooltip>
    </ClientOnly>
  </v-btn>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    tooltip: string
    color?: string
    disabled?: boolean
  }>(),
  {
    color: 'primary',
    disabled: false,
  }
)
</script>

<style scoped>
.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}
</style>
