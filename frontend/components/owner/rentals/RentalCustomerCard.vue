<template>
  <CommonUiDetailCard title="Customer Information" icon="mdi-account">
    <template v-if="customerId" #actions>
      <v-btn
        variant="outlined"
        color="primary"
        size="small"
        prepend-icon="mdi-account-eye"
        @click="viewCustomer"
      >
        View Customer
      </v-btn>
    </template>

    <div class="d-flex align-start mb-4" style="gap: 16px">
      <v-avatar color="primary" size="56" class="text-white">
        <span class="text-h6 font-weight-bold">{{ customerInitials }}</span>
      </v-avatar>
      <div class="flex-1-1">
        <h4 class="text-subtitle-1 font-weight-bold mb-1">
          {{ customer.name }}
        </h4>
        <div class="text-caption text-medium-emphasis">Customer</div>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Email" icon="mdi-email" :value="customer.email" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Phone" icon="mdi-phone" :value="customer.phone" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Driver's License" icon="mdi-card-account-details" :value="customer.license" />
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  customer: {
    name: string
    email: string
    phone: string
    license: string
  }
  customerId?: number | string
}

const props = defineProps<Props>()
const router = useRouter()

const customerInitials = computed(() => {
  const names = props.customer.name.split(' ').filter(n => n.length > 0)
  if (names.length >= 2) {
    return `${names[0]?.[0] || ''}${names[names.length - 1]?.[0] || ''}`.toUpperCase()
  }
  return props.customer.name.substring(0, 2).toUpperCase()
})

const viewCustomer = () => {
  if (props.customerId) {
    router.push(`/owner/customers/${props.customerId}`)
  }
}
</script>
