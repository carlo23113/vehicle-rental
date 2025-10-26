<template>
  <CommonUiDataTable
    :headers="headers"
    :items="invoices"
    :items-per-page="15"
    table-class="invoices-table"
    empty-icon="mdi-file-document-remove"
    empty-title="No invoices found"
    empty-message="Try adjusting your filters or create a new invoice"
  >
    <template #item.invoice="{ item }">
      <div class="py-3">
        <div class="font-weight-bold">{{ item.invoiceNumber }}</div>
        <div class="text-caption text-medium-emphasis">
          {{ formatDate(item.issueDate) }}
        </div>
      </div>
    </template>

    <template #item.customer="{ item }">
      <div>
        <div class="font-weight-medium">{{ item.customerName }}</div>
        <div class="text-caption text-medium-emphasis">{{ item.customerEmail }}</div>
      </div>
    </template>

    <template #item.amount="{ item }">
      <div>
        <div class="font-weight-bold text-h6">{{ formatCurrency(item.totalAmount) }}</div>
        <div v-if="item.amountDue > 0" class="text-caption text-warning">
          Due: {{ formatCurrency(item.amountDue) }}
        </div>
      </div>
    </template>

    <template #item.status="{ item }">
      <CommonUiTableChip
        :color="getStatusColor(item.status)"
        :label="getStatusLabel(item.status)"
      />
    </template>

    <template #item.paymentStatus="{ item }">
      <CommonUiTableChip
        :color="getPaymentStatusColor(item.paymentStatus)"
        :label="getPaymentStatusLabel(item.paymentStatus)"
      />
    </template>

    <template #item.dueDate="{ item }">
      <div>
        <div class="text-body-2">{{ formatDate(item.dueDate) }}</div>
        <div v-if="isOverdue(item)" class="text-caption text-error">Overdue</div>
      </div>
    </template>

    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        view-tooltip="View Invoice"
        :show-edit="false"
        :show-delete="false"
        @view="$emit('view', item)"
      >
        <template #middle>
          <CommonUiTableActionButton
            icon="mdi-download"
            tooltip="Download"
            color="primary"
            @click="$emit('download', item)"
          />
          <CommonUiTableActionButton
            v-if="item.status !== 'paid'"
            icon="mdi-send"
            tooltip="Send Invoice"
            color="secondary"
            @click="$emit('send', item)"
          />
          <CommonUiTableActionButton
            v-if="item.paymentStatus !== 'paid'"
            icon="mdi-check-circle"
            tooltip="Mark as Paid"
            color="success"
            @click="$emit('mark-paid', item)"
          />
        </template>
      </CommonUiTableActionButtons>
    </template>
  </CommonUiDataTable>
</template>

<script setup lang="ts">
import type { Invoice } from '~/types/invoice'
import { useCurrency } from '~/composables/useCurrency'
import { useInvoiceHelpers } from '~/composables/useInvoiceHelpers'

defineProps<{
  invoices: Invoice[]
}>()

defineEmits<{
  view: [invoice: Invoice]
  download: [invoice: Invoice]
  send: [invoice: Invoice]
  'mark-paid': [invoice: Invoice]
}>()

const { formatCurrency } = useCurrency()
const { getStatusColor, getStatusLabel, getPaymentStatusColor, getPaymentStatusLabel, isOverdue, formatDate } =
  useInvoiceHelpers()

const headers = [
  { title: 'Invoice', key: 'invoice', sortable: true },
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Payment', key: 'paymentStatus', sortable: true },
  { title: 'Due Date', key: 'dueDate', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>
