import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import { useUsers } from '~/composables/useUsers'
import type { UserFormData } from '~/components/users/UserFormFields.vue'

export const useUserForm = (isEditMode = false) => {
  const router = useRouter()
  const formRef = ref()
  const loading = ref(false)
  const { snackbar, showSuccess, showError } = useSnackbar()
  const { users, addUser, updateUser } = useUsers()

  const getDefaultFormData = (): UserFormData => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'agent',
    roleId: 3,
    status: 'active',
    permissions: [],
    notes: ''
  })

  const form = ref<UserFormData>(getDefaultFormData())

  const validateForm = async () => {
    const { valid } = await formRef.value.validate()
    if (!valid) {
      showError('Please fill in all required fields correctly')
      return false
    }
    return true
  }

  const handleCreate = async () => {
    if (!await validateForm()) return

    loading.value = true

    try {
      // TODO: Implement API call to save user
      console.log('Creating user:', form.value)

      // Add user to store
      addUser({
        ...form.value,
        lastLogin: new Date().toISOString().split('T')[0]
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccess('User created successfully!')
      router.push('/owner/users')
    } catch (error) {
      console.error('Error creating user:', error)
      showError('Failed to create user. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const handleUpdate = async (id: string) => {
    if (!await validateForm()) return

    loading.value = true

    try {
      // TODO: Implement API call to update user
      console.log('Updating user:', id, form.value)

      // Update user in store
      updateUser(Number(id), form.value)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccess('User updated successfully!')
      router.push(`/owner/users/${id}`)
    } catch (error) {
      console.error('Error updating user:', error)
      showError('Failed to update user. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const loadUserData = async (id: string) => {
    loading.value = true

    try {
      // TODO: Implement API call to load user
      console.log('Loading user:', id)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Load user from store
      const user = users.value.find(u => u.id === Number(id))

      if (!user) {
        showError('User not found')
        router.push('/owner/users')
        return
      }

      // Populate form with user data
      form.value = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        roleId: user.roleId,
        status: user.status,
        permissions: user.permissions,
        notes: user.notes || ''
      }
    } catch (error) {
      console.error('Error loading user:', error)
      showError('Failed to load user data. Please try again.')
      router.push('/owner/users')
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    formRef,
    loading,
    snackbar,
    handleCreate,
    handleUpdate,
    loadUserData,
    getDefaultFormData
  }
}
