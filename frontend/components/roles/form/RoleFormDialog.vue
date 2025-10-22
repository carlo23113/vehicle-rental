<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoleForm } from '~/composables/useRoleForm'
import type { Role } from '~/types/role'

const props = defineProps<{
  modelValue: boolean
  role?: Role | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [data: { name: string; description: string; permissions: string[] }]
}>()

const showDialog = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const {
  editForm,
  selectedPermissions,
  expandedModules,
  permissionsByModule,
  selectedCount,
  toggleModule,
  selectAllPermissions,
  clearAllPermissions,
  resetForm,
  getFormData,
} = useRoleForm()

const dialogTitle = computed(() => (props.role ? 'Edit Role' : 'Create New Role'))
const saveButtonText = computed(() => (props.role ? 'Save Changes' : 'Create Role'))

const handleSave = () => {
  emit('save', getFormData())
  showDialog.value = false
}

watch(() => props.role, resetForm, { immediate: true })
</script>

<template>
  <v-dialog v-model="showDialog" max-width="900" scrollable>
    <v-card class="rounded-2xl overflow-hidden border border-gray-200/12" elevation="0">
      <CommonDialogHeader @close="showDialog = false">
        {{ dialogTitle }}
      </CommonDialogHeader>

      <v-divider />

      <v-card-text class="px-7 py-6">
        <BasicInfoSection v-model:name="editForm.name" v-model:description="editForm.description" />

        <PermissionsSection
          :permissions-by-module="permissionsByModule"
          v-model:selected-permissions="selectedPermissions"
          v-model:expanded-modules="expandedModules"
          :selected-count="selectedCount"
          @select-all="selectAllPermissions"
          @clear-all="clearAllPermissions"
          @toggle-module="toggleModule"
        />
      </v-card-text>

      <v-divider />

      <CommonDialogActions
        :confirm-text="saveButtonText"
        @cancel="showDialog = false"
        @confirm="handleSave"
      />
    </v-card>
  </v-dialog>
</template>
