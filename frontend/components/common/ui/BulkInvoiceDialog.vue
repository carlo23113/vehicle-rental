<template>
  <v-dialog v-model="dialogModel" max-width="600" persistent>
    <v-card>
      <v-card-title class="d-flex align-center gap-2 pa-4 bg-primary">
        <v-icon icon="mdi-file-document-multiple" size="24" />
        <span class="text-h6">Generate Bulk Invoices</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Summary -->
        <v-alert type="info" variant="tonal" class="mb-4">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="font-weight-bold mb-1">Selected Items</div>
              <div class="text-caption">
                {{ rentedCount }} rented {{ itemLabel }}{{ rentedCount !== 1 ? 's' : '' }} will have invoices generated
              </div>
            </div>
            <v-chip color="primary" size="large">
              {{ rentedCount }}
            </v-chip>
          </div>
        </v-alert>

        <!-- Warning if some items are not rented -->
        <v-alert
          v-if="nonRentedCount > 0"
          type="warning"
          variant="tonal"
          class="mb-4"
        >
          <div class="text-caption">
            {{ nonRentedCount }} selected {{ itemLabel }}{{ nonRentedCount !== 1 ? 's are' : ' is' }} not rented and will be skipped
          </div>
        </v-alert>

        <!-- Invoice options -->
        <div class="mb-4">
          <v-checkbox
            v-model="includeDetails"
            label="Include detailed breakdown"
            hide-details
            density="comfortable"
          />
          <v-checkbox
            v-model="sendEmail"
            label="Send invoices via email to customers"
            hide-details
            density="comfortable"
          />
        </div>

        <!-- Items list -->
        <div class="items-list">
          <div class="text-subtitle-2 mb-2">Items to Process:</div>
          <v-list density="compact" class="bg-surface-variant rounded">
            <v-list-item
              v-for="item in rentedItems"
              :key="item.id"
              :title="getItemTitle(item)"
              :subtitle="getItemSubtitle(item)"
            >
              <template #prepend>
                <v-icon icon="mdi-check-circle" color="success" size="small" />
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="handleCancel">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          :disabled="rentedCount === 0"
          @click="handleConfirm"
        >
          Generate {{ rentedCount }} Invoice{{ rentedCount !== 1 ? 's' : '' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface BulkInvoiceDialogProps {
  modelValue: boolean
  selectedItems: any[]
  loading?: boolean
  itemLabel?: string
  getItemTitle?: (item: any) => string
  getItemSubtitle?: (item: any) => string
}

const props = withDefaults(defineProps<BulkInvoiceDialogProps>(), {
  loading: false,
  itemLabel: 'item',
  getItemTitle: (item) => item.name || item.title || `Item ${item.id}`,
  getItemSubtitle: (item) => item.status || '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [options: { includeDetails: boolean; sendEmail: boolean }]
  cancel: []
}>()

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const includeDetails = ref(true)
const sendEmail = ref(false)

// Filter rented items
const rentedItems = computed(() => {
  return props.selectedItems.filter(item => item.status === 'rented')
})

const rentedCount = computed(() => rentedItems.value.length)
const nonRentedCount = computed(() => props.selectedItems.length - rentedCount.value)

const handleConfirm = () => {
  emit('confirm', {
    includeDetails: includeDetails.value,
    sendEmail: sendEmail.value,
  })
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

// Reset options when dialog closes
watch(dialogModel, (newValue) => {
  if (!newValue) {
    includeDetails.value = true
    sendEmail.value = false
  }
})
</script>

<style scoped>
.v-card-title {
  color: white;
}

.items-list {
  max-height: 300px;
  overflow-y: auto;
}
</style>
