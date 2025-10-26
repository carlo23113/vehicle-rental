<template>
  <CommonDialogDeleteConfirmation
    v-model="modelValue"
    :title="`Delete Role: ${role?.name}`"
    :loading="loading"
    @confirm="handleConfirm"
  >
    <template #content>
      <p class="text-body-1 mb-4">
        Are you sure you want to delete this role? This action cannot be undone.
      </p>
      <v-alert v-if="role?.isSystem" type="warning" variant="tonal" class="mb-4">
        <strong>Warning:</strong> This is a system role. Deleting it may affect core functionality.
      </v-alert>
      <div v-if="role" class="pa-4 bg-grey-lighten-4 rounded">
        <div class="d-flex align-center mb-2">
          <v-icon size="small" color="primary" class="mr-2">mdi-shield-account</v-icon>
          <strong>{{ role.name }}</strong>
        </div>
        <p class="text-body-2 text-grey-darken-1 mb-0">{{ role.description }}</p>
      </div>
    </template>
  </CommonDialogDeleteConfirmation>
</template>

<script setup lang="ts">
import type { Role } from '~/types/role'

const modelValue = defineModel<boolean>({ required: true })

const props = defineProps<{
  role: Role | null
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: [role: Role]
}>()

const handleConfirm = () => {
  if (props.role) {
    emit('confirm', props.role)
  }
}
</script>
