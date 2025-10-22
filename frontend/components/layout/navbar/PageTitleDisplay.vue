<template>
  <div class="ml-4 flex flex-col gap-0.5">
    <h1 class="page-title text-2xl sm:text-xl font-bold tracking-tight leading-tight">
      {{ title }}
    </h1>
    <div class="h-0.5 w-10 rounded-sm mt-1 title-gradient"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.page-title {
  background: linear-gradient(135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-gradient {
  background: linear-gradient(90deg,
    rgb(var(--v-theme-primary)) 0%,
    transparent 100%);
  animation: expand 0.6s ease-out;
}

@keyframes expand {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 2.5rem;
    opacity: 1;
  }
}
</style>
