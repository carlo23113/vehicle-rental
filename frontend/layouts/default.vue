<template>
  <v-app>
    <ClientOnly>
      <!-- Lazy-loaded Sidebar -->
      <LazyAppSidebar :rail="rail" />
    </ClientOnly>

    <!-- Lazy-loaded Navbar -->
    <LazyAppNavbar @toggle-rail="rail = !rail" />

    <!-- Main Content -->
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rail = ref(false)
</script>
