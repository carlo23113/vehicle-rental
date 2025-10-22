<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Customers"
      subtitle="Manage customer profiles and information"
      action-text="Add Customer"
      action-icon="mdi-plus"
      @action-click="$router.push('/customers/add')"
    />

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <CustomerFilters
          :filters="filters"
          :status-options="statusOptions"
          @update:search="(val: string) => filters.search = val"
          @update:status="(val: any) => filters.status = val"
        />
      </v-col>
    </v-row>

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
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCustomers } from '~/composables/useCustomers'
import { useCurrency } from '~/composables/useCurrency'

const { formatCurrency } = useCurrency()

const {
  customers,
  filters,
  filteredCustomers,
  getStatusColor,
  getFullName,
  getInitials,
  formatDate,
} = useCustomers()

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
      icon: 'mdi-currency-usd',
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      color: 'info'
    }
  ]
})

const viewCustomer = (customer: any) => {
  console.log('View customer:', customer)
  // TODO: Implement view details
}

const editCustomer = (customer: any) => {
  console.log('Edit customer:', customer)
  // TODO: Implement edit functionality
}

const confirmDelete = (customer: any) => {
  console.log('Delete customer:', customer)
  // TODO: Implement delete confirmation
}
</script>
