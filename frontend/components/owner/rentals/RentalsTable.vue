<template>
  <CommonUiDataTable
    v-model:selected-items="selectedRentalsModel"
    :headers="visibleColumns"
    :items="rentals"
    :items-per-page="10"
    :show-select="showSelect"
    item-value="id"
    table-class="rentals-table"
    empty-icon="mdi-calendar-remove"
    empty-title="No rentals found"
    empty-message="Try adjusting your filters or create a new rental"
    @row-click="$emit('view', $event)"
  >
    <template #item.customer="{ item }">
      <div class="flex items-center py-3">
        <v-avatar color="primary" size="40">
          <span class="font-bold">
            {{ getInitials(item.customerName) }}
          </span>
        </v-avatar>
        <div class="ml-3">
          <div class="font-bold text-base">{{ item.customerName }}</div>
          <div class="text-xs text-medium-emphasis">{{ item.customerEmail }}</div>
        </div>
      </div>
    </template>

    <template #item.vehicle="{ item }">
      <div class="flex items-center py-3">
        <CommonUiImageAvatar
          :src="item.vehicleImage"
          :alt="item.vehicleName"
          :fallback-icon="getVehicleIcon(item.vehicleType)"
          :initials="getVehicleInitials(item.vehicleName)"
          :size="56"
          :rounded="12"
          avatar-class="mr-3 vehicle-avatar"
          clickable
          @click="$emit('view', item)"
        />
        <div>
          <div class="font-semibold text-body-2">{{ item.vehicleName }}</div>
          <v-chip size="x-small" variant="outlined" class="mt-1 license-chip">
            {{ item.licensePlate }}
          </v-chip>
        </div>
      </div>
    </template>

    <template #item.period="{ item }">
      <div>
        <div class="text-body-2 font-medium">{{ formatDate(item.startDate) }}</div>
        <div class="text-xs text-medium-emphasis">to {{ formatDate(item.endDate) }}</div>
        <v-chip size="x-small" variant="tonal" color="primary" class="mt-1 duration-chip">
          <v-icon icon="mdi-calendar" start size="12" />
          {{ item.numberOfDays }} days
        </v-chip>
      </div>
    </template>

    <template #item.status="{ item }">
      <div class="status-container">
        <div class="d-flex align-center gap-2">
          <CommonUiTableChip
            :color="getStatusColor(item.status)"
            :icon="getStatusIcon(item.status)"
            :label="item.status"
            chip-class="status-chip"
          />
          <!-- Document Status Icon Indicator -->
          <v-tooltip v-if="item.documentsComplete === false" text="Missing Documents" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-icon
                v-bind="tooltipProps"
                icon="mdi-file-alert"
                size="18"
                color="warning"
                class="document-alert-icon"
              />
            </template>
          </v-tooltip>
        </div>
        <CommonUiTableChip
          v-if="item.paymentStatus"
          :color="getPaymentStatusColor(item.paymentStatus)"
          icon="mdi-cash"
          :icon-size="12"
          :label="item.paymentStatus"
          size="x-small"
          variant="tonal"
          chip-class="payment-chip"
        />
        <!-- Overdue Indicator -->
        <v-chip
          v-if="isOverdue(item)"
          color="error"
          size="x-small"
          variant="tonal"
          prepend-icon="mdi-alert-circle"
          class="mt-1 overdue-indicator"
        >
          Overdue
        </v-chip>
        <!-- Upcoming Indicator (starts within 24 hours) -->
        <v-chip
          v-if="isUpcoming(item)"
          color="warning"
          size="x-small"
          variant="tonal"
          prepend-icon="mdi-clock-alert"
          class="mt-1 upcoming-indicator"
        >
          Starting Soon
        </v-chip>
      </div>
    </template>

    <template #item.startDate="{ item }">
      <CommonUiActivityTimestamp
        :date="item.startDate"
        icon="mdi-calendar-start"
        format="short"
        compact
      />
    </template>

    <template #item.endDate="{ item }">
      <CommonUiActivityTimestamp
        :date="item.endDate"
        icon="mdi-calendar-end"
        format="short"
        compact
        :color-code="isOverdue(item)"
        :detect-overdue="true"
      />
    </template>

    <template #item.daysRemaining="{ item }">
      <div v-if="item.status === 'active'" class="days-remaining">
        <v-chip
          :color="getDaysRemainingColor(item)"
          size="small"
          variant="tonal"
          :prepend-icon="getDaysRemainingIcon(item)"
        >
          {{ calculateDaysRemaining(item) }}
        </v-chip>
      </div>
      <div v-else class="text-medium-emphasis text-sm">
        N/A
      </div>
    </template>

    <template #item.overdue="{ item }">
      <div v-if="isOverdue(item)" class="overdue-badge">
        <v-chip color="error" size="small" variant="tonal" prepend-icon="mdi-alert-circle">
          Overdue
        </v-chip>
      </div>
      <div v-else class="text-medium-emphasis text-sm">
        -
      </div>
    </template>

    <template #item.documents="{ item }">
      <CommonUiDocumentStatusBadge
        :is-complete="item.documentsComplete !== false"
        :show-label="true"
        size="x-small"
        variant="tonal"
      />
    </template>

    <template #item.totalAmount="{ item }">
      <div class="amount-display">
        <div class="text-lg font-bold">{{ formatCurrency(item.totalAmount) }}</div>
        <div class="text-xs text-medium-emphasis">{{ formatCurrency(item.dailyRate) }}/day</div>
      </div>
    </template>

    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        edit-tooltip="Edit Rental"
        @view="$emit('view', item)"
        @edit="$emit('edit', item)"
        @delete="$emit('delete', item)"
      >
        <template #prepend>
          <CommonUiTableActionButton
            icon="mdi-eye-outline"
            tooltip="Quick View"
            color="secondary"
            @click="handleQuickView(item)"
          />
          <CommonUiCommunicationActionButton
            :actions="getCommunicationActions(item)"
            @action="(type) => handleCommunication(type, item)"
          />
        </template>
        <template #middle>
          <CommonUiTableActionButton
            v-if="getInvoiceButtonState(item).show"
            :icon="getInvoiceButtonState(item).icon"
            :tooltip="getInvoiceButtonState(item).tooltip"
            :color="getInvoiceButtonState(item).color"
            @click="$emit('generate-invoice', item)"
          />
        </template>
      </CommonUiTableActionButtons>
    </template>
  </CommonUiDataTable>

  <!-- Quick View Dialog -->
  <RentalQuickView
    v-model="showQuickView"
    :rental="selectedRentalForQuickView"
    :format-date="formatDate"
    :get-status-color="getStatusColor"
    :get-payment-status-color="getPaymentStatusColor"
    @view-details="handleViewDetails"
  />

  <!-- Communication Dialog -->
  <CommonUiCommunicationDialog
    v-model="communicationDialog.show"
    :type="communicationDialog.type"
    :recipient="communicationDialog.recipient"
    :context-data="communicationDialog.contextData"
    :loading="communicationDialog.loading"
    @send="handleSendCommunication"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCurrency } from '~/composables/useCurrency'
