<template>
  <v-row>
    <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4" lg="3">
      <v-skeleton-loader type="card" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
</script>
