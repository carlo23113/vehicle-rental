import { ref, computed } from 'vue'
import { useRolesPermissions } from '~/composables/useRolesPermissions'
import type { Role } from '~/types/role'

export const useRoleForm = () => {
  const { permissions, getPermissionsByModule, getModules } = useRolesPermissions()

  const editForm = ref({ name: '', description: '' })
  const selectedPermissions = ref<string[]>([])
  const expandedModules = ref<number[]>([])

  const permissionsByModule = computed(() => {
    const modules = getModules()
    return modules.reduce((acc, module) => {
      acc[module] = getPermissionsByModule(module)
      return acc
    }, {} as Record<string, typeof permissions.value>)
  })

  const selectedCount = computed(() => selectedPermissions.value.length)

  const toggleModule = (module: string) => {
    const modulePerms = getPermissionsByModule(module)
    const modulePermIds = modulePerms.map(p => p.id)
    const allSelected = modulePermIds.every(id => selectedPermissions.value.includes(id))

    selectedPermissions.value = allSelected
      ? selectedPermissions.value.filter(id => !modulePermIds.includes(id))
      : [...new Set([...selectedPermissions.value, ...modulePermIds])]
  }

  const selectAllPermissions = () => {
    selectedPermissions.value = permissions.value.map(p => p.id)
  }

  const clearAllPermissions = () => {
    selectedPermissions.value = []
  }

  const resetForm = (role?: Role | null) => {
    editForm.value = role
      ? { name: role.name, description: role.description }
      : { name: '', description: '' }
    selectedPermissions.value = role ? [...role.permissions] : []
    expandedModules.value = Object.keys(permissionsByModule.value).map((_, i) => i)
  }

  const getFormData = () => ({
    ...editForm.value,
    permissions: selectedPermissions.value
  })

  return {
    editForm,
    selectedPermissions,
    expandedModules,
    permissionsByModule,
    selectedCount,
    toggleModule,
    selectAllPermissions,
    clearAllPermissions,
    resetForm,
    getFormData
  }
}