import { useColumnVisibility } from '~/composables/useColumnVisibility'
import type { TableColumn } from '~/composables/useColumnVisibility'

const props = defineProps<{
  rentals: any[]
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  getPaymentStatusColor: (status: string) => string
  showSelect?: boolean
  selectedRentals?: any[]
}>()

const emit = defineEmits<{
  view: [rental: any]
  edit: [rental: any]
  delete: [rental: any]
  'generate-invoice': [rental: any]
  'update:selectedRentals': [rentals: any[]]
}>()

const selectedRentalsModel = computed({
  get: () => props.selectedRentals || [],
  set: (value) => emit('update:selectedRentals', value),
})

const { formatCurrency } = useCurrency()

// Quick View state
const showQuickView = ref(false)
const selectedRentalForQuickView = ref<any>(null)

const handleQuickView = (rental: any) => {
  selectedRentalForQuickView.value = rental
  showQuickView.value = true
}

const handleViewDetails = (rental: any) => {
  showQuickView.value = false
  emit('view', rental)
}

// Communication state
const communicationDialog = ref({
  show: false,
  type: 'email' as 'email' | 'sms' | 'reminder',
  recipient: undefined as any,
  contextData: undefined as any,
  loading: false,
})

const getCommunicationActions = (rental: any) => {
  const actions: any[] = [
    {
      type: 'email',
      label: 'Send Email',
      subtitle: rental.customerEmail,
      icon: 'mdi-email',
    },
  ]

  if (rental.customerPhone) {
    actions.push({
      type: 'sms',
      label: 'Send SMS',
      subtitle: rental.customerPhone,
      icon: 'mdi-message-text',
    })
  }

  // Add reminder options based on status
  if (rental.status === 'reserved') {
    actions.push({
      type: 'reminder-pickup',
      label: 'Pickup Reminder',
      subtitle: 'Upcoming rental start',
      icon: 'mdi-calendar-clock',
      badge: 'Upcoming',
      badgeColor: 'info',
    })
  }

  if (rental.status === 'active') {
    actions.push({
      type: 'reminder-return',
      label: 'Return Reminder',
      subtitle: 'Rental ending soon',
      icon: 'mdi-calendar-end',
    })
  }

  if (isOverdue(rental)) {
    actions.push({
      type: 'reminder-overdue',
      label: 'Overdue Notice',
      subtitle: 'Send urgent notice',
      icon: 'mdi-alert-circle',
      badge: 'Urgent',
      badgeColor: 'error',
    })
  }

  if (rental.paymentStatus === 'unpaid' || rental.paymentStatus === 'partially-paid') {
    actions.push({
      type: 'reminder-payment',
      label: 'Payment Reminder',
      subtitle: 'Pending payment',
      icon: 'mdi-cash-alert',
      badge: 'Payment',
      badgeColor: 'warning',
    })
  }

  if (rental.documentsComplete === false) {
    actions.push({
      type: 'reminder-documents',
      label: 'Documents Request',
      subtitle: 'Missing documents',
      icon: 'mdi-file-alert',
    })
  }

  return actions
}

