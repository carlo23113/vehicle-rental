<template>
  <v-card class="border border-gray-200/12 rounded-[10px] h-full" elevation="0">
    <v-card-text class="pa-4">
      <div class="flex items-center gap-3">
        <v-avatar :color="color" variant="tonal" size="40">
          <v-icon size="20">{{ icon }}</v-icon>
        </v-avatar>
        <div>
          <div class="text-[0.6875rem] font-medium text-on-surface/60 uppercase tracking-wider mb-0.5">
            {{ label }}
          </div>
          <div class="text-[1.375rem] font-semibold text-on-surface/87">
            {{ value }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string | number
  color: string
}>()
</script>
