<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Add New Location"
      subtitle="Create a new rental office or service center location"
      show-breadcrumbs
      parent-label="Locations"
      parent-icon="mdi-map-marker"
      @back="$router.push('/locations')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <LocationFormFields v-model="form" />

            <CommonFormActions
              submit-text="Create Location"
              submit-icon="mdi-plus"
              :loading="loading"
              @cancel="$router.push('/locations')"
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
import { useLocations } from '~/composables/useLocations'
import type { LocationFormData } from '~/components/locations/LocationFormFields.vue'

const { addLocation } = useLocations()
const router = useRouter()

const formRef = ref()
const loading = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success' as 'success' | 'error',
})

const form = ref<LocationFormData>({
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  email: '',
  status: 'active',
  type: 'branch',
  operatingHours: {
    weekday: '8:00 AM - 8:00 PM',
    weekend: '9:00 AM - 6:00 PM',
  },
  capacity: 20,
  hasMaintenanceFacility: false,
})

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    addLocation(form.value)

    snackbar.value = {
      show: true,
      message: 'Location created successfully',
      color: 'success',
    }

    setTimeout(() => {
      router.push('/locations')
    }, 1000)
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Failed to create location. Please try again.',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}
</script>
