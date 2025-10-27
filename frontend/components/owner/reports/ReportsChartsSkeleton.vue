<template>
  <v-row class="mb-6">
    <v-col cols="12">
      <v-skeleton-loader type="image" height="300" />
    </v-col>
  </v-row>

  <v-row class="mb-6">
    <v-col cols="12" lg="7">
      <v-skeleton-loader type="table" />
    </v-col>
    <v-col cols="12" lg="5">
      <v-skeleton-loader type="list-item@5" />
    </v-col>
  </v-row>

  <v-row class="mb-6">
    <v-col cols="12" lg="6">
      <v-skeleton-loader type="list-item@4" />
    </v-col>
    <v-col cols="12" lg="6">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader type="card" />
        </v-col>
        <v-col cols="12">
          <v-skeleton-loader type="list-item@3" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
</script>
