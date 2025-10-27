<template>
  <v-app>
    <ClientOnly>
      <!-- Admin Sidebar -->
      <LazyAdminSidebar :rail="rail" />
    </ClientOnly>

    <!-- Admin Navbar -->
    <LazyAdminNavbar @toggle-rail="rail = !rail" />

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rail = ref(false)
</script>
