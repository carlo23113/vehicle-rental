<template>
  <div class="receipt-template" :class="{ 'print-mode': printMode }">
    <div class="receipt-container">
      <!-- Header -->
      <div class="receipt-header">
        <div class="company-section">
          <div v-if="companyInfo.logo" class="company-logo">
            <img :src="companyInfo.logo" alt="Company Logo" />
          </div>
          <div v-else class="company-logo-placeholder">
            <v-icon size="40" color="success">mdi-receipt-text-outline</v-icon>
          </div>
          <h1 class="company-name">{{ companyInfo.name }}</h1>
        </div>

        <div class="receipt-title-section">
          <h2 class="receipt-title">PAYMENT RECEIPT</h2>
          <div class="receipt-status">
            <v-icon color="success" size="24">mdi-check-circle</v-icon>
            <span class="status-text">PAID</span>
          </div>
        </div>
      </div>

      <v-divider class="my-4" />

      <!-- Receipt Info -->
      <div class="receipt-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Receipt #:</span>
            <span class="info-value">{{ receipt.receiptNumber }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Payment Date:</span>
            <span class="info-value">{{ formatDate(receipt.paymentDate) }}</span>
          </div>
          <div v-if="receipt.invoiceNumber" class="info-item">
            <span class="info-label">Invoice #:</span>
            <span class="info-value">{{ receipt.invoiceNumber }}</span>
          </div>
          <div v-if="receipt.rentalId" class="info-item">
            <span class="info-label">Rental ID:</span>
            <span class="info-value">{{ receipt.rentalId }}</span>
          </div>
        </div>
      </div>

      <v-divider class="my-4" />

      <!-- Customer Info -->
      <div class="customer-section">
        <h3 class="section-title">RECEIVED FROM</h3>
        <p class="customer-name">{{ receipt.customerName }}</p>
        <p class="customer-email">{{ receipt.customerEmail }}</p>
      </div>

      <!-- Payment Details -->
      <div class="payment-section">
        <h3 class="section-title">PAYMENT DETAILS</h3>
        <div class="payment-method-box">
          <div class="payment-row">
            <span class="payment-label">Payment Method:</span>
            <span class="payment-value">
              <v-icon size="18" class="mr-1">{{ getPaymentMethodIcon(receipt.paymentMethod) }}</v-icon>
              {{ receipt.paymentMethod }}
            </span>
          </div>
          <div v-if="receipt.paymentReference" class="payment-row">
            <span class="payment-label">Reference:</span>
            <span class="payment-value">{{ receipt.paymentReference }}</span>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="items-section">
        <h3 class="section-title">PAYMENT FOR</h3>
        <div class="items-list">
          <div v-for="(item, index) in receipt.items" :key="index" class="item-row">
            <span class="item-description">{{ item.description }}</span>
            <span class="item-amount">{{ formatCurrency(item.amount) }}</span>
          </div>
        </div>
      </div>

      <v-divider class="my-4" />

      <!-- Amount Paid -->
      <div class="amount-section">
        <div class="amount-paid-box">
          <span class="amount-label">AMOUNT PAID</span>
          <span class="amount-value">{{ formatCurrency(receipt.amount) }}</span>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="receipt.notes" class="notes-section">
        <h3 class="section-title">NOTES</h3>
        <p class="notes-content">{{ receipt.notes }}</p>
      </div>

      <!-- Footer -->
      <div class="receipt-footer">
        <div class="company-details">
          <p>{{ companyInfo.address.street }}, {{ companyInfo.address.city }}, {{ companyInfo.address.state }} {{ companyInfo.address.zipCode }}</p>
          <p>{{ companyInfo.phone }} | {{ companyInfo.email }}</p>
          <p v-if="companyInfo.website">{{ companyInfo.website }}</p>
        </div>
        <div class="footer-message">
          <p>Thank you for your payment!</p>
          <p class="print-info">This is a computer-generated receipt and does not require a signature.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Receipt, CompanyInfo } from '~/types/invoice'

