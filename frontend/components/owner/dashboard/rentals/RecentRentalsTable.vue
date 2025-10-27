<script setup lang="ts">
import { useCurrency } from '~/composables/useCurrency'
import { useRouter } from 'vue-router'

const router = useRouter()
const { formatCurrency } = useCurrency()

interface Rental {
  id: number
  customer: string
  customerInitials: string
  vehicle: string
  licensePlate: string
  startDate: string
  endDate: string
  status: string
  statusColor: string
  amount: string
  color: string
}

defineProps<{
  rentals: Rental[]
  loading?: boolean
}>()

const headers = [
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Period', key: 'startDate', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true, align: 'end' as const },
]

const handleRowClick = (event: any, { item }: { item: Rental }) => {
  router.push(`/owner/rentals/${item.id}`)
}
</script>

<template>
  <CommonUiDetailCard title="Recent Rentals" icon="mdi-clipboard-text-clock">
    <template #actions>
      <v-btn
        to="/owner/rentals"
        variant="text"
        color="primary"
        append-icon="mdi-arrow-right"
        class="hover-lift"
      >
        View All
      </v-btn>
    </template>
    <v-skeleton-loader v-if="loading" type="table" />
    <v-data-table
      v-else
      :headers="headers"
      :items="rentals.slice(0, 4)"
      :items-per-page="4"
      class="modern-datatable"
      hover
      :show-select="false"
      item-value="id"
      hide-default-footer
      @click:row="handleRowClick"
    >
      <template #[`item.customer`]="{ item }">
        <div class="d-flex align-center py-2">
          <v-avatar :color="item.color" size="44" class="mr-3 avatar-shadow">
            <span class="text-subtitle-2 font-weight-bold">{{ item.customerInitials }}</span>
          </v-avatar>
          <div>
            <div class="font-weight-medium text-body-1">{{ item.customer }}</div>
            <div class="text-caption text-medium-emphasis">Customer</div>
          </div>
        </div>
      </template>

      <template #[`item.vehicle`]="{ item }">
        <div>
          <div class="font-weight-medium text-body-1">{{ item.vehicle }}</div>
          <div class="text-caption text-medium-emphasis">
            <v-icon icon="mdi-card-text" size="12" class="mr-1" />
            {{ item.licensePlate }}
          </div>
        </div>
      </template>

      <template #[`item.startDate`]="{ item }">
        <div>
          <div class="text-body-2">{{ item.startDate }}</div>
          <div class="text-caption text-medium-emphasis">
            <v-icon icon="mdi-arrow-right" size="12" class="mx-1" />
            {{ item.endDate }}
          </div>
        </div>
      </template>

      <template #[`item.status`]="{ item }">
        <v-chip
          :color="item.statusColor"
          size="small"
          variant="flat"
          class="font-weight-bold status-chip"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template #[`item.amount`]="{ item }">
        <div class="text-h6 font-weight-bold amount-text">
          {{ formatCurrency(parseFloat(item.amount)) }}
        </div>
      </template>
    </v-data-table>
  </CommonUiDetailCard>
</template>

<style lang="scss" scoped>
.modern-datatable {
  @apply bg-transparent;

  :deep(.v-table__wrapper) {
    @apply rounded-b-2xl overflow-hidden relative;
  }

  :deep(.v-data-table__th) {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.04) 0%,
      rgba(var(--v-theme-primary), 0.02) 100%
    ) !important;
    @apply font-extrabold uppercase text-[0.7rem] tracking-wider relative;
    color: rgba(var(--v-theme-on-surface), 0.8) !important;
    border-bottom: 2px solid rgba(var(--v-theme-primary), 0.15) !important;
    padding: 20px 16px !important;

    &::after {
      @apply absolute bottom-[-2px] left-0 right-0 h-0.5 opacity-0 transition-opacity duration-300;
      content: '';
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(var(--v-theme-primary), 0.4) 50%,
        transparent 100%
      );
    }

    &:hover::after {
      @apply opacity-100;
    }
  }

  :deep(.v-data-table__td) {
    border-bottom: 1px solid rgba(var(--v-border-color), 0.04) !important;
    padding: 16px !important;
  }

  :deep(tbody tr) {
    @apply transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] relative border-l-4 border-transparent cursor-pointer;

    &:hover {
      border-left-color: rgb(var(--v-theme-primary));
      background: linear-gradient(
        90deg,
        rgba(var(--v-theme-primary), 0.06) 0%,
        rgba(var(--v-theme-primary), 0.02) 100%
      ) !important;

      .avatar-shadow {
        box-shadow:
          0 8px 20px rgba(0, 0, 0, 0.25),
          0 0 0 3px rgba(var(--v-theme-primary), 0.2);
        @apply scale-105;
      }

      .status-chip {
        @apply scale-105;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .amount-text::after {
        @apply opacity-100 scale-x-100;
      }
    }
  }

  :deep(.v-data-table-footer) {
    @apply border-t backdrop-blur-xl;
    border-color: rgba(var(--v-border-color), 0.08);
    background: linear-gradient(
      180deg,
      rgba(var(--v-theme-surface), 0.95) 0%,
      rgba(var(--v-theme-surface), 0.98) 100%
    );
    padding: 16px !important;

    .v-btn {
      @apply transition-all duration-300;

      &:hover {
        @apply scale-110;
        background: rgba(var(--v-theme-primary), 0.1) !important;
      }
    }
  }

  :deep(.v-select) {
    @apply rounded-xl;
  }
}

.avatar-shadow {
  @apply transition-all duration-300;
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.18),
    0 0 0 3px rgba(255, 255, 255, 0.1);
}

.status-chip {
  @apply rounded-[10px] px-[14px] transition-all duration-300;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.amount-text {
  @apply relative inline-block;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  &::after {
    @apply absolute bottom-[-2px] left-0 right-0 h-0.5 opacity-0 scale-x-0 transition-all duration-300;
    content: '';
    background: linear-gradient(
      90deg,
      rgb(var(--v-theme-primary)) 0%,
      rgb(var(--v-theme-secondary)) 100%
    );
  }
}

.hover-lift {
  @apply transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] relative;

  &::before {
    @apply absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300;
    content: '';
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, transparent 100%);
  }

  &:hover {
    @apply translate-x-1;

    &::before {
      @apply opacity-100;
    }
  }
}
</style>
