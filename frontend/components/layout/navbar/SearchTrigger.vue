<template>
  <div class="mr-4 w-full max-w-[480px] lg:max-w-[300px] hidden sm:block">
    <v-text-field
      model-value=""
      prepend-inner-icon="mdi-magnify"
      placeholder="Search anything..."
      variant="solo"
      density="comfortable"
      hide-details
      single-line
      class="search-field transition-all duration-300"
      rounded="xl"
      readonly
      @click="$emit('click')"
    >
      <template #append-inner>
        <v-chip size="x-small" class="bg-on-surface/6 font-semibold text-[0.7rem] px-1.5 h-5">⌘K</v-chip>
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  click: []
}>()
</script>

<style scoped>
.search-field :deep(.v-field) {
  background: white;
  border: 1px solid rgba(var(--v-border-color), 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
}

.search-field:hover :deep(.v-field) {
  background: white;
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.12);
  transform: translateY(-1px);
}
</style>
