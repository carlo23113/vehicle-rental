import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import { useLocations } from '~/composables/useLocations'
import type { Location } from '~/composables/useLocations'

export const useLocationDetails = (locationId: string) => {
  const router = useRouter()
  const { snackbar, showSuccess, showError } = useSnackbar()
  const { locations, getStatusColor, deleteLocation } = useLocations()

  const location = ref<Location | null>(null)
  const loading = ref(true)
  const deleteDialog = ref(false)
  const actionLoading = ref(false)

  const loadLocation = async () => {
    loading.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const foundLocation = locations.value.find(l => l.id === locationId)

      if (!foundLocation) {
        showError('Location not found')
        router.push('/owner/locations')
        return
      }

      location.value = foundLocation
    } catch (error) {
      console.error('Error loading location:', error)
      showError('Failed to load location data. Please try again.')
      router.push('/owner/locations')
    } finally {
      loading.value = false
    }
  }

  const openDeleteDialog = () => {
    deleteDialog.value = true
  }

  const confirmDelete = async () => {
    if (!location.value) return

    actionLoading.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      deleteLocation(location.value.id)
      showSuccess('Location deleted successfully!')
      router.push('/owner/locations')
    } catch (error) {
      console.error('Error deleting location:', error)
      showError('Failed to delete location. Please try again.')
    } finally {
      actionLoading.value = false
      deleteDialog.value = false
    }
  }

  const handleEdit = () => {
    if (!location.value) return
    router.push(`/owner/locations/edit/${location.value.id}`)
  }

  const getFullAddress = (loc: Location) => {
    return `${loc.address}, ${loc.city}, ${loc.state} ${loc.zipCode}`
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      main: 'Main Office',
      branch: 'Branch Location',
    }
    return labels[type] || type
  }

  return {
    location,
    loading,
    deleteDialog,
    actionLoading,
    snackbar,
    loadLocation,
    openDeleteDialog,
    confirmDelete,
    handleEdit,
    getFullAddress,
    getTypeLabel,
    getStatusColor,
  }
}
