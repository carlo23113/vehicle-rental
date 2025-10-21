<template>
  <v-app>
    <!-- Lazy-loaded Sidebar -->
    <LazyLayoutAppSidebar :rail="rail" />

    <!-- Lazy-loaded Navbar -->
    <LazyLayoutAppNavbar @toggle-rail="rail = !rail" />

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
