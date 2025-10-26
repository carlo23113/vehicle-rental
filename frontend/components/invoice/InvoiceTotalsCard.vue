<template>
  <v-card elevation="0" class="totals-card pa-6 rounded-lg">
    <div class="total-row">
      <span class="text-subtitle-1">Subtotal:</span>
      <span class="text-h6 font-weight-bold">{{ formatCurrency(subtotal) }}</span>
    </div>
    <div v-if="discountAmount > 0" class="total-row text-success">
      <span class="text-subtitle-1">Discount:</span>
      <span class="text-h6 font-weight-bold">-{{ formatCurrency(discountAmount) }}</span>
    </div>
    <div class="total-row">
      <span class="text-subtitle-1">Tax:</span>
      <span class="text-h6 font-weight-bold">{{ formatCurrency(taxAmount) }}</span>
    </div>
    <v-divider class="my-3" />
    <div class="total-row grand-total">
      <span class="text-h6">Total:</span>
      <span class="text-h4 font-weight-bold">{{ formatCurrency(totalAmount) }}</span>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
}>()

const { formatCurrency } = useCurrency()
</script>

<style scoped>
.totals-card {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05),
    rgba(var(--v-theme-secondary), 0.05)
  );
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.total-row.grand-total {
  color: rgb(var(--v-theme-primary));
  padding-top: 8px;
}
</style>
