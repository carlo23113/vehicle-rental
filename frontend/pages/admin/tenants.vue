<template>
  <CommonPageLayout
    title="Tenants"
    subtitle="Manage all tenants in your SaaS platform"
    action-text="Add Tenant"
    action-icon="mdi-plus"
    @action-click="handleAddTenant"
  >
    <!-- Filters Slot -->
    <template #filters="{ showFilters: isFilterVisible, sectionsLoaded: sections }">
      <LazyTenantsFilters
        v-if="isFilterVisible || sections.content"
        v-model:show-filters="showFilters"
        v-model:filters="filters"
        @clear="clearFilters"
      />
    </template>

    <!-- Stats Slot -->
    <template #stats>
      <TenantsStatsCards
        :total-tenants="tenants.length"
        :active-tenants="activeTenants.length"
        :trial-tenants="trialTenants.length"
        revenue="$24,500"
      />
    </template>

    <!-- Main Content Slot -->
    <template #content>
      <LazyTenantsTableSection
        :tenants="displayedItems"
        :is-loading-more="isLoadingMore"
        :get-status-color="getStatusColor"
        :get-plan-color="getPlanColor"
        :format-date="formatDate"
        @view="handleViewTenant"
        @edit="handleEditTenant"
        @delete="handleDeleteTenant"
        @suspend="handleSuspendTenant"
        @activate="handleActivateTenant"
      />
    </template>

    <!-- Dialogs Slot -->
    <template #dialogs>
      <!-- Create/Edit Dialog -->
      <TenantForm
        v-if="showForm"
        v-model="showForm"
        :tenant="selectedTenant"
        :loading="formLoading"
        @submit="handleSubmit"
      />

      <!-- View Details Dialog -->
      <TenantDetails
        v-if="showDetails"
        v-model="showDetails"
        :tenant="selectedTenant"
        @edit="handleEditFromDetails"
        @suspend="handleSuspendTenant"
        @activate="handleActivateTenant"
      />

      <!-- Delete Confirmation Dialog -->
      <LazyTenantsDeleteDialog
        v-if="showDeleteDialog"
        v-model="showDeleteDialog"
        :tenant="tenantToDelete"
        :deleting="deleting"
        @confirm="deleteTenant"
        @cancel="handleCancelDelete"
      />

      <!-- Suspend Confirmation Dialog -->
      <CommonDialogConfirmationDialog
        v-if="showSuspendConfirm"
        v-model="showSuspendConfirm"
        title="Confirm Suspend"
        :message="`Are you sure you want to suspend ${selectedTenant?.name}?`"
        confirm-text="Suspend"
        confirm-color="warning"
        :loading="formLoading"
        @confirm="confirmSuspend"
      >
        <template #content>
          <v-alert type="warning" variant="tonal" class="mb-4">
            The tenant will lose access to their account.
          </v-alert>
        </template>
      </CommonDialogConfirmationDialog>

      <!-- Activate Confirmation Dialog -->
      <CommonDialogConfirmationDialog
        v-if="showActivateConfirm"
        v-model="showActivateConfirm"
        title="Confirm Activate"
        :message="`Are you sure you want to activate ${selectedTenant?.name}?`"
        confirm-text="Activate"
        confirm-color="success"
        :loading="formLoading"
        @confirm="confirmActivate"
      >
        <template #content>
          <v-alert type="success" variant="tonal" class="mb-4">
            The tenant will regain access to their account.
          </v-alert>
        </template>
      </CommonDialogConfirmationDialog>
    </template>

    <!-- Snackbar Slot -->
    <template #snackbar>
      <CommonUiSnackbar v-model="snackbar" />
    </template>
  </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTenants } from '~/composables/useTenants'
import { useSnackbar } from '~/composables/useSnackbar'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'
import type { Tenant, TenantFormData } from '~/types/tenant'

definePageMeta({
  layout: 'admin',
})

// Core composables
const {
  tenants,
  filters,
  filteredTenants,
  activeTenants,
  trialTenants,
  getStatusColor,
  getPlanColor,
  formatDate,
  initializeMockData,
} = useTenants()

const { snackbar, showSuccess, showError } = useSnackbar()

// Progressive table loading
const {
  displayedItems,
  isLoadingMore,
  updateDisplayedItems,
} = useProgressiveTable(filteredTenants, { batchSize: 20 })

