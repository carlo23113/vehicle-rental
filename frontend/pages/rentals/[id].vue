<template>
  <CommonPageContainer>
    <!-- Header with Breadcrumbs and Actions -->
    <CommonPageDetailPageHeader
      :title="`Rental #${rental.id}`"
      :subtitle="`${rental.customer.name} • ${rental.vehicle.make} ${rental.vehicle.model}`"
      :badge="rental.status"
      :badge-color="getStatusColor(rental.status)"
      show-breadcrumbs
      parent-label="Rentals"
      parent-icon="mdi-calendar-check"
      :actions="headerActions"
      @back="$router.push('/rentals')"
      @action="handleAction"
    />

    <v-row>
      <!-- Left Column: Main Info -->
      <v-col cols="12" lg="8">
        <RentalInfoCard :rental="rental" class="mb-6" />
        <RentalCustomerCard :customer="rental.customer" :customer-id="rental.customerId" class="mb-6" />
        <RentalVehicleCard :vehicle="rental.vehicle" :vehicle-id="rental.vehicleId" class="mb-6" />
        <RentalLocationCard
          :pickup-location="rental.pickupLocation"
          :pickup-time="rental.pickupTime"
          :end-date="rental.endDate"
          :return-time="rental.returnTime"
          class="mb-6"
        />
        <CommonUiDetailCard v-if="rental.notes" title="Notes" icon="mdi-note-text" class="mb-6">
          <p class="text-body-2">{{ rental.notes }}</p>
        </CommonUiDetailCard>
      </v-col>

      <!-- Right Column: Pricing and Stats -->
      <v-col cols="12" lg="4">
        <RentalPricingCard
          :daily-rate="rental.dailyRate"
          :days="rental.amountOfDays"
          :rate-type="rental.rateType"
          :mileage-limit="rental.mileageLimit"
          :total="rental.totalAmount"
          class="mb-6"
        />

        <QuickActionsCard
          :status="rental.status"
          @start="startRental(rental)"
          @complete="completeRental(rental)"
          @cancel="openCancelDialog"
        />

        <TimelineCard :timeline="timeline" />
      </v-col>
    </v-row>

    <!-- Cancel Confirmation Dialog -->
    <CommonDialogDeleteConfirmation
      v-model="cancelDialog"
      title="Cancel Rental?"
      message="Are you sure you want to cancel this rental? This action cannot be undone."
      :loading="actionLoading"
      confirm-text="Cancel Rental"
      @confirm="confirmCancel(rental)"
    />

    <!-- Print Contract Dialog -->
    <ContractDialog v-model="showContractDialog" title="Rental Contract" @print="printContract">
      <RentalContract :rental="rental" />
    </ContractDialog>

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { printContract as printContractUtil } from '~/utils/contractPrint'
import { useRentalActions } from '~/composables/useRentalActions'
import { useRentalTimeline } from '~/composables/useRentalTimeline'

const route = useRoute()
const router = useRouter()

const {
  actionLoading,
  cancelDialog,
  snackbar,
  startRental,
  completeRental,
  openCancelDialog,
  confirmCancel,
  getStatusColor,
} = useRentalActions()

const { timeline } = useRentalTimeline()

const showContractDialog = ref(false)

// Mock rental data - replace with actual API call
const rental = ref({
  id: String(route.params.id),
  status: 'active',
  startDate: '2025-01-15',
  endDate: '2025-01-16',
  amountOfDays: 1,
  rateType: 'city' as 'city' | 'province',
  dailyRate: 45,
  totalAmount: 45,
  pickupTime: '08:00',
  returnTime: '08:00',
  mileageLimit: 100,
  notes: 'Customer requested early pickup. Vehicle has been inspected and is ready.',
  customerId: 1,
  customer: {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    license: 'DL123456789',
  },
  vehicleId: 1,
  vehicle: {
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    licensePlate: 'ABC-1234',
    type: 'Sedan',
    color: 'Silver',
    mileage: 15420,
  },
  pickupLocation: {
    name: 'Downtown Main Branch',
    address: '123 Main St, Downtown',
  },
})

const headerActions = [
  {
    key: 'edit',
    label: 'Edit',
    icon: 'mdi-pencil',
    variant: 'outlined' as const,
    color: 'primary',
  },
  {
    key: 'print',
    label: 'Print Contract',
    icon: 'mdi-printer',
    variant: 'outlined' as const,
    color: 'primary',
  },
]

const handleAction = (key: string) => {
  if (key === 'edit') {
    router.push(`/rentals/edit/${rental.value.id}`)
  } else if (key === 'print') {
    showContractDialog.value = true
  }
}

const printContract = () => {
  printContractUtil({ title: `Rental Contract - ${rental.value.id}` })
}
</script>
