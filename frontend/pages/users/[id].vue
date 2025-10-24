<template>
  <CommonPageContainer>
    <!-- Header with Breadcrumbs and Actions -->
    <CommonPageDetailPageHeader
      :title="`${user.firstName} ${user.lastName}`"
      :subtitle="`${getRoleLabel(user.role)} • ${user.department || 'No Department'}`"
      :badge="user.status"
      :badge-color="getStatusColor(user.status)"
      show-breadcrumbs
      parent-label="Users"
      parent-icon="mdi-account-group"
      :actions="headerActions"
      @back="$router.push('/users')"
      @action="handleAction"
    />

    <v-row>
      <!-- Left Column: Main Info -->
      <v-col cols="12" lg="8">
        <UserInfoCard
          :email="user.email"
          :phone="user.phone"
          :role="user.role"
          :role-label="getRoleLabel(user.role)"
          :status="user.status"
          :status-color="getStatusColor(user.status)"
          :department="user.department"
          :join-date="formatDate(user.joinDate)"
          :last-login="formatDate(user.lastLogin)"
          class="mb-6"
        />

        <UserPermissionsCard
          :permissions="user.permissions"
          class="mb-6"
        />

        <CommonUiDetailCard
          v-if="user.notes"
          title="Additional Notes"
          icon="mdi-note-text"
          class="mb-6"
        >
          <p class="text-body-2">{{ user.notes }}</p>
        </CommonUiDetailCard>
      </v-col>

      <!-- Right Column: Actions and Activity -->
      <v-col cols="12" lg="4">
        <UserActionsCard
          :status="user.status"
          :role="user.role"
          class="mb-6"
          @edit="openEditDialog"
          @change-password="openChangePasswordDialog"
          @change-role="openChangeRoleDialog"
          @activate="openActivateDialog"
          @deactivate="openDeactivateDialog"
          @suspend="openSuspendDialog"
        />

        <UserActivityCard :activity="activityTimeline" />
      </v-col>
    </v-row>

    <!-- Edit User Dialog -->
    <UserEditDialog
      v-model="editDialog"
      v-model:first-name="editData.firstName"
      v-model:last-name="editData.lastName"
      v-model:email="editData.email"
      v-model:phone="editData.phone"
      v-model:department="editData.department"
      :loading="actionLoading"
      @confirm="confirmEdit"
    />

    <!-- Change Password Dialog -->
    <UserChangePasswordDialog
      v-model="changePasswordDialog"
      v-model:new-password="newPassword"
      v-model:confirm-password="confirmPassword"
      :loading="actionLoading"
      @confirm="confirmChangePassword"
    />

    <!-- Change Role Dialog -->
    <UserChangeRoleDialog
      v-model="changeRoleDialog"
      v-model:role="newRole"
      :current-role="user.role"
      :loading="actionLoading"
      @confirm="confirmChangeRole"
    />

    <!-- Activate/Deactivate/Suspend Dialogs -->
    <CommonDialogDeleteConfirmation
      v-model="activateDialog"
      title="Activate User?"
      :message="`Are you sure you want to activate ${user.firstName} ${user.lastName}? They will regain access to the system.`"
      :loading="actionLoading"
      confirm-text="Activate User"
      confirm-color="success"
      @confirm="confirmActivate"
    />

    <CommonDialogDeleteConfirmation
      v-model="deactivateDialog"
      title="Deactivate User?"
      :message="`Are you sure you want to deactivate ${user.firstName} ${user.lastName}? They will lose access to the system.`"
      :loading="actionLoading"
      confirm-text="Deactivate User"
      confirm-color="warning"
      @confirm="confirmDeactivate"
    />

    <CommonDialogDeleteConfirmation
      v-model="suspendDialog"
      title="Suspend User?"
      :message="`Are you sure you want to suspend ${user.firstName} ${user.lastName}? This is a temporary restriction of access.`"
      :loading="actionLoading"
      confirm-text="Suspend User"
      confirm-color="error"
      @confirm="confirmSuspend"
    />

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsers } from '~/composables/useUsers'
import { useUserActions } from '~/composables/useUserActions'
import type { User } from '~/types/user'

