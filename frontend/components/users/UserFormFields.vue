<template>
  <div>
    <!-- Personal Information -->
    <CommonFormSection title="Personal Information" icon="mdi-account">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.firstName"
            label="First Name"
            placeholder="John"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.lastName"
            label="Last Name"
            placeholder="Doe"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.email"
            label="Email Address"
            placeholder="john.doe@vrms.com"
            variant="outlined"
            density="comfortable"
            type="email"
            :rules="[rules.required, rules.email]"
            prepend-inner-icon="mdi-email-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localForm.phone"
            label="Phone Number"
            placeholder="09123456789"
            variant="outlined"
            density="comfortable"
            type="tel"
            :rules="[rules.required, rules.phone]"
            prepend-inner-icon="mdi-phone-outline"
          />
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Role & Access -->
    <CommonFormSection title="Role & Access" icon="mdi-shield-account">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.role"
            :items="roleOptions"
            label="Role"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account-circle-outline"
            @update:model-value="handleRoleChange"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-icon :icon="getRoleIcon(item.value)" :color="getRoleColor(item.value)" />
                </template>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <div class="d-flex align-center">
                <v-icon :icon="getRoleIcon(item.value)" :color="getRoleColor(item.value)" size="small" class="mr-2" />
                {{ item.title }}
              </div>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.status"
            :items="statusOptions"
            label="Status"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account-check-outline"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-icon icon="mdi-circle" :color="getStatusColor(item.value)" size="small" />
                </template>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <v-chip :color="getStatusColor(item.value)" size="small">
                {{ item.title }}
              </v-chip>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </CommonFormSection>

    <!-- Additional Information -->
    <CommonFormSection title="Additional Information" icon="mdi-note-text">
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="localForm.notes"
            label="Notes (Optional)"
            placeholder="Add any special notes about this user..."
            variant="outlined"
            density="comfortable"
            rows="4"
            prepend-inner-icon="mdi-note-text-outline"
          />
        </v-col>
      </v-row>
    </CommonFormSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormValidation } from '~/composables/useFormValidation'
import { useUsers } from '~/composables/useUsers'
import { useRolesPermissions } from '~/composables/useRolesPermissions'
import type { UserRole, UserStatus } from '~/types/user'

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  roleId?: number
  status: UserStatus
  permissions: string[]
  notes: string
}

const props = defineProps<{
  modelValue: UserFormData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: UserFormData]
}>()

const { rules } = useFormValidation()
const { getRoleColor, getRoleIcon, getStatusColor } = useUsers()
const { roles } = useRolesPermissions()

const roleOptions = [
  { title: 'Administrator', value: 'admin' },
  { title: 'Manager', value: 'manager' },
  { title: 'Agent', value: 'agent' },
  { title: 'Technician', value: 'technician' },
]

const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Suspended', value: 'suspended' },
]

const localForm = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// Handle role change - auto-populate permissions based on role
const handleRoleChange = (newRole: UserRole) => {
  const roleMap: Record<UserRole, number> = {
    admin: 1,
    manager: 2,
    agent: 3,
    technician: 4,
  }

  localForm.value.roleId = roleMap[newRole]

  // Find the corresponding role and set default permissions
  const role = roles.value.find(r => r.id === roleMap[newRole])
  if (role) {
    localForm.value.permissions = [...role.permissions]
  }
}
</script>
