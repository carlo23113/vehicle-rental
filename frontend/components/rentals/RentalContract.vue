<template>
  <div class="rental-contract">
    <!-- Header -->
    <div class="contract-header">
      <h1 class="company-name">{{ template.companyName }}</h1>
      <div class="company-info">
        <p>{{ template.companyAddress }}</p>
        <p>Phone: {{ template.companyPhone }} | Email: {{ template.companyEmail }}</p>
      </div>
    </div>

    <v-divider class="my-6" />

    <!-- Contract Title -->
    <div class="contract-title">
      <h2>VEHICLE RENTAL AGREEMENT</h2>
      <p class="contract-number">Contract #{{ rental.id }}</p>
      <p class="contract-date">Date: {{ formatDate(new Date()) }}</p>
    </div>

    <v-divider class="my-6" />

    <!-- Parties Section -->
    <section class="contract-section">
      <h3>PARTIES TO THIS AGREEMENT</h3>
      <div class="section-content">
        <div class="party">
          <strong>Rental Company:</strong>
          <p>{{ template.companyName }}</p>
          <p>{{ template.companyAddress }}</p>
        </div>
        <div class="party mt-4">
          <strong>Renter:</strong>
          <p>{{ rental.customer.name }}</p>
          <p>Email: {{ rental.customer.email }}</p>
          <p>Phone: {{ rental.customer.phone }}</p>
          <p>Driver's License: {{ rental.customer.license }}</p>
        </div>
      </div>
    </section>

    <!-- Vehicle Information -->
    <section class="contract-section">
      <h3>VEHICLE INFORMATION</h3>
      <div class="section-content">
        <table class="info-table">
          <tr>
            <td><strong>Make & Model:</strong></td>
            <td>{{ rental.vehicle.make }} {{ rental.vehicle.model }}</td>
          </tr>
          <tr>
            <td><strong>Year:</strong></td>
            <td>{{ rental.vehicle.year }}</td>
          </tr>
          <tr>
            <td><strong>License Plate:</strong></td>
            <td>{{ rental.vehicle.licensePlate }}</td>
          </tr>
          <tr>
            <td><strong>Color:</strong></td>
            <td>{{ rental.vehicle.color }}</td>
          </tr>
          <tr>
            <td><strong>Current Mileage:</strong></td>
            <td>{{ rental.vehicle.mileage?.toLocaleString() || 'N/A' }} miles</td>
          </tr>
        </table>
      </div>
    </section>

    <!-- Rental Details -->
    <section class="contract-section">
      <h3>RENTAL DETAILS</h3>
      <div class="section-content">
        <table class="info-table">
          <tr>
            <td><strong>Rental Period:</strong></td>
            <td>{{ rental.amountOfDays }} day{{ rental.amountOfDays !== 1 ? 's' : '' }}</td>
          </tr>
          <tr>
            <td><strong>Start Date:</strong></td>
            <td>{{ formatDate(rental.startDate) }} at {{ rental.pickupTime }}</td>
          </tr>
          <tr>
            <td><strong>End Date:</strong></td>
            <td>{{ formatDate(rental.endDate) }} at {{ rental.returnTime }}</td>
          </tr>
          <tr>
            <td><strong>Pickup Location:</strong></td>
            <td>{{ rental.pickupLocation.name }}, {{ rental.pickupLocation.address }}</td>
          </tr>
          <tr>
            <td><strong>Rate Type:</strong></td>
            <td>{{ rental.rateType === 'city' ? 'City Drive' : 'Province Drive' }}</td>
          </tr>
          <tr v-if="rental.mileageLimit">
            <td><strong>Mileage Limit:</strong></td>
            <td>{{ rental.mileageLimit }} miles/day</td>
          </tr>
        </table>
      </div>
    </section>

    <!-- Pricing -->
    <section class="contract-section">
      <h3>PRICING</h3>
      <div class="section-content">
        <table class="pricing-table">
          <tr>
            <td>Daily Rate ({{ rental.rateType === 'city' ? 'City Drive' : 'Province Drive' }}):</td>
            <td class="amount">{{ formatCurrency(rental.dailyRate) }}</td>
          </tr>
          <tr>
            <td>Number of Days:</td>
            <td class="amount">{{ rental.amountOfDays }}</td>
          </tr>
          <tr class="total-row">
            <td><strong>Total Amount:</strong></td>
            <td class="amount"><strong>{{ formatCurrency(rental.totalAmount) }}</strong></td>
          </tr>
        </table>
      </div>
    </section>

    <!-- Terms and Conditions -->
    <section class="contract-section">
      <div class="section-content">
        <div class="rich-content" v-html="template.termsAndConditions"></div>
      </div>
    </section>

    <!-- Additional Clauses -->
    <section v-if="template.additionalClauses" class="contract-section">
      <h3>ADDITIONAL CLAUSES</h3>
      <div class="section-content">
        <div class="rich-content" v-html="template.additionalClauses"></div>
      </div>
    </section>

    <!-- Special Notes -->
    <section v-if="rental.notes" class="contract-section">
      <h3>SPECIAL NOTES</h3>
      <div class="section-content">
        <p>{{ rental.notes }}</p>
      </div>
    </section>

    <!-- Signatures -->
    <section class="contract-section signatures">
      <div class="signature-box">
        <div class="signature-line"></div>
        <p><strong>Renter Signature</strong></p>
        <p>{{ rental.customer.name }}</p>
        <p>Date: _________________</p>
      </div>
      <div class="signature-box">
        <div class="signature-line"></div>
        <p><strong>Company Representative</strong></p>
        <p>{{ template.companyName }}</p>
        <p>Date: _________________</p>
      </div>
    </section>

    <!-- Footer -->
    <div class="contract-footer">
      <p class="text-center text-medium-emphasis">
        This is a legally binding agreement. Please read carefully before signing.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCurrency } from '~/composables/useCurrency'
