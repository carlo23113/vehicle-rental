<template>
  <v-row class="mb-8">
    <v-col cols="12">
      <div class="d-flex justify-space-between align-center flex-wrap ga-4">
        <div>
          <h1 class="text-h3 font-weight-bold mb-2">
            Good {{ greeting }}, {{ userName }}! 👋
          </h1>
          <p class="text-h6 text-medium-emphasis font-weight-regular">
            Here's what's happening with your fleet today
          </p>
        </div>
        <v-btn
          color="primary"
          size="x-large"
          elevation="2"
          class="rounded-lg"
          @click="$emit('add-vehicle')"
        >
          <v-icon icon="mdi-plus" start></v-icon>
          Add Vehicle
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  greeting: string;
  userName: string;
}>();

defineEmits<{
  "add-vehicle": [];
}>();
</script>
