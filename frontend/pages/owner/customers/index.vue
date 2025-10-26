<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Customers"
      subtitle="Manage customer profiles and information"
      action-text="Add Customer"
      action-icon="mdi-plus"
      @action-click="$router.push('/owner/customers/add')"
    />

    <!-- Filters -->
    <CommonFilterSection v-model="showFilters" :filters="filters" @clear="clearFilters">
      <v-row dense>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="filters.search"
            variant="outlined"
            density="comfortable"
            placeholder="Search by name, email, phone, or license..."
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="filters.status"
            :items="statusOptions"
            variant="outlined"
            density="comfortable"
            label="Status"
            prepend-inner-icon="mdi-account-check"
            clearable
          />
        </v-col>
      </v-row>
    </CommonFilterSection>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" lg="3">
        <CommonUiStatCard v-bind="stat" />
      </v-col>
    </v-row>

    <!-- Customers Table -->
    <v-row>
      <v-col cols="12">
        <CustomersTable
          :customers="filteredCustomers"
          :get-status-color="getStatusColor"
          :get-full-name="getFullName"
          :get-initials="getInitials"
          :format-date="formatDate"
          @view="viewCustomer"
          @edit="editCustomer"
          @delete="confirmDelete"
        />
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <CommonDialogDeleteConfirmation
      v-model="showDeleteDialog"
      title="Delete Customer?"
      :item-name="customerToDelete ? getFullName(customerToDelete) : ''"
      :item-details="customerToDelete ? `${customerToDelete.email} · ${customerToDelete.phone}` : ''"
      icon="mdi-account-outline"
      message="This action is permanent and cannot be undone. All customer data and history will be removed."
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="handleCancelDelete"
    />

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomers } from '~/composables/useCustomers'
import { useCurrency } from '~/composables/useCurrency'
import { useSnackbar } from '~/composables/useSnackbar'

const router = useRouter()
const { formatCurrency, getCurrencyIcon } = useCurrency()
const { snackbar, showSuccess, showError } = useSnackbar()

const {
  customers,
  filters,
  filteredCustomers,
  deleteCustomer,
  getStatusColor,
  getFullName,
  getInitials,
  formatDate,
} = useCustomers()

// Filter state
const showFilters = ref(false)

const showDeleteDialog = ref(false)
const customerToDelete = ref<any>(null)
const deleting = ref(false)

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Blocked', value: 'blocked' },
]

// Optimized stats - compute once instead of filtering multiple times
const stats = computed(() => {
  const activeCount = customers.value.filter(c => c.status === 'active').length
  const inactiveCount = customers.value.filter(c => c.status === 'inactive').length
  const totalRevenue = customers.value.reduce((sum, c) => sum + c.totalSpent, 0)

  return [
    {
      icon: 'mdi-account-check',
      label: 'Active Customers',
      value: activeCount,
      color: 'success'
    },
    {
      icon: 'mdi-account-clock',
      label: 'Inactive',
      value: inactiveCount,
      color: 'warning'
    },
    {
      icon: 'mdi-account-group',
      label: 'Total Customers',
      value: customers.value.length,
      color: 'primary'
    },
    {
      icon: getCurrencyIcon(),
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      color: 'info'
    }
  ]
})

const viewCustomer = (customer: any) => {
  router.push(`/owner/customers/${customer.id}`)
}

const editCustomer = (customer: any) => {
  router.push(`/owner/customers/edit/${customer.id}`)
}

const confirmDelete = (customer: any) => {
  customerToDelete.value = customer
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!customerToDelete.value) return

  deleting.value = true

  try {
    // Delete customer from store
    deleteCustomer(customerToDelete.value.id)

    showSuccess(
      `${getFullName(customerToDelete.value)} has been deleted successfully.`
    )
    showDeleteDialog.value = false
    customerToDelete.value = null
  } catch (error) {
    console.error('Error deleting customer:', error)
    showError('Failed to delete customer. Please try again.')
  } finally {
    deleting.value = false
  }
}

const handleCancelDelete = () => {
  customerToDelete.value = null
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: 'all',
  }
}
</script>