import { useContractTemplate } from '~/composables/useContractTemplate'

interface Props {
  rental: {
    id: string | number
    status: string
    startDate: string
    endDate: string
    amountOfDays: number
    rateType: 'city' | 'province'
    dailyRate: number
    totalAmount: number
    pickupTime: string
    returnTime: string
    mileageLimit?: number
    notes?: string
    customer: {
      name: string
      email: string
      phone: string
      license: string
    }
    vehicle: {
      make: string
      model: string
      year: number
      licensePlate: string
      color: string
      mileage?: number
    }
    pickupLocation: {
      name: string
      address: string
    }
  }
}

defineProps<Props>()

const { formatCurrency } = useCurrency()
const { contractTemplate, loadTemplate } = useContractTemplate()

const template = contractTemplate

onMounted(() => {
  loadTemplate()
})

const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.rental-contract {
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.75in;
  background: white;
  color: black;
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
}

.contract-header {
  text-align: center;
  margin-bottom: 2rem;
}

.company-name {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.company-info {
  font-size: 14px;
  color: #555;
}

.company-info p {
  margin: 0.25rem 0;
}

.contract-title {
  text-align: center;
  margin: 2rem 0;
}

.contract-title h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.contract-number,
.contract-date {
  font-size: 14px;
  color: #555;
  margin: 0.25rem 0;
}

.contract-section {
  margin: 2rem 0;
  page-break-inside: avoid;
}

.contract-section h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #333;
}

.section-content {
  padding-left: 1rem;
}

.party {
  margin: 0.5rem 0;
}

.party p {
  margin: 0.25rem 0;
  color: #333;
}

.info-table,
.pricing-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.info-table td,
.pricing-table td {
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}

.info-table td:first-child {
  width: 40%;
}

.pricing-table td {
  padding: 0.75rem 0.5rem;
}

.pricing-table .amount {
  text-align: right;
  font-family: monospace;
}

.total-row {
  border-top: 2px solid #333;
  font-size: 18px;
}

.total-row td {
  padding-top: 1rem;
}

.rich-content {
  color: #333;
}

.rich-content :deep(h1),
.rich-content :deep(h2),
.rich-content :deep(h3) {
  font-weight: bold;
  margin: 1em 0 0.5em 0;
  color: #1a1a1a;
}

.rich-content :deep(h1) {
  font-size: 24px;
}

.rich-content :deep(h2) {
  font-size: 20px;
}

.rich-content :deep(h3) {
  font-size: 18px;
}

.rich-content :deep(p) {
  margin: 0.75rem 0;
  line-height: 1.6;
}

.rich-content :deep(ul),
.rich-content :deep(ol) {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.rich-content :deep(li) {
  margin: 0.5rem 0;
}

.rich-content :deep(strong) {
  font-weight: bold;
}

.rich-content :deep(em) {
  font-style: italic;
}

.rich-content :deep(u) {
  text-decoration: underline;
}

.rich-content :deep(hr) {
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.5rem 0;
}

.signatures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
}

.signature-box {
  text-align: center;
}

.signature-line {
  border-bottom: 2px solid #333;
  margin: 3rem 0 1rem 0;
  height: 50px;
}

.signature-box p {
  margin: 0.5rem 0;
  font-size: 14px;
}

.contract-footer {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
  font-size: 12px;
}

/* Print styles */
@media print {
  .rental-contract {
    padding: 0;
    max-width: none;
  }

  .contract-section {
    page-break-inside: avoid;
  }

  .signatures {
    page-break-before: avoid;
  }
}
</style>
