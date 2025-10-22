<template>
  <v-card elevation="0" class="form-card">
    <v-card-text class="p-8">
      <slot />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.form-card {
  border: 1px solid rgba(var(--v-border-color), 0.08);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}
</style>
