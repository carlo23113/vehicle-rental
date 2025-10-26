<script setup lang="ts">
import { computed } from 'vue'

interface Role {
  userCount: number
  permissions: string[]
  updatedAt: string | Date
}

const props = defineProps<{
  role: Role
}>()

const infoCards = computed(() => [
  {
    icon: 'mdi-account-multiple',
    label: 'Users Assigned',
    value: props.role.userCount,
    color: 'primary',
  },
  {
    icon: 'mdi-shield-check',
    label: 'Permissions',
    value: props.role.permissions.length,
    color: 'success',
  },
  {
    icon: 'mdi-clock-outline',
    label: 'Last Updated',
    value: new Date(props.role.updatedAt).toLocaleDateString(),
    color: 'info',
  },
])
</script>

<template>
  <v-row class="mb-5">
    <v-col v-for="card in infoCards" :key="card.label" cols="12" md="4">
      <RoleInfoCard :icon="card.icon" :label="card.label" :value="card.value" :color="card.color" />
    </v-col>
  </v-row>
</template>
