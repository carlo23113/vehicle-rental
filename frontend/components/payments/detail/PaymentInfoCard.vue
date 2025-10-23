<template>
  <CommonUiDetailCard title="Payment Information" icon="mdi-cash-multiple">
    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Transaction ID" icon="mdi-identifier" :value="transactionId || 'N/A'" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Status" icon="mdi-flag">
          <v-chip :color="statusColor" size="small" variant="flat">
            <v-icon :icon="statusIcon" start size="14" />
            {{ status }}
          </v-chip>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Amount" icon="mdi-currency-usd">
          <span class="text-primary font-weight-bold">{{ amount }}</span>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Payment Method" icon="mdi-credit-card">
          <div class="flex items-center gap-2">
            <v-icon :icon="methodIcon" size="18" />
            <span>{{ methodLabel }}</span>
          </div>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Payment Date" icon="mdi-calendar-check" :value="paymentDate || 'Pending'" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Due Date" icon="mdi-calendar-clock" :value="dueDate" />
      </v-col>
      <v-col v-if="refundDate" cols="12" md="6">
        <CommonUiDetailItem label="Refund Date" icon="mdi-keyboard-return">
          <span class="text-info font-weight-medium">{{ refundDate }}</span>
        </CommonUiDetailItem>
      </v-col>
      <v-col v-if="description" cols="12">
        <CommonUiDetailItem label="Description" icon="mdi-text" :value="description" />
      </v-col>
      <v-col v-if="notes" cols="12">
        <CommonUiDetailItem label="Notes" icon="mdi-note-text" :value="notes" />
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
defineProps<{
  transactionId?: string
  amount: string
  status: string
  paymentDate?: string
  dueDate: string
  refundDate?: string
  description?: string
  notes?: string
  methodIcon: string
  methodLabel: string
  statusColor: string
  statusIcon: string
}>()
</script>