// Debounced filters
const { watchImmediateFilters } = useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: updateDisplayedItems,
  onFilterChange: updateDisplayedItems,
})

// Watch immediate filters (status, plan)
watchImmediateFilters(['status', 'plan'])

// UI state
const showFilters = ref(false)
const showForm = ref(false)
const showDetails = ref(false)
const showDeleteDialog = ref(false)
const showSuspendConfirm = ref(false)
const showActivateConfirm = ref(false)
const formLoading = ref(false)
const deleting = ref(false)

// Selected tenant
const selectedTenant = ref<Tenant | null>(null)
const tenantToDelete = ref<Tenant | null>(null)

// Action handlers
const handleAddTenant = () => {
  selectedTenant.value = null
  showForm.value = true
}

const handleViewTenant = (tenant: Tenant) => {
  selectedTenant.value = tenant
  showDetails.value = true
}

const handleEditTenant = (tenant: Tenant) => {
  selectedTenant.value = tenant
  showForm.value = true
}

const handleEditFromDetails = (tenant: Tenant) => {
  showDetails.value = false
  setTimeout(() => {
    selectedTenant.value = tenant
    showForm.value = true
  }, 300)
}

const handleDeleteTenant = (tenant: Tenant) => {
  tenantToDelete.value = tenant
  showDeleteDialog.value = true
}

const handleSuspendTenant = (tenant: Tenant) => {
  selectedTenant.value = tenant
  showSuspendConfirm.value = true
}

const handleActivateTenant = (tenant: Tenant) => {
  selectedTenant.value = tenant
  showActivateConfirm.value = true
}

// CRUD operations
const handleSubmit = async (data: TenantFormData) => {
  formLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    if (selectedTenant.value) {
      // Update existing tenant
      const index = tenants.value.findIndex((t) => t.id === selectedTenant.value!.id)
      if (index !== -1) {
        tenants.value[index] = { ...tenants.value[index], ...data }
      }
      showSuccess('Tenant updated successfully')
    } else {
      // Create new tenant
      const newTenant: Tenant = {
        id: Math.max(...tenants.value.map((t) => t.id), 0) + 1,
        ...data,
        createdAt: new Date().toISOString(),
        currentUsers: 0,
        currentVehicles: 0,
      }
      tenants.value.push(newTenant)
      showSuccess('Tenant created successfully')
    }
    showForm.value = false
    selectedTenant.value = null
    updateDisplayedItems()
  } catch (error) {
    showError('Operation failed. Please try again.')
  } finally {
    formLoading.value = false
  }
}

const deleteTenant = async () => {
  if (!tenantToDelete.value) return
  deleting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Remove from local data
    const index = tenants.value.findIndex((t) => t.id === tenantToDelete.value!.id)
    if (index !== -1) {
      tenants.value.splice(index, 1)
    }
    showSuccess('Tenant deleted successfully')
    showDeleteDialog.value = false
    tenantToDelete.value = null
    updateDisplayedItems()
  } catch (error) {
    showError('Failed to delete tenant. Please try again.')
  } finally {
    deleting.value = false
  }
}

const confirmSuspend = async () => {
  if (!selectedTenant.value) return
  formLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update local data
    const index = tenants.value.findIndex((t) => t.id === selectedTenant.value!.id)
    if (index !== -1) {
      tenants.value[index].status = 'suspended'
    }
    showSuccess('Tenant suspended successfully')
    showSuspendConfirm.value = false
    showDetails.value = false
    selectedTenant.value = null
    updateDisplayedItems()
  } catch (error) {
    showError('Failed to suspend tenant. Please try again.')
  } finally {
    formLoading.value = false
  }
}

const confirmActivate = async () => {
  if (!selectedTenant.value) return
  formLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update local data
    const index = tenants.value.findIndex((t) => t.id === selectedTenant.value!.id)
    if (index !== -1) {
      tenants.value[index].status = 'active'
    }
    showSuccess('Tenant activated successfully')
    showActivateConfirm.value = false
    showDetails.value = false
    selectedTenant.value = null
    updateDisplayedItems()
  } catch (error) {
    showError('Failed to activate tenant. Please try again.')
  } finally {
    formLoading.value = false
  }
}

const handleCancelDelete = () => {
  tenantToDelete.value = null
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: 'all',
    plan: 'all',
  }
}

onMounted(() => {
  initializeMockData()
})
</script>
