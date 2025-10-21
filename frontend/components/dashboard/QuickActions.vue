<template>
  <v-card elevation="0" class="modern-card mb-4">
    <v-card-title class="pa-6">
      <h3 class="text-h6 font-weight-bold">Quick Actions</h3>
    </v-card-title>
    <v-card-text class="pa-6">
      <v-row dense>
        <v-col cols="6" v-for="action in actions" :key="action.title">
          <v-btn
            block
            size="large"
            variant="flat"
            :color="action.color"
            @click="$emit('action-click', action.action)"
            class="quick-action-btn"
            height="80"
          >
            <div class="d-flex flex-column align-center ga-2">
              <v-icon :icon="action.icon" size="28"></v-icon>
              <span class="text-caption font-weight-bold">{{
                action.title
              }}</span>
            </div>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface QuickAction {
  title: string;
  icon: string;
  action: string;
  color: string;
}

defineProps<{
  actions: QuickAction[];
}>();

defineEmits<{
  "action-click": [action: string];
}>();
</script>

<style scoped>
.modern-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.quick-action-btn {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
  letter-spacing: normal;
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.2);
}
</style>
