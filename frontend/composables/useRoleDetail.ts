import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Ref } from 'vue'

export const useRoleDetail = <T extends { id: number; permissions: string[] }, P extends { id: string; module: string }>(
  roleId: Ref<number>,
  role: Ref<T | undefined>,
  permissions: Ref<P[]>,
  deleteRole: (id: number) => void,
  updateRole: (id: number, data: { name: string; description: string; permissions: string[] }) => void
) => {
  const router = useRouter()

  const permissionsByModule = computed(() => {
    if (!role.value) return {}

    return role.value.permissions
      .map(permId => permissions.value.find(p => p.id === permId))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
      .reduce((acc, perm) => {
        const module = perm.module
        if (!acc[module]) acc[module] = []
        acc[module]?.push(perm)
        return acc
      }, {} as Record<string, P[]>)
  })

  const handleSaveRole = (data: { name: string; description: string; permissions: string[] }) =>
    role.value && updateRole(role.value.id, data)

  const handleDelete = () =>
    confirm('Are you sure you want to delete this role?') && (deleteRole(roleId.value), router.push('/roles'))

  const handleBack = () => router.push('/roles')

  const handleViewUser = (userId: number) => router.push(`/users?view=${userId}`)

  return {
    permissionsByModule,
    handleSaveRole,
    handleDelete,
    handleBack,
    handleViewUser
  }
}
