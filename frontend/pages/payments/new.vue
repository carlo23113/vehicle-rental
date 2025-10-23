<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageDetailPageHeader
      title="Record Payment"
      subtitle="Create a new payment record"
      show-breadcrumbs
      parent-label="Payments"
      parent-icon="mdi-credit-card-multiple"
      @back="$router.push('/payments')"
    />

    <!-- Payment Form -->
    <v-row>
      <v-col cols="12" lg="8">
        <PaymentForm
          v-model="formData"
          :loading="loading"
          :rentals="availableRentals"
          @submit="handleSubmit"
          @cancel="$router.push('/payments')"
        />
      </v-col>

      <!-- Summary Sidebar -->
      <v-col cols="12" lg="4">
        <!-- Rental Details Card -->
        <CommonUiDetailCard
          v-if="selectedRental"
          title="Rental Details"
          icon="mdi-car-info"
          class="mb-6"
        >
          <CommonUiDetailItem
            label="Rental ID"
            icon="mdi-identifier"
            :value="`#${selectedRental.id}`"
          />

          <CommonUiDetailItem
            label="Vehicle"
            icon="mdi-car"
            :value="selectedRental.vehicleName"
          />

          <CommonUiDetailItem
            label="Customer"
            icon="mdi-account"
            :value="selectedRental.customerName"
          />

          <CommonUiDetailItem
            label="Rental Period"
            icon="mdi-calendar-range"
            :value="`${formatDate(selectedRental.startDate)} - ${formatDate(selectedRental.endDate)}`"
          />

          <v-divider class="my-4" />

          <CommonUiDetailItem
            label="Total Rental Amount"
            icon="mdi-currency-usd"
          >
            <span class="text-h6 text-success font-weight-bold">
              {{ formatCurrency(selectedRental.totalAmount) }}
            </span>
          </CommonUiDetailItem>

          <CommonUiDetailItem
            v-if="selectedRental.paidAmount"
            label="Amount Paid"
            icon="mdi-check-circle"
          >
            <span class="text-body-1 font-weight-medium">
              {{ formatCurrency(selectedRental.paidAmount) }}
            </span>
          </CommonUiDetailItem>

          <CommonUiDetailItem
            v-if="selectedRental.paidAmount"
            label="Balance Due"
            icon="mdi-alert-circle"
          >
            <span class="text-h6 text-warning font-weight-bold">
              {{ formatCurrency(selectedRental.totalAmount - selectedRental.paidAmount) }}
            </span>
          </CommonUiDetailItem>
        </CommonUiDetailCard>

        <!-- Payment Summary Card -->
        <CommonUiDetailCard title="Payment Summary" icon="mdi-receipt-text">
          <CommonUiDetailItem label="Payment Amount" icon="mdi-currency-usd">
            <span class="text-h6 text-primary font-weight-bold">
              {{ formatCurrency(formData.amount || 0) }}
            </span>
          </CommonUiDetailItem>

          <CommonUiDetailItem
            v-if="formData.paymentMethod"
            label="Method"
            icon="mdi-credit-card"
            :value="getMethodLabel(formData.paymentMethod)"
          />

          <CommonUiDetailItem
            v-if="formData.status"
            label="Status"
            icon="mdi-information"
          >
            <v-chip
              :color="getStatusColor(formData.status)"
              size="small"
              label
            >
              {{ formData.status }}
            </v-chip>
          </CommonUiDetailItem>

          <CommonUiDetailItem
            v-if="formData.paymentDate"
            label="Payment Date"
            icon="mdi-calendar"
            :value="formatDate(formData.paymentDate)"
          />

          <v-divider class="my-4" />

          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            icon="mdi-information"
          >
            Review all payment details before submitting.
          </v-alert>
        </CommonUiDetailCard>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePayments } from '~/composables/usePayments'
import type { PaymentMethod, PaymentStatus } from '~/types/payment'

const router = useRouter()

const {
  formatCurrency,
  formatDate,
  getMethodLabel,
  getStatusColor,
} = usePayments()

interface PaymentFormData {
  rentalId: number | null
  amount: number
  paymentMethod: PaymentMethod | ''
  status: PaymentStatus | ''
  paymentDate: string
  transactionId: string
  description: string
  notes: string
}

const formData = ref<PaymentFormData>({
  rentalId: null,
  amount: 0,
  paymentMethod: '',
  status: '',
  paymentDate: new Date().toISOString().split('T')[0],
  transactionId: '',
  description: '',
  notes: '',
})

const loading = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  icon: 'mdi-check-circle',
})

// Mock available rentals (should come from API)
const availableRentals = ref([
  {
    id: 1,
    customerName: 'John Smith',
    vehicleName: 'Toyota Camry',
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    totalAmount: 450.00,
    paidAmount: 200.00,
  },
  {
    id: 2,
    customerName: 'Sarah Johnson',
    vehicleName: 'Honda Civic',
    startDate: '2025-01-18',
    endDate: '2025-01-22',
    totalAmount: 380.00,
    paidAmount: 0,
  },
  {
    id: 3,
    customerName: 'Mike Wilson',
    vehicleName: 'Tesla Model 3',
    startDate: '2025-01-20',
    endDate: '2025-01-25',
    totalAmount: 600.00,
    paidAmount: 300.00,
  },
])

const selectedRental = computed(() => {
  if (!formData.value.rentalId) return null
  return availableRentals.value.find(r => r.id === formData.value.rentalId)
})

const handleSubmit = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    snackbar.value = {
      show: true,
      message: 'Payment recorded successfully',
      color: 'success',
      icon: 'mdi-check-circle',
    }

    // Redirect after success
    setTimeout(() => {
      router.push('/payments')
    }, 1000)
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Failed to record payment',
      color: 'error',
      icon: 'mdi-alert-circle',
    }
  } finally {
    loading.value = false
  }
}
</script>
