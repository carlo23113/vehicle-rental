<template>
  <CommonUiDataTable
    :headers="headers"
    :items="documents"
    :items-per-page="15"
    table-class="documents-table"
    empty-icon="mdi-file-document-remove"
    empty-title="No documents found"
    empty-message="Try adjusting your filters or upload a new document"
    @row-click="$emit('view', $event)"
  >
    <template #item.document="{ item }">
      <div class="d-flex align-center py-3">
        <CommonUiIconAvatar
          :icon="getDocumentIcon(item)"
          :size="40"
          :icon-size="20"
          :color="getDocumentColor(item)"
          icon-color="white"
          avatar-class="mr-3"
        />
        <div>
          <div class="font-weight-bold">{{ item.name }}</div>
          <div class="text-caption text-medium-emphasis">
            {{ DOCUMENT_TYPE_CONFIG[item.type as DocumentType].label }}
          </div>
        </div>
      </div>
    </template>

    <template #item.relatedTo="{ item }">
      <div>
        <div v-if="item.customerId" class="text-body-2">
          <v-icon icon="mdi-account" size="14" class="mr-1" />
          Customer #{{ item.customerId }}
        </div>
        <div v-if="item.rentalId" class="text-body-2">
          <v-icon icon="mdi-calendar-check" size="14" class="mr-1" />
          Rental #{{ item.rentalId }}
        </div>
        <div v-if="item.vehicleId" class="text-body-2">
          <v-icon icon="mdi-car" size="14" class="mr-1" />
          Vehicle #{{ item.vehicleId }}
        </div>
      </div>
    </template>

    <template #item.status="{ item }">
      <CommonUiTableChip :color="getStatusColor(item.status)" :label="item.status" />
    </template>

    <template #item.uploadedAt="{ item }">
      <div>
        <div class="text-body-2">{{ formatDate(item.uploadedAt) }}</div>
        <div class="text-caption text-medium-emphasis">by {{ item.uploadedBy }}</div>
      </div>
    </template>

    <template #item.expiry="{ item }">
      <div v-if="item.metadata?.expiryDate">
        <div class="text-body-2" :class="getExpiryTextClass(item)">
          {{ formatDate(item.metadata.expiryDate) }}
        </div>
        <CommonUiTableChip
          v-if="isExpired(item)"
          color="error"
          size="x-small"
          label="EXPIRED"
          class="mt-1"
        />
        <CommonUiTableChip
          v-else-if="isExpiringSoon(item)"
          color="warning"
          size="x-small"
          :label="`${getDaysUntilExpiry(item)} days`"
          class="mt-1"
        />
      </div>
      <div v-else class="text-caption text-medium-emphasis">N/A</div>
    </template>

    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        view-tooltip="View Document"
        :show-edit="false"
        :show-delete="false"
        @view="$emit('view', item)"
      >
        <template #middle>
          <CommonUiTableActionButton
            v-if="item.status === 'pending'"
            icon="mdi-check-circle"
            tooltip="Verify Document"
            color="success"
            @click="$emit('verify', item)"
          />
          <CommonUiTableActionButton
            icon="mdi-download"
            tooltip="Download"
            color="primary"
            @click="$emit('download', item)"
          />
        </template>
      </CommonUiTableActionButtons>
    </template>
  </CommonUiDataTable>
</template>

<script setup lang="ts">
import type { Document, DocumentType } from '~/types/document'
import { DOCUMENT_TYPE_CONFIG } from '~/types/document'
import { useDocumentHelpers } from '~/composables/useDocumentHelpers'

defineProps<{
  documents: Document[]
}>()

defineEmits<{
  view: [document: Document]
  verify: [document: Document]
  download: [document: Document]
}>()

const headers = [
  { title: 'Document', key: 'document', sortable: true },
  { title: 'Related To', key: 'relatedTo', sortable: false },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Uploaded', key: 'uploadedAt', sortable: true },
  { title: 'Expiry', key: 'expiry', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

const {
  getDocumentIcon,
  getDocumentColor,
  getStatusColor,
  isExpired,
  isExpiringSoon,
  getDaysUntilExpiry,
  formatDate,
  getExpiryTextClass,
} = useDocumentHelpers()
</script>

<style scoped lang="scss">
.documents-table :deep(th) {
  @apply font-bold uppercase text-xs tracking-wide;
}

.documents-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}
</style>
