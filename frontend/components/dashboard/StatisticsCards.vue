<template>
  <v-row class="mb-8">
    <v-col cols="12" sm="6" lg="3" v-for="stat in stats" :key="stat.title">
      <v-card
        elevation="0"
        class="stat-card pa-6 h-100"
        :class="`stat-card-${stat.color}`"
      >
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="stat-icon-wrapper" :class="`bg-${stat.color}`">
            <v-icon :icon="stat.icon" size="28" color="white"></v-icon>
          </div>
          <v-chip
            :color="stat.trend === 'up' ? 'success' : 'error'"
            size="small"
            variant="flat"
            class="font-weight-bold"
          >
            <v-icon
              :icon="
                stat.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'
              "
              size="16"
              start
            ></v-icon>
            {{ stat.change }}
          </v-chip>
        </div>
        <div>
          <p
            class="text-caption text-medium-emphasis mb-1 text-uppercase font-weight-bold letter-spacing"
          >
            {{ stat.title }}
          </p>
          <h2 class="text-h3 font-weight-bold mb-1">{{ stat.value }}</h2>
          <p class="text-caption text-medium-emphasis">vs last month</p>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface Stat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
  color: string;
}

defineProps<{
  stats: Stat[];
}>();
</script>

<style scoped>
.stat-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgb(var(--v-theme-surface));
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.2);
}

.letter-spacing {
  letter-spacing: 0.5px;
}
</style>
