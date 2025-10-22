<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Create New Rental"
      subtitle="Fill in the details to create a new rental booking"
      show-breadcrumbs
      parent-label="Rentals"
      parent-icon="mdi-calendar-check"
      @back="$router.push('/rentals')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <RentalFormFields v-model="form" />

            <CommonFormActions
              submit-text="Create Rental"
              submit-icon="mdi-plus"
              :loading="loading"
              @cancel="$router.push('/rentals')"
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
import { useRentalCalculations } from '~/composables/useRentalCalculations'
import type { RentalFormData } from '~/components/rentals/RentalFormFields.vue'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const { getTodayDate, getFutureDate } = useRentalCalculations()

const form = ref<RentalFormData>({
  customerId: null,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerLicense: '',
  vehicleId: null,
  startDate: getTodayDate(),
  endDate: getFutureDate(1), // 1 day = 24 hours, so end date is tomorrow
  amountOfDays: 1,
  pickupLocation: '',
  pickupTime: '08:00',
  returnTime: '08:00', // Same time as pickup (24-hour period)
  rateType: 'city',
  status: 'reserved',
  mileageLimit: null,
  notes: ''
})

const { snackbar, showSuccess, showError } = useSnackbar()

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) {
    showError('Please fill in all required fields correctly')
    return
  }

  loading.value = true

  try {
    // TODO: Implement API call to save rental
    console.log('Creating rental:', form.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    showSuccess('Rental created successfully!')

    // Navigate back to rentals page
    router.push('/rentals')
  } catch (error) {
    console.error('Error creating rental:', error)
    showError('Failed to create rental. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