const handleCommunication = (type: string, rental: any) => {
  // Prepare recipient data
  communicationDialog.value.recipient = {
    name: rental.customerName,
    email: rental.customerEmail,
    phone: rental.customerPhone,
  }

  // Prepare context data for templates
  communicationDialog.value.contextData = {
    customerName: rental.customerName,
    vehicleName: rental.vehicleName,
    licensePlate: rental.licensePlate,
    startDate: props.formatDate(rental.startDate),
    endDate: props.formatDate(rental.endDate),
    startTime: rental.startTime || '09:00 AM',
    endTime: rental.endTime || '09:00 AM',
    pickupLocation: rental.pickupLocation,
    returnLocation: rental.returnLocation,
    totalAmount: formatCurrency(rental.totalAmount),
    paymentStatus: rental.paymentStatus,
    rentalId: rental.id,
    daysOverdue: isOverdue(rental) ? calculateDaysOverdue(rental) : 0,
    companyName: 'Vehicle Rental Management',
  }

  // Set dialog type
  if (type === 'email') {
    communicationDialog.value.type = 'email'
  } else if (type === 'sms') {
    communicationDialog.value.type = 'sms'
  } else {
    communicationDialog.value.type = 'reminder'
  }

  communicationDialog.value.show = true
}

const handleSendCommunication = async (payload: any) => {
  communicationDialog.value.loading = true

  try {
    // TODO: Implement API call
    console.log('Sending communication:', payload)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Close dialog on success
    communicationDialog.value.show = false

    // You would typically emit a success event here
    // emit('communication-sent', payload)
  } catch (error) {
    console.error('Communication error:', error)
  } finally {
    communicationDialog.value.loading = false
  }
}

const calculateDaysOverdue = (rental: any): number => {
  if (rental.status !== 'active') return 0
  const endDate = new Date(rental.endDate)
  const today = new Date()
  const diffTime = today.getTime() - endDate.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Define all columns with visibility settings
const allColumns: TableColumn[] = [
  {
    title: 'Customer',
    key: 'customer',
    sortable: true,
    required: true,
  },
  {
    title: 'Vehicle',
    key: 'vehicle',
    sortable: true,
    visible: true,
  },
  {
    title: 'Rental Period',
    key: 'period',
    sortable: true,
    visible: true,
  },
  {
    title: 'Start Date',
    key: 'startDate',
    sortable: true,
    visible: false,
  },
  {
    title: 'End Date',
    key: 'endDate',
    sortable: true,
    visible: false,
  },
  {
    title: 'Days Remaining',
    key: 'daysRemaining',
    sortable: true,
    visible: false,
  },
  {
    title: 'Overdue',
    key: 'overdue',
    sortable: true,
    visible: false,
  },
  {
    title: 'Documents',
    key: 'documents',
    sortable: true,
    visible: false,
  },
  {
    title: 'Status',
    key: 'status',
    sortable: true,
    visible: true,
  },
  {
    title: 'Total Amount',
    key: 'totalAmount',
    sortable: true,
    visible: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    align: 'end' as const,
    required: true,
  },
]

// Initialize column visibility
const {
  visibleColumns,
  visibleCount,
  hiddenCount,
  toggleColumn,
  showAllColumns,
  resetToDefaults,
  isColumnVisible,
} = useColumnVisibility(allColumns, {
  storageKey: 'rentals-table-columns',
  defaultVisible: ['customer', 'vehicle', 'period', 'status', 'totalAmount', 'actions'],
})

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const getVehicleInitials = (vehicleName: string): string => {
  const parts = vehicleName.split(' ')
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
  }
  return vehicleName.substring(0, 2).toUpperCase()
}

