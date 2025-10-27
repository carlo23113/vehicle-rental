<template>
  <v-app-bar
    elevation="0"
    height="80"
    class="px-6 backdrop-blur-xl backdrop-saturate-[180%] border-b transition-all duration-300"
    :class="[
      'bg-gradient-to-br from-surface/95 to-surface/98',
      isScrolled
        ? 'shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-error/12 navbar-scrolled'
        : 'shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-border/8',
    ]"
  >
    <!-- Menu Toggle -->
    <div class="flex items-center">
      <v-btn
        @click="$emit('toggle-rail')"
        icon
        variant="flat"
        class="bg-error/6 transition-all duration-300 hover:bg-error/12 hover:rotate-90"
        size="large"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </div>

    <!-- Page Title -->
    <div class="ml-4">
      <div class="flex items-center gap-2">
        <v-icon color="error" size="small">mdi-shield-crown</v-icon>
        <h2 class="text-lg font-semibold text-error">{{ pageTitle }}</h2>
      </div>
      <p class="text-xs text-medium-emphasis">SaaS Owner Portal</p>
    </div>

    <v-spacer />

    <!-- Action Buttons -->
    <div class="flex items-center gap-2 action-buttons">
      <ClientOnly>
        <LazyDarkModeToggle />
        <LazyNotificationPanel />
        <LazyUserMenu />
      </ClientOnly>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

defineEmits<{
  'toggle-rail': []
}>()

const route = useRoute()
const isScrolled = ref(false)

const pageTitle = computed(() => {
  const path = route.path
  if (path.includes('/tenants')) return 'Tenant Management'
  if (path.includes('/analytics')) return 'System Analytics'
  if (path.includes('/billing')) return 'Billing & Subscriptions'
  if (path.includes('/settings')) return 'System Settings'
  return 'Admin Dashboard'
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar-scrolled::after {
  content: '';
  @apply absolute bottom-0 left-0 right-0 h-0.5 opacity-30;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgb(var(--v-theme-error)) 50%,
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
</style>
