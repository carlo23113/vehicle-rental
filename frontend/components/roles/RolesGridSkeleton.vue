<template>
  <v-row>
    <v-col v-for="i in 6" :key="i" cols="12" md="6" lg="4">
      <v-skeleton-loader type="card" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
</script>
