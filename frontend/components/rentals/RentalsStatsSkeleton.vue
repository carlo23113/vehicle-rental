<template>
  <v-row class="mb-6">
    <v-col v-for="i in 4" :key="i" cols="12" sm="6" lg="3">
      <v-card>
        <v-skeleton-loader type="list-item-avatar-two-line" />
      </v-card>
    </v-col>
  </v-row>
</template>
