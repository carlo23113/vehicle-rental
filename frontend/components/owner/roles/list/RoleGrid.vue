<template>
  <v-row>
    <v-col v-for="role in roles" :key="role.id" cols="12" md="6" lg="4">
      <RoleCard
        :role="role"
        @view="$emit('view', role)"
        @edit="$emit('edit', role)"
        @duplicate="$emit('duplicate', role)"
        @delete="$emit('delete', role)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Role } from '~/types/role'

defineProps<{
  roles: Role[]
}>()

defineEmits<{
  view: [role: Role]
  edit: [role: Role]
  duplicate: [role: Role]
  delete: [role: Role]
}>()
</script>