const route = useRoute()
const router = useRouter()

const {
  users,
  getStatusColor,
  getRoleLabel,
  formatDate,
} = useUsers()

const {
  editDialog,
  changePasswordDialog,
  changeRoleDialog,
  activateDialog,
  deactivateDialog,
  suspendDialog,
  actionLoading,
  snackbar,
  editData,
  newPassword,
  confirmPassword,
  newRole,
  openEditDialog,
  openChangePasswordDialog,
  openChangeRoleDialog,
  openActivateDialog,
  openDeactivateDialog,
  openSuspendDialog,
  showSuccess,
  showError,
} = useUserActions()

// Find user by ID
const userId = Number(route.params.id)
const user = computed((): User => {
  return users.value.find(u => u.id === userId) ?? users.value[0]!
})

// Activity timeline data
const activityTimeline = ref([
  {
    icon: 'mdi-login',
    color: 'success',
    title: 'Last Login',
    subtitle: formatDate(user.value.lastLogin),
  },
  {
    icon: 'mdi-account-check',
    color: 'info',
    title: 'Account Created',
    subtitle: formatDate(user.value.joinDate),
  },
])

// Header actions
const headerActions = computed(() => {
  return [
    {
      key: 'edit',
      label: 'Edit User',
      icon: 'mdi-pencil',
      variant: 'outlined' as const,
      color: 'primary',
    },
  ]
})

const handleAction = (key: string) => {
  if (key === 'edit') {
    openEditDialog(user.value)
  }
}

// Action handlers
const confirmEdit = async () => {
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update user
    const userIndex = users.value.findIndex(u => u.id === user.value.id)
    if (userIndex !== -1) {
      users.value[userIndex] = {
        ...users.value[userIndex],
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phone: editData.phone,
        department: editData.department,
      }
    }

    showSuccess('User updated successfully')
    editDialog.value = false
  } catch (error) {
    showError('Failed to update user')
  } finally {
    actionLoading.value = false
  }
}

const confirmChangePassword = async () => {
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccess('Password changed successfully')
    changePasswordDialog.value = false
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    showError('Failed to change password')
  } finally {
    actionLoading.value = false
  }
}

const confirmChangeRole = async () => {
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update user role
    const userIndex = users.value.findIndex(u => u.id === user.value.id)
    if (userIndex !== -1) {
      users.value[userIndex].role = newRole.value
    }

    showSuccess('User role changed successfully')
    changeRoleDialog.value = false
  } catch (error) {
    showError('Failed to change user role')
  } finally {
    actionLoading.value = false
  }
}

const confirmActivate = async () => {
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update user status
    const userIndex = users.value.findIndex(u => u.id === user.value.id)
    if (userIndex !== -1) {
      users.value[userIndex].status = 'active'
    }

    showSuccess('User activated successfully')
    activateDialog.value = false
  } catch (error) {
    showError('Failed to activate user')
  } finally {
    actionLoading.value = false
  }
}

const confirmDeactivate = async () => {
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update user status
    const userIndex = users.value.findIndex(u => u.id === user.value.id)
    if (userIndex !== -1) {
      users.value[userIndex].status = 'inactive'
    }

    showSuccess('User deactivated successfully')
    deactivateDialog.value = false
  } catch (error) {
    showError('Failed to deactivate user')
  } finally {
    actionLoading.value = false
  }
}

const confirmSuspend = async () => {
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update user status
    const userIndex = users.value.findIndex(u => u.id === user.value.id)
    if (userIndex !== -1) {
      users.value[userIndex].status = 'suspended'
    }

    showSuccess('User suspended successfully')
    suspendDialog.value = false
  } catch (error) {
    showError('Failed to suspend user')
  } finally {
    actionLoading.value = false
  }
}
</script>
