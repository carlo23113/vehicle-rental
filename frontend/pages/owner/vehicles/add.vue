<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Add New Vehicle"
      subtitle="Fill in the details to add a new vehicle to your fleet"
      show-breadcrumbs
      parent-label="Vehicles"
      parent-icon="mdi-car-multiple"
      @back="$router.push('/owner/vehicles')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <VehicleFormFields v-model="form" />
            <VehiclePhotoUpload v-model="photos" @error="showError" @warning="showWarning" />

            <CommonFormActions
              submit-text="Add Vehicle"
              submit-icon="mdi-plus"
              :loading="loading"
              @cancel="$router.push('/owner/vehicles')"
            />
          </v-form>
        </CommonFormCard>
      </v-col>
    </v-row>

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import type { VehicleFormData } from '~/components/vehicles/VehicleFormFields.vue'
import type { PhotoFile } from '~/components/vehicles/VehiclePhotoUpload.vue'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

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
  locationId: '1',
})

const photos = ref<PhotoFile[]>([])

const { snackbar, showError, showWarning } = useSnackbar()

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) {
    return
  }

  loading.value = true

  try {
    // TODO: Implement API call to save vehicle with photos
    console.log('Saving vehicle:', form.value)
    console.log(
      'Photos:',
      photos.value.map(p => p.file.name)
    )

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Clean up photo URLs
    photos.value.forEach(photo => URL.revokeObjectURL(photo.preview))

    // Navigate back to vehicles page
    router.push('/owner/vehicles')
  } catch (error) {
    console.error('Error saving vehicle:', error)
    showError('Failed to save vehicle. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
