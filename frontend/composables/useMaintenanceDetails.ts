import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import { useMaintenance } from '~/composables/useMaintenance'

export const useMaintenanceDetails = (maintenanceId: string) => {
  const router = useRouter()
  const { snackbar, showSuccess, showError } = useSnackbar()
  const {
    maintenanceRecords,
    getStatusColor,
    getPriorityColor,
    getTypeLabel,
    formatDate,
    completeMaintenanceRecord,
    deleteMaintenanceRecord
  } = useMaintenance()

  const maintenance = ref<any>(null)
  const loading = ref(true)
  const showDeleteDialog = ref(false)
  const deleting = ref(false)

  const loadMaintenance = async () => {
    loading.value = true

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const foundMaintenance = maintenanceRecords.value.find(m => m.id === Number(maintenanceId))

      if (!foundMaintenance) {
        showError('Maintenance record not found')
        router.push('/maintenance')
        return
      }

      maintenance.value = foundMaintenance
    } catch (error) {
      console.error('Error loading maintenance:', error)
      showError('Failed to load maintenance details')
      router.push('/maintenance')
    } finally {
      loading.value = false
    }
  }

  const handleEdit = () => {
    router.push(`/maintenance/edit/${maintenanceId}`)
  }

  const showCompleteDialog = ref(false)
  const completing = ref(false)

  const openCompleteDialog = () => {
    showCompleteDialog.value = true
  }

  const cancelComplete = () => {
    showCompleteDialog.value = false
  }

  const handleComplete = async () => {
    if (!maintenance.value) return

    completing.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      completeMaintenanceRecord(Number(maintenanceId))
      showSuccess('Maintenance marked as completed')
      await loadMaintenance()

      showCompleteDialog.value = false
    } catch (error) {
      console.error('Error completing maintenance:', error)
      showError('Failed to complete maintenance')
    } finally {
      completing.value = false
    }
  }

  const openDeleteDialog = () => {
    showDeleteDialog.value = true
  }

  const handleDelete = async () => {
    if (!maintenance.value) return

    deleting.value = true

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      deleteMaintenanceRecord(Number(maintenanceId))
      showSuccess('Maintenance record deleted successfully')
      router.push('/maintenance')
    } catch (error) {
      console.error('Error deleting maintenance:', error)
      showError('Failed to delete maintenance record')
    } finally {
      deleting.value = false
      showDeleteDialog.value = false
    }
  }

  const cancelDelete = () => {
    showDeleteDialog.value = false
  }

  return {
    maintenance,
    loading,
    snackbar,
    showCompleteDialog,
    completing,
    openCompleteDialog,
    cancelComplete,
    showDeleteDialog,
    deleting,
    loadMaintenance,
    handleEdit,
    handleComplete,
    openDeleteDialog,
    handleDelete,
    cancelDelete,
    getStatusColor,
    getPriorityColor,
    getTypeLabel,
    formatDate
  }
}
