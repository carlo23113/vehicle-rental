<template>
  <div class="invoice-template" :class="{ 'print-mode': printMode }">
    <div class="invoice-container">
      <!-- Header -->
      <div class="invoice-header">
        <div class="company-info">
          <div v-if="companyInfo.logo" class="company-logo">
            <img :src="companyInfo.logo" alt="Company Logo" />
          </div>
          <div v-else class="company-logo-placeholder">
            <v-icon icon="mdi-office-building" size="48" color="primary" />
          </div>
          <h1 class="company-name">{{ companyInfo.name }}</h1>
          <div class="company-details">
            <p>{{ companyInfo.address.street }}</p>
            <p>{{ companyInfo.address.city }}, {{ companyInfo.address.state }} {{ companyInfo.address.zipCode }}</p>
            <p>{{ companyInfo.address.country }}</p>
            <p class="mt-2">{{ companyInfo.phone }}</p>
            <p>{{ companyInfo.email }}</p>
            <p v-if="companyInfo.website">{{ companyInfo.website }}</p>
          </div>
        </div>

        <div class="invoice-meta">
          <h2 class="invoice-title">INVOICE</h2>
          <div class="invoice-details">
            <div class="detail-row">
              <span class="label">Invoice #:</span>
              <span class="value">{{ invoice.invoiceNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Issue Date:</span>
              <span class="value">{{ formatDate(invoice.issueDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Due Date:</span>
              <span class="value">{{ formatDate(invoice.dueDate) }}</span>
            </div>
            <div v-if="invoice.rentalId" class="detail-row">
              <span class="label">Rental ID:</span>
              <span class="value">{{ invoice.rentalId }}</span>
            </div>
          </div>

          <div class="status-badge" :class="`status-${invoice.status}`">
            {{ INVOICE_STATUS_CONFIG[invoice.status].label }}
          </div>
        </div>
      </div>

      <v-divider class="my-6" />

      <!-- Bill To & Vehicle Info -->
      <div class="invoice-parties">
        <div class="bill-to">
          <h3 class="section-title">BILL TO</h3>
          <p class="customer-name">{{ invoice.customerName }}</p>
          <div v-if="invoice.customerAddress" class="customer-address">
            <p>{{ invoice.customerAddress.street }}</p>
            <p>{{ invoice.customerAddress.city }}, {{ invoice.customerAddress.state }} {{ invoice.customerAddress.zipCode }}</p>
            <p>{{ invoice.customerAddress.country }}</p>
          </div>
          <p class="mt-2">{{ invoice.customerEmail }}</p>
          <p v-if="invoice.customerPhone">{{ invoice.customerPhone }}</p>
        </div>

        <div v-if="invoice.vehicleInfo" class="vehicle-info">
          <h3 class="section-title">VEHICLE</h3>
          <p class="vehicle-name">{{ invoice.vehicleInfo.make }} {{ invoice.vehicleInfo.model }} {{ invoice.vehicleInfo.year }}</p>
          <p class="vehicle-plate">{{ invoice.vehicleInfo.licensePlate }}</p>
        </div>
      </div>

      <!-- Items Table -->
      <div class="invoice-items">
        <table class="items-table">
          <thead>
            <tr>
              <th class="text-left">Description</th>
              <th class="text-center">Quantity</th>
              <th class="text-right">Unit Price</th>
              <th v-if="showTax" class="text-right">Tax</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoice.items" :key="item.id" class="item-row">
              <td class="description">{{ item.description }}</td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-right">{{ formatCurrency(item.unitPrice) }}</td>
              <td v-if="showTax" class="text-right">
                {{ item.taxRate ? `${item.taxRate}%` : '-' }}
              </td>
              <td class="text-right amount">{{ formatCurrency(item.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="invoice-totals">
        <div class="totals-section">
          <div class="total-row">
            <span class="label">Subtotal:</span>
            <span class="value">{{ formatCurrency(invoice.subtotal) }}</span>
          </div>

          <div v-if="invoice.discountAmount > 0" class="total-row discount">
            <span class="label">Discount:</span>
            <span class="value">-{{ formatCurrency(invoice.discountAmount) }}</span>
          </div>

          <div v-if="showTax && invoice.taxAmount > 0" class="total-row">
            <span class="label">Tax ({{ invoice.taxRate }}%):</span>
            <span class="value">{{ formatCurrency(invoice.taxAmount) }}</span>
          </div>

          <v-divider class="my-2" />

          <div class="total-row grand-total">
            <span class="label">Total:</span>
            <span class="value">{{ formatCurrency(invoice.totalAmount) }}</span>
          </div>

          <div v-if="invoice.amountPaid > 0" class="total-row paid">
            <span class="label">Amount Paid:</span>
            <span class="value">{{ formatCurrency(invoice.amountPaid) }}</span>
          </div>

          <div v-if="invoice.amountDue > 0" class="total-row balance-due">
            <span class="label">Balance Due:</span>
            <span class="value">{{ formatCurrency(invoice.amountDue) }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Info -->
      <div v-if="invoice.paymentMethod" class="payment-info">
        <h3 class="section-title">PAYMENT INFORMATION</h3>
        <div class="payment-details">
          <p><strong>Payment Method:</strong> {{ invoice.paymentMethod }}</p>
          <p v-if="invoice.paymentReference"><strong>Reference:</strong> {{ invoice.paymentReference }}</p>
          <p v-if="invoice.paidDate"><strong>Paid On:</strong> {{ formatDate(invoice.paidDate) }}</p>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="invoice.notes" class="invoice-notes">
        <h3 class="section-title">NOTES</h3>
        <p class="notes-content">{{ invoice.notes }}</p>
      </div>

      <!-- Terms -->
      <div v-if="invoice.terms" class="invoice-terms">
        <h3 class="section-title">TERMS & CONDITIONS</h3>
        <p class="terms-content">{{ invoice.terms }}</p>
      </div>

      <!-- Footer -->
      <div class="invoice-footer">
        <p class="footer-text">Thank you for your business!</p>
        <div v-if="companyInfo.taxId" class="tax-info">
          <p><strong>Tax ID:</strong> {{ companyInfo.taxId }}</p>
          <p v-if="companyInfo.registrationNumber"><strong>Registration #:</strong> {{ companyInfo.registrationNumber }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Invoice, CompanyInfo } from '~/types/invoice'
import { INVOICE_STATUS_CONFIG } from '~/types/invoice'

interface Props {
  invoice: Invoice
  companyInfo: CompanyInfo
  printMode?: boolean
  showTax?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  printMode: false,
  showTax: true,
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
</script>

<style scoped>
.invoice-template {
  background: white;
  font-family: 'Helvetica', 'Arial', sans-serif;
  color: #333;
  line-height: 1.6;
}

.invoice-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
}

/* Header */
.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.company-info {
  flex: 1;
}

.company-logo img {
  max-width: 150px;
  margin-bottom: 10px;
}

.company-logo-placeholder {
  margin-bottom: 10px;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 8px;
}

.company-details {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.invoice-meta {
  text-align: right;
  min-width: 250px;
}

.invoice-title {
  font-size: 36px;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 15px;
}

.invoice-details {
  margin-bottom: 15px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
}

.detail-row .label {
  font-weight: 600;
  color: #666;
  margin-right: 15px;
}

.detail-row .value {
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 10px;
}

.status-badge.status-draft {
  background: #f5f5f5;
  color: #666;
}

.status-badge.status-sent {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.status-paid {
  background: #e8f5e9;
  color: #4caf50;
}

.status-badge.status-overdue {
  background: #ffebee;
  color: #f44336;
}

.status-badge.status-cancelled {
  background: #f5f5f5;
  color: #999;
}

/* Parties */
.invoice-parties {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.bill-to,
.vehicle-info {
  flex: 1;
}

.section-title {
  font-size: 12px;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.customer-name,
.vehicle-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.customer-address,
.vehicle-info p {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

/* Items Table */
.invoice-items {
  margin-bottom: 30px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.items-table thead {
  background: #f5f5f5;
}

.items-table th {
  padding: 12px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: #666;
  border-bottom: 2px solid #ddd;
}

.items-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.item-row:last-child td {
  border-bottom: 2px solid #ddd;
}

.items-table .description {
  font-weight: 500;
}

.items-table .amount {
  font-weight: 600;
}

/* Totals */
.invoice-totals {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}

.totals-section {
  min-width: 300px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.total-row .label {
  font-weight: 500;
  color: #666;
}

.total-row .value {
  font-weight: 600;
}

.total-row.discount .value {
  color: #4caf50;
}

.total-row.grand-total {
  font-size: 18px;
  color: rgb(var(--v-theme-primary));
  padding-top: 12px;
}

.total-row.grand-total .label,
.total-row.grand-total .value {
  font-weight: bold;
}

.total-row.paid .value {
  color: #4caf50;
}

.total-row.balance-due {
  background: #fff3e0;
  padding: 12px;
  margin-top: 8px;
  border-radius: 4px;
  font-size: 16px;
}

.total-row.balance-due .label,
.total-row.balance-due .value {
  font-weight: bold;
  color: #ff9800;
}

/* Payment Info */
.payment-info {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.payment-details {
  font-size: 13px;
}

.payment-details p {
  margin-bottom: 5px;
}

/* Notes & Terms */
.invoice-notes,
.invoice-terms {
  margin-bottom: 20px;
}

.notes-content,
.terms-content {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
}

/* Footer */
.invoice-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #eee;
  text-align: center;
}

.footer-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.tax-info {
  font-size: 11px;
  color: #999;
}

/* Print Mode */
.print-mode {
  box-shadow: none;
}

.print-mode .invoice-container {
  padding: 20px;
}

@media print {
  .invoice-template {
    box-shadow: none;
  }

  .invoice-container {
    padding: 0;
    max-width: 100%;
  }

  .status-badge {
    border: 1px solid #ddd;
  }
}
</style>
