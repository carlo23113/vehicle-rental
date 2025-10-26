<template>
  <v-row class="mb-6">
    <v-col v-for="i in 4" :key="i" cols="6" lg="3">
      <v-skeleton-loader type="card" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
</script>
