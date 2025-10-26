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
        <RentalCustomerCard
          :customer="rental.customer"
          :customer-id="rental.customerId"
          class="mb-6"
        />
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

        <!-- Documents Section -->
        <DocumentList
          :documents="rentalDocuments"
          :can-upload="true"
          :can-verify="true"
          :can-delete="true"
          class="mb-6"
          @upload="handleDocumentUpload"
          @verify="handleDocumentVerify"
          @reject="handleDocumentReject"
          @delete="handleDocumentDelete"
        />
      </v-col>

      <!-- Right Column: Pricing and Stats -->
      <v-col cols="12" lg="4">
        <RentalPricingCard
          :daily-rate="rental.dailyRate"
          :days="rental.amountOfDays"
          :rate-type="rental.rateType"
          :mileage-limit="rental.mileageLimit"
          :total="rental.totalAmount"
          :payment-status="rental.paymentStatus"
          :deposit-amount="rental.depositAmount"
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

    <!-- Generate Invoice Dialog -->
    <v-dialog v-model="showInvoiceDialog" max-width="900px" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <div class="d-flex align-center">
            <v-icon icon="mdi-file-document-outline" class="mr-2" />
            <span class="text-h6">Generate Invoice</span>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="showInvoiceDialog = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <InvoiceGenerator
            :customer="invoiceCustomerData"
            :vehicle="invoiceVehicleData"
            :rental-id="rentalId"
            @save="handleInvoiceSave"
            @cancel="showInvoiceDialog = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { printContract as printContractUtil } from '~/utils/contractPrint'
import { useRentalActions } from '~/composables/useRentalActions'
import { useRentalTimeline } from '~/composables/useRentalTimeline'
import { useDocuments } from '~/composables/useDocuments'
import { useInvoices } from '~/composables/useInvoices'
import type { DocumentType, Document } from '~/types/document'
import type { Invoice } from '~/types/invoice'

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

// Documents functionality
const {
  uploadDocument,
  verifyDocument,
  rejectDocument,
  deleteDocument: removeDocument,
  getDocumentsByRental,
} = useDocuments()

// Invoice functionality
const { createInvoice } = useInvoices()

const showContractDialog = ref(false)
const showInvoiceDialog = ref(false)
const rentalId = String(route.params.id)
const rentalDocuments = computed(() => getDocumentsByRental(rentalId))

// Mock rental data - replace with actual API call
const rental = ref({
  id: rentalId,
  status: 'reserved',
  paymentStatus: 'partial',
  depositAmount: 150,
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

// Prepare invoice data from rental
const invoiceCustomerData = computed(() => ({
  id: rental.value.customerId,
  name: rental.value.customer.name,
  email: rental.value.customer.email,
  phone: rental.value.customer.phone,
  address: '', // Add if available in rental data
}))

const invoiceVehicleData = computed(() => ({
  id: rental.value.vehicleId,
  make: rental.value.vehicle.make,
  model: rental.value.vehicle.model,
  year: rental.value.vehicle.year,
  licensePlate: rental.value.vehicle.licensePlate,
}))

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
  {
    key: 'invoice',
    label: 'Generate Invoice',
    icon: 'mdi-file-document-outline',
    variant: 'outlined' as const,
    color: 'success',
  },
]

const handleAction = (key: string) => {
  if (key === 'edit') {
    router.push(`/rentals/edit/${rental.value.id}`)
  } else if (key === 'print') {
    showContractDialog.value = true
  } else if (key === 'invoice') {
    showInvoiceDialog.value = true
  }
}

const handleInvoiceSave = async (invoiceData: Invoice) => {
  const success = await createInvoice(invoiceData)
  if (success) {
    showInvoiceDialog.value = false
    snackbar.value = {
      show: true,
      message: 'Invoice created successfully',
      color: 'success',
      icon: 'mdi-check-circle',
    }
    // Optionally navigate to the invoice page
    // router.push('/invoices')
  } else {
    snackbar.value = {
      show: true,
      message: 'Failed to create invoice',
      color: 'error',
      icon: 'mdi-alert-circle',
    }
  }
}

const printContract = () => {
  printContractUtil({ title: `Rental Contract - ${rental.value.id}` })
}

// Document handlers
const handleDocumentUpload = (type: DocumentType) => {
  console.log('Upload document type:', type)
  // This would open the DocumentUpload component in a dialog
}

const handleDocumentVerify = async (document: Document) => {
  const success = await verifyDocument(
    document.id,
    'Current User',
    'Document verified successfully'
  )
  if (success) {
    snackbar.value = {
      show: true,
      message: 'Document verified successfully',
      color: 'success',
    }
  }
}

const handleDocumentReject = async (document: Document) => {
  const reason = prompt('Please provide a reason for rejection:')
  if (reason) {
    const success = await rejectDocument(document.id, 'Current User', reason)
    if (success) {
      snackbar.value = {
        show: true,
        message: 'Document rejected',
        color: 'warning',
      }
    }
  }
}

const handleDocumentDelete = async (document: Document) => {
  if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
    const success = await removeDocument(document.id)
    if (success) {
      snackbar.value = {
        show: true,
        message: 'Document deleted successfully',
        color: 'success',
      }
    }
  }
}
</script>
