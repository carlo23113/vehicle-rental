<template>
  <CommonPageContainer>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <template v-else-if="customer">
      <!-- Header with Breadcrumbs and Actions -->
      <CommonPageDetailPageHeader
        :title="getFullName(customer)"
        :subtitle="`Customer ID: #${customer.id} • ${customer.email}`"
        :badge="customer.status"
        :badge-color="getStatusColor(customer.status)"
        show-breadcrumbs
        parent-label="Customers"
        parent-icon="mdi-account-group"
        :actions="headerActions"
        @back="$router.push('/owner/customers')"
        @action="handleAction"
      />

      <v-row>
        <!-- Left Column: Main Info -->
        <v-col cols="12" lg="8">
          <!-- Profile Avatar Section -->
          <CommonUiDetailCard class="mb-6">
            <div class="flex items-center gap-6">
              <v-avatar color="primary" size="80" class="customer-avatar">
                <span class="text-h4 font-bold">
                  {{ getInitials(customer) }}
                </span>
              </v-avatar>
              <div class="flex-1">
                <h2 class="text-h5 font-bold mb-1">{{ getFullName(customer) }}</h2>
                <p class="text-body-2 text-medium-emphasis mb-2">{{ customer.email }}</p>
                <div class="flex items-center gap-2">
                  <v-chip :color="getStatusColor(customer.status)" size="small" variant="tonal">
                    {{ customer.status.toUpperCase() }}
                  </v-chip>
                  <v-chip size="small" variant="tonal" color="info">
                    {{ customer.totalRentals }} Rentals
                  </v-chip>
                </div>
              </div>
            </div>
          </CommonUiDetailCard>

          <CustomerInfoCard
            :customer="customer"
            :age="getAge(customer.dateOfBirth)"
            :full-name="getFullName(customer)"
            :format-date="formatDate"
            class="mb-6"
          />

          <CustomerAddressCard :customer="customer" class="mb-6" />

          <CustomerLicenseCard
            :customer="customer"
            :format-date="formatDate"
            :is-expired="isLicenseExpired(customer.licenseExpiry)"
            :is-expiring-soon="isLicenseExpiringSoon(customer.licenseExpiry)"
            class="mb-6"
          />

          <CommonUiDetailCard v-if="customer.notes" title="Notes" icon="mdi-note-text" class="mb-6">
            <p class="text-body-2">{{ customer.notes }}</p>
          </CommonUiDetailCard>

          <CustomerRentalsHistoryCard
            :rentals="customerRentals"
            :customer-id="customer.id"
            :format-date="formatDate"
            class="mb-6"
          />

          <!-- Documents Section -->
          <DocumentList
            :documents="customerDocuments"
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

        <!-- Right Column: Stats -->
        <v-col cols="12" lg="4">
          <CustomerStatsCard :customer="customer" class="mb-6" />

          <!-- Quick Actions -->
          <CommonUiDetailCard title="Quick Actions" icon="mdi-lightning-bolt" class="mb-6">
            <div class="flex flex-col gap-2">
              <v-btn
                variant="tonal"
                color="primary"
                block
                prepend-icon="mdi-car-plus"
                @click="createRental"
              >
                Create Rental
              </v-btn>
              <v-btn variant="tonal" color="info" block prepend-icon="mdi-email" @click="sendEmail">
                Send Email
              </v-btn>
              <v-btn
                variant="tonal"
                color="warning"
                block
                prepend-icon="mdi-phone"
                @click="callCustomer"
              >
                Call Customer
              </v-btn>
            </div>
          </CommonUiDetailCard>
        </v-col>
      </v-row>

      <!-- Delete Confirmation Dialog -->
      <CommonDialogDeleteConfirmation
        v-model="deleteDialog"
        title="Delete Customer?"
        :message="`Are you sure you want to delete ${getFullName(customer)}? This action cannot be undone.`"
        :loading="actionLoading"
        confirm-text="Delete Customer"
        @confirm="confirmDelete"
      />

      <!-- Snackbar -->
      <CommonUiSnackbar v-model="snackbar" />
    </template>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerDetails } from '~/composables/useCustomerDetails'
import { useDocuments } from '~/composables/useDocuments'
import type { DocumentType, Document } from '~/types/document'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const customerId = String(route.params.id)

const {
  customer,
  customerRentals,
  loading,
  deleteDialog,
  actionLoading,
  snackbar,
  loadCustomer,
  openDeleteDialog,
  confirmDelete,
  handleEdit,
  getAge,
  getInitials,
  getStatusColor,
  getFullName,
  formatDate,
  isLicenseExpired,
  isLicenseExpiringSoon,
} = useCustomerDetails(customerId)

// Documents functionality
const {
  uploadDocument,
  verifyDocument,
  rejectDocument,
  deleteDocument: removeDocument,
  getDocumentsByCustomer,
} = useDocuments()

const customerDocuments = computed(() => getDocumentsByCustomer(customerId))
const showDocumentUploadDialog = ref(false)
const selectedDocumentType = ref<DocumentType | null>(null)

const headerActions = [
  {
    key: 'edit',
    label: 'Edit',
    icon: 'mdi-pencil',
    variant: 'outlined' as const,
    color: 'primary',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: 'mdi-delete',
    variant: 'outlined' as const,
    color: 'error',
  },
]

const handleAction = (key: string) => {
  if (key === 'edit') {
    handleEdit()
  } else if (key === 'delete') {
    openDeleteDialog()
  }
}

const createRental = () => {
  router.push(`/owner/rentals/add?customerId=${customer.value?.id}`)
}

const sendEmail = () => {
  if (customer.value) {
    window.location.href = `mailto:${customer.value.email}`
  }
}

const callCustomer = () => {
  if (customer.value) {
    window.location.href = `tel:${customer.value.phone}`
  }
}

// Document handlers
const handleDocumentUpload = (type: DocumentType) => {
  selectedDocumentType.value = type
  showDocumentUploadDialog.value = true
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

onMounted(() => {
  loadCustomer()
})
</script>

<style lang="scss" scoped>
.customer-avatar {
  @apply shadow-lg;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.9),
    rgba(var(--v-theme-secondary), 0.8)
  );
}
</style>
