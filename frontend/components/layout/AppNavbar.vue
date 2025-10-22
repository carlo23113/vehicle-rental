<template>
  <v-app-bar
    elevation="0"
    height="80"
    class="px-6 backdrop-blur-xl backdrop-saturate-[180%] border-b transition-all duration-300"
    :class="[
      'bg-gradient-to-br from-surface/95 to-surface/98',
      isScrolled
        ? 'shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-primary/12 navbar-scrolled'
        : 'shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-border/8',
    ]"
  >
    <!-- Menu Toggle -->
    <div class="flex items-center">
      <v-btn
        @click="$emit('toggle-rail')"
        icon
        variant="flat"
        class="bg-primary/6 transition-all duration-300 hover:bg-primary/12 hover:rotate-90"
        size="large"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </div>

    <!-- Page Title -->
    <LazyPageTitleDisplay :title="pageTitle" />

    <v-spacer />

    <!-- Search Trigger -->
    <LazySearchTrigger @click="openSearch" />

    <!-- Action Buttons (Lazy loaded for better initial performance) -->
    <div class="flex items-center gap-2 action-buttons">
      <ClientOnly>
        <LazyDarkModeToggle />
        <LazyQuickAddMenu />
        <LazyNotificationPanel />
        <LazyUserMenu />
      </ClientOnly>
    </div>

    <!-- Search Dialog (Only loads when needed) -->
    <LazySearchDialog v-if="showSearch" v-model="showSearch" />
  </v-app-bar>
</template>

<script setup lang="ts">
import { useNavbarState } from '~/composables/useNavbarState'

defineEmits<{
  'toggle-rail': []
}>()

const { showSearch, isScrolled, pageTitle, openSearch } = useNavbarState()
</script>

<style scoped>
.navbar-scrolled::after {
  content: '';
  @apply absolute bottom-0 left-0 right-0 h-0.5 opacity-30;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgb(var(--v-theme-primary)) 50%,
    transparent 100%
  );
}

@keyframes slideIn {
  from {
    @apply opacity-0 -translate-y-2.5;
  }
  to {
    @apply opacity-100 translate-y-0;
  }
}

.action-buttons > *:nth-child(1) {
  animation: slideIn 0.4s ease-out 0.1s both;
}

.action-buttons > *:nth-child(2) {
  animation: slideIn 0.4s ease-out 0.2s both;
}

.action-buttons > *:nth-child(3) {
  animation: slideIn 0.4s ease-out 0.3s both;
}

.action-buttons > *:nth-child(4) {
  animation: slideIn 0.4s ease-out 0.4s both;
}
</style>
