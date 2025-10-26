<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      v-if="!loading && vehicle"
      :title="`Edit ${vehicle.make} ${vehicle.model}`"
      :subtitle="`${vehicle.year} • ${vehicle.licensePlate}`"
      show-breadcrumbs
      parent-label="Vehicles"
      parent-icon="mdi-car-multiple"
      @back="$router.push('/owner/vehicles')"
    />

    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="text-medium-emphasis mt-4">Loading vehicle details...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="!vehicle">
      <v-col cols="12">
        <v-alert type="error" variant="tonal" class="mb-4">
          <div class="d-flex align-center">
            <v-icon icon="mdi-alert-circle" start />
            <div>
              <div class="font-weight-bold">Vehicle Not Found</div>
              <div class="text-body-2">The vehicle you're trying to edit could not be found.</div>
            </div>
          </div>
          <v-btn variant="text" class="mt-4" @click="$router.push('/owner/vehicles')">
            Back to Vehicles
          </v-btn>
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <VehicleFormFields v-model="form" />
            <VehiclePhotoUpload
              v-model="photos"
              :existing-photos="vehicle.photos"
              @error="showError"
              @warning="showWarning"
            />

            <CommonFormActions
              submit-text="Update Vehicle"
              submit-icon="mdi-content-save"
              :loading="saving"
              @cancel="handleCancel"
            />
          </v-form>
        </CommonFormCard>
      </v-col>
    </v-row>

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import type { VehicleFormData } from '~/components/vehicles/VehicleFormFields.vue'
import type { PhotoFile } from '~/components/vehicles/VehiclePhotoUpload.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(true)
const saving = ref(false)

const vehicle = ref<any>(null)

const form = ref<VehicleFormData>({
  make: '',
  model: '',
  year: null,
  licensePlate: '',
  vin: '',
  type: '',
  status: 'available',
  color: '',
  dailyRate: null,
  rates: {
    cityRate: null,
    provinceRate: null,
  },
  mileage: null,
  locationId: '',
})

const photos = ref<PhotoFile[]>([])

const { snackbar, showError, showWarning, showSuccess } = useSnackbar()

// Load vehicle data
const loadVehicle = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await $fetch(`/api/vehicles/${route.params.id}`)
    // vehicle.value = response

    // Mock data for now
    await new Promise(resolve => setTimeout(resolve, 500))

    vehicle.value = {
      id: route.params.id,
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      licensePlate: 'ABC-1234',
      vin: '1HGBH41JXMN109186',
      type: 'sedan',
      status: 'available',
      color: 'Silver',
      dailyRate: 89,
      rates: {
        cityRate: 45,
        provinceRate: 65,
      },
      mileage: 15420,
      locationId: '1', // Downtown Main Branch
      photos: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      ]
    }

    // Populate form with vehicle data
    form.value = {
      make: vehicle.value.make,
      model: vehicle.value.model,
      year: vehicle.value.year,
      licensePlate: vehicle.value.licensePlate,
      vin: vehicle.value.vin,
      type: vehicle.value.type,
      status: vehicle.value.status,
      color: vehicle.value.color,
      dailyRate: vehicle.value.dailyRate,
      rates: {
        cityRate: vehicle.value.rates.cityRate,
        provinceRate: vehicle.value.rates.provinceRate,
      },
      mileage: vehicle.value.mileage,
      locationId: vehicle.value.locationId,
    }
  } catch (error) {
    console.error('Error loading vehicle:', error)
    showError('Failed to load vehicle details.')
    vehicle.value = null
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) {
    return
  }

  saving.value = true

  try {
    // TODO: Implement API call to update vehicle with photos
    console.log('Updating vehicle:', form.value)
    console.log('New photos:', photos.value.map(p => p.file.name))
    console.log('Existing photos:', vehicle.value.photos)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Clean up photo URLs
    photos.value.forEach(photo => URL.revokeObjectURL(photo.preview))

    showSuccess('Vehicle updated successfully!')

    // Navigate to vehicle detail page
    setTimeout(() => {
      router.push(`/owner/vehicles/${route.params.id}`)
    }, 500)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    showError('Failed to update vehicle. Please try again.')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  // Ask for confirmation if form has changes
  const hasChanges =
    form.value.make !== vehicle.value?.make ||
    form.value.model !== vehicle.value?.model ||
    form.value.year !== vehicle.value?.year ||
    form.value.licensePlate !== vehicle.value?.licensePlate ||
    form.value.vin !== vehicle.value?.vin ||
    form.value.type !== vehicle.value?.type ||
    form.value.status !== vehicle.value?.status ||
    form.value.color !== vehicle.value?.color ||
    form.value.dailyRate !== vehicle.value?.dailyRate ||
    form.value.mileage !== vehicle.value?.mileage ||
    photos.value.length > 0

  if (hasChanges && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
    return
  }

  // Clean up photo URLs
  photos.value.forEach(photo => URL.revokeObjectURL(photo.preview))

  router.push(`/owner/vehicles/${route.params.id}`)
}

onMounted(() => {
  loadVehicle()
})
</script>
