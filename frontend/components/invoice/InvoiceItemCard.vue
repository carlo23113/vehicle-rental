<template>
  <div class="item-card pa-4 rounded-lg">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="item.description"
          label="Description"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          :rules="[v => !!v || 'Description is required']"
          @update:model-value="updateField('description', $event)"
        />
      </v-col>

      <v-col cols="6" md="2">
        <v-text-field
          :model-value="item.quantity"
          label="Qty"
          type="number"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          :rules="[v => v > 0 || 'Must be > 0']"
          @update:model-value="updateField('quantity', Number($event))"
        />
      </v-col>

      <v-col cols="6" md="2">
        <v-text-field
          :model-value="item.unitPrice"
          label="Unit Price"
          type="number"
          variant="outlined"
          density="comfortable"
          :prefix="currencySymbol"
          hide-details="auto"
          :rules="[v => v >= 0 || 'Must be >= 0']"
          @update:model-value="updateField('unitPrice', Number($event))"
        />
      </v-col>

      <v-col cols="6" md="2">
        <v-text-field
          :model-value="item.taxRate"
          label="Tax %"
          type="number"
          variant="outlined"
          density="comfortable"
          suffix="%"
          hide-details="auto"
          @update:model-value="updateField('taxRate', Number($event))"
        />
      </v-col>

      <v-col cols="6" md="2" class="d-flex align-center">
        <div class="flex-grow-1">
          <p class="text-caption text-medium-emphasis mb-1">Total</p>
          <p class="text-h6 font-weight-bold">{{ formattedTotal }}</p>
        </div>
        <v-btn
          icon="mdi-delete"
          variant="text"
          color="error"
          size="small"
          @click="$emit('remove')"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceItem } from '~/types/invoice'

const props = defineProps<{
  item: InvoiceItem
  currencySymbol: string
}>()

const emit = defineEmits<{
  update: [payload: [keyof InvoiceItem, any]]
  remove: []
}>()

const { formatCurrency } = useCurrency()

const formattedTotal = computed(() => formatCurrency(props.item.total))

const updateField = (field: keyof InvoiceItem, value: any) => {
  emit('update', [field, value])
}
</script>

<style scoped>
.item-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), 0.12);
}
</style>
