<script setup lang="ts">
interface QuickAction {
  title: string
  icon: string
  action: string
  color: string
}

defineProps<{
  actions: QuickAction[]
}>()

defineEmits<{
  'action-click': [action: string]
}>()
</script>

<template>
  <CommonUiDashboardCard class="mb-4">
    <v-card-title class="pa-6 pb-4">
      <CommonUiSectionHeader
        title="Quick Actions"
        subtitle="Shortcut to common tasks"
        icon="mdi-lightning-bolt"
      />
    </v-card-title>
    <v-card-text class="pa-6 pt-2">
      <v-row dense>
        <v-col v-for="action in actions" :key="action.title" cols="6">
          <DashboardQuickActionsQuickActionButton
            :title="action.title"
            :icon="action.icon"
            :color="action.color"
            @click="$emit('action-click', action.action)"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </CommonUiDashboardCard>
</template>