interface Props {
  receipt: Receipt
  companyInfo?: CompanyInfo
  printMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  printMode: false,
  companyInfo: () => ({
    name: 'Vehicle Rental Management',
    logo: '',
    address: {
      street: '123 Main Street',
      city: 'Downtown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
    },
    phone: '(555) 123-4567',
    email: 'info@vehiclerental.com',
    website: 'www.vehiclerental.com',
    taxId: 'TX-123456789',
  }),
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const getPaymentMethodIcon = (method: string): string => {
  const icons: Record<string, string> = {
    'credit-card': 'mdi-credit-card',
    'debit-card': 'mdi-credit-card-outline',
    'cash': 'mdi-cash',
    'bank-transfer': 'mdi-bank-transfer',
    'check': 'mdi-checkbook',
    'other': 'mdi-cash-multiple',
  }
  return icons[method.toLowerCase().replace(/\s+/g, '-')] || 'mdi-cash'
}
</script>

<style scoped>
.receipt-template {
  background: white;
  font-family: 'Helvetica', 'Arial', sans-serif;
  color: #333;
}

.receipt-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  border: 2px dashed #ddd;
}

/* Header */
.receipt-header {
  text-align: center;
  margin-bottom: 20px;
}

.company-logo img {
  max-width: 120px;
  margin-bottom: 10px;
}

.company-logo-placeholder {
  margin-bottom: 10px;
}

.company-name {
  font-size: 22px;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 15px;
}

.receipt-title-section {
  margin-top: 15px;
}

.receipt-title {
  font-size: 28px;
  font-weight: bold;
  color: rgb(var(--v-theme-success));
  margin-bottom: 10px;
}

.receipt-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #e8f5e9;
  padding: 8px 20px;
  border-radius: 25px;
}

.status-text {
  font-weight: bold;
  color: #4caf50;
  font-size: 14px;
}

/* Receipt Info */
.receipt-info {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* Customer Section */
.customer-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 11px;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #eee;
  padding-bottom: 5px;
}

.customer-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.customer-email {
  font-size: 13px;
  color: #666;
}

/* Payment Section */
.payment-section {
  margin-bottom: 25px;
}

.payment-method-box {
  background: #f0f7ff;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid rgb(var(--v-theme-info));
}

.payment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.payment-row:last-child {
  margin-bottom: 0;
}

.payment-label {
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.payment-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
}

/* Items Section */
.items-section {
  margin-bottom: 25px;
}

.items-list {
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

.item-row:last-child {
  border-bottom: none;
}

.item-description {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.item-amount {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* Amount Section */
.amount-section {
  margin-bottom: 25px;
}

.amount-paid-box {
  background: linear-gradient(135deg, rgb(var(--v-theme-success)) 0%, #66bb6a 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.amount-label {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.amount-value {
  font-size: 32px;
  font-weight: bold;
}

/* Notes Section */
.notes-section {
  margin-bottom: 25px;
}

.notes-content {
  font-size: 13px;
  color: #666;
  background: #fffde7;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #fbc02d;
}

/* Footer */
.receipt-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px dashed #ddd;
  text-align: center;
}

.company-details {
  font-size: 11px;
  color: #666;
  margin-bottom: 15px;
}

.company-details p {
  margin-bottom: 3px;
}

.footer-message {
  font-size: 12px;
  color: #999;
}

.footer-message p {
  margin-bottom: 5px;
}

.print-info {
  font-size: 10px;
  font-style: italic;
}

/* Print Mode */
.print-mode .receipt-container {
  border: none;
  padding: 20px;
}

@media print {
  .receipt-template {
    box-shadow: none;
  }

  .receipt-container {
    padding: 0;
    max-width: 100%;
    border: none;
  }

  .amount-paid-box {
    background: #4caf50 !important;
    color: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
