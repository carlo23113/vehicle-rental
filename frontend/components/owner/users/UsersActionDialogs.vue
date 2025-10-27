<template>
  <!-- Activate User Dialog -->
  <CommonDialogDeleteConfirmation
    v-model="activateDialog"
    title="Activate User?"
    :message="`Are you sure you want to activate ${user?.firstName} ${user?.lastName}? They will regain access to the system.`"
    :loading="loading"
    confirm-text="Activate User"
    confirm-color="success"
    @confirm="$emit('activate')"
  />

  <!-- Deactivate User Dialog -->
  <CommonDialogDeleteConfirmation
    v-model="deactivateDialog"
    title="Deactivate User?"
    :message="`Are you sure you want to deactivate ${user?.firstName} ${user?.lastName}? They will lose access to the system.`"
    :loading="loading"
    confirm-text="Deactivate User"
    confirm-color="warning"
    @confirm="$emit('deactivate')"
  />

  <!-- Suspend User Dialog -->
  <CommonDialogDeleteConfirmation
    v-model="suspendDialog"
    title="Suspend User?"
    :message="`Are you sure you want to suspend ${user?.firstName} ${user?.lastName}? This is a temporary restriction of access.`"
    :loading="loading"
    confirm-text="Suspend User"
    confirm-color="error"
    @confirm="$emit('suspend')"
  />
</template>

<script setup lang="ts">
import type { User } from '~/types/user'

const activateDialog = defineModel<boolean>('activateDialog')
const deactivateDialog = defineModel<boolean>('deactivateDialog')
const suspendDialog = defineModel<boolean>('suspendDialog')

defineProps<{
  user: User | null
  loading: boolean
}>()

defineEmits<{
  activate: []
  deactivate: []
  suspend: []
}>()
</script>
