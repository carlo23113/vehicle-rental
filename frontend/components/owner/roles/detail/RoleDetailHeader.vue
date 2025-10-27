<script setup lang="ts">
interface Role {
  name: string
  description: string
  isSystem: boolean
}

defineProps<{
  role: Role
}>()

defineEmits<{
  edit: []
  delete: []
}>()
</script>

<template>
  <div class="relative mb-5">
    <div class="flex items-center mb-4">
      <div class="flex-grow">
        <div class="flex items-center gap-2 mb-1">
          <h1 class="text-2xl font-semibold text-on-surface/87 mb-0">{{ role.name }}</h1>
          <v-chip
            v-if="role.isSystem"
            size="small"
            color="primary"
            variant="tonal"
            class="h-5 text-[0.6875rem]"
          >
            System
          </v-chip>
        </div>
        <p class="text-[0.8125rem] text-on-surface/60 mt-0.5 mb-0">{{ role.description }}</p>
      </div>
      <div class="flex gap-2">
        <v-btn
          variant="outlined"
          size="default"
          prepend-icon="mdi-pencil"
          class="normal-case font-medium"
          @click="$emit('edit')"
        >
          Edit
        </v-btn>
        <v-btn
          v-if="!role.isSystem"
          variant="text"
          color="error"
          size="default"
          prepend-icon="mdi-delete"
          class="normal-case font-medium"
          @click="$emit('delete')"
        >
          Delete
        </v-btn>
      </div>
    </div>
  </div>
</template>
