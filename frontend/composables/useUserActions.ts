import { ref } from 'vue'
import type { User, UserRole } from '~/types/user'

interface SnackbarState {
  show: boolean
  message: string
  color: 'success' | 'error' | 'warning' | 'info'
  icon: string
}

export const useUserActions = () => {
  // Dialog states
  const editDialog = ref(false)
  const changePasswordDialog = ref(false)
  const changeRoleDialog = ref(false)
  const activateDialog = ref(false)
  const deactivateDialog = ref(false)
  const suspendDialog = ref(false)

  // Loading state
  const actionLoading = ref(false)

  // Snackbar state
  const snackbar = ref<SnackbarState>({
    show: false,
    message: '',
    color: 'success',
    icon: 'mdi-check-circle',
  })

  // Edit form data
  const editData = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
  })

  // Password form data
  const newPassword = ref('')
  const confirmPassword = ref('')

  // Role change data
  const newRole = ref<UserRole>('agent')

  // Dialog openers
  const openEditDialog = (user: User) => {
    editData.value = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      department: user.department || '',
    }
    editDialog.value = true
  }

  const openChangePasswordDialog = () => {
    newPassword.value = ''
    confirmPassword.value = ''
    changePasswordDialog.value = true
  }

  const openChangeRoleDialog = (currentRole: UserRole) => {
    newRole.value = currentRole
    changeRoleDialog.value = true
  }

  const openActivateDialog = () => {
    activateDialog.value = true
  }

  const openDeactivateDialog = () => {
    deactivateDialog.value = true
  }

  const openSuspendDialog = () => {
    suspendDialog.value = true
  }

  // Snackbar helpers
  const showSuccess = (message: string) => {
    snackbar.value = {
      show: true,
      message,
      color: 'success',
      icon: 'mdi-check-circle',
    }
  }

  const showError = (message: string) => {
    snackbar.value = {
      show: true,
      message,
      color: 'error',
      icon: 'mdi-alert-circle',
    }
  }

  const showWarning = (message: string) => {
    snackbar.value = {
      show: true,
      message,
      color: 'warning',
      icon: 'mdi-alert',
    }
  }

  const showInfo = (message: string) => {
    snackbar.value = {
      show: true,
      message,
      color: 'info',
      icon: 'mdi-information',
    }
  }

  return {
    // Dialog states
    editDialog,
    changePasswordDialog,
    changeRoleDialog,
    activateDialog,
    deactivateDialog,
    suspendDialog,

    // Loading state
    actionLoading,

    // Snackbar
    snackbar,

    // Form data
    editData,
    newPassword,
    confirmPassword,
    newRole,

    // Dialog openers
    openEditDialog,
    openChangePasswordDialog,
    openChangeRoleDialog,
    openActivateDialog,
    openDeactivateDialog,
    openSuspendDialog,

    // Snackbar helpers
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