const getVehicleIcon = (vehicleType: string): string => {
  const icons: Record<string, string> = {
    sedan: 'mdi-car',
    suv: 'mdi-car-estate',
    truck: 'mdi-truck',
    van: 'mdi-van-utility',
    motorcycle: 'mdi-motorbike',
    luxury: 'mdi-car-sports',
  }
  return icons[vehicleType?.toLowerCase()] || 'mdi-car'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    active: 'mdi-check-circle',
    reserved: 'mdi-calendar-clock',
    completed: 'mdi-check-all',
    cancelled: 'mdi-cancel',
  }
  return icons[status] || 'mdi-help-circle'
}

const hasInvoice = (rental: any): boolean => {
  // Check if rental has an invoice
  // In production, this would check a property on the rental object
  const existingInvoice = localStorage.getItem(`invoice-draft-rental-${rental.id}`)
  return !!existingInvoice
}

const getInvoiceButtonState = (rental: any) => {
  const hasInv = hasInvoice(rental)

  // Cancelled or Reserved rentals - hide button
  // Reserved: invoice auto-generated, no action needed
  // Cancelled: no invoice needed
  if (rental.status === 'cancelled' || rental.status === 'reserved') {
    return {
      show: false,
      icon: 'mdi-file-document-outline',
      tooltip: 'No Invoice',
      color: 'grey',
    }
  }

  // Active or Completed WITHOUT invoice = ERROR state (should never happen)
  if ((rental.status === 'active' || rental.status === 'completed') && !hasInv) {
    return {
      show: true,
      icon: 'mdi-alert-circle',
      tooltip: 'Missing Invoice - Create Now',
      color: 'error',
    }
  }

  // Active or Completed WITH invoice = View invoice
  return {
    show: true,
    icon: 'mdi-file-document-check',
    tooltip: 'View Invoice',
    color: 'info',
  }
}

// Helper functions for new columns
const isOverdue = (rental: any): boolean => {
  if (rental.status !== 'active') return false
  const endDate = new Date(rental.endDate)
  const today = new Date()
  return endDate < today
}

const isUpcoming = (rental: any): boolean => {
  if (rental.status !== 'reserved') return false
  const startDate = new Date(rental.startDate)
  const today = new Date()
  const diffTime = startDate.getTime() - today.getTime()
  const diffHours = diffTime / (1000 * 60 * 60)
  // Starting within 24 hours
  return diffHours > 0 && diffHours <= 24
}

const calculateDaysRemaining = (rental: any): string => {
  const endDate = new Date(rental.endDate)
  const today = new Date()
  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`
  } else if (diffDays === 0) {
    return 'Due today'
  } else if (diffDays === 1) {
    return '1 day left'
  } else {
    return `${diffDays} days left`
  }
}

const getDaysRemainingColor = (rental: any): string => {
  const endDate = new Date(rental.endDate)
  const today = new Date()
  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'error' // Overdue
  if (diffDays <= 2) return 'warning' // Due soon
  return 'success' // Good
}

const getDaysRemainingIcon = (rental: any): string => {
  const endDate = new Date(rental.endDate)
  const today = new Date()
  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'mdi-alert-circle' // Overdue
  if (diffDays <= 2) return 'mdi-clock-alert' // Due soon
  return 'mdi-clock-check' // Good
}

// Expose methods and properties for parent component
defineExpose({
  allColumns,
  visibleCount,
  hiddenCount,
  isColumnVisible,
  toggleColumn,
  showAllColumns,
  resetToDefaults,
})
</script>

<style scoped lang="scss">
.rentals-table :deep(tbody tr:hover) .vehicle-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.2);
}

.license-chip {
  @apply font-mono font-bold;
  border: 1.5px solid rgba(var(--v-theme-on-surface), 0.2);
}

.duration-chip {
  @apply font-semibold;
}

.status-chip {
  @apply capitalize font-semibold;
}

.payment-chip {
  @apply capitalize font-semibold;
}

.overdue-indicator {
  @apply font-semibold animate-pulse;
}

.upcoming-indicator {
  @apply font-semibold;
}

.status-container {
  @apply flex flex-col gap-1 items-start w-fit;
}

.amount-display {
  @apply flex flex-col gap-0.5;
}
</style>
