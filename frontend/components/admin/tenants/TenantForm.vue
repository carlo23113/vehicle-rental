<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="900" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
        <span class="text-h5 text-white">{{ isEdit ? 'Edit Tenant' : 'Create New Tenant' }}</span>
        <v-btn icon variant="text" @click="$emit('update:modelValue', false)">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="valid">
          <!-- Basic Information -->
          <div class="mb-4">
            <h3 class="text-h6 mb-3">Basic Information</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.name"
                  label="Tenant Name"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.slug"
                  label="Slug (URL identifier)"
                  variant="outlined"
                  :rules="[rules.required, rules.slug]"
                  required
                  hint="e.g., abc-rentals"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  :rules="[rules.required, rules.email]"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.phone"
                  label="Phone (Optional)"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.contactPerson"
                  label="Contact Person"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.domain"
                  label="Custom Domain (Optional)"
                  variant="outlined"
                  hint="e.g., rentals.example.com"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-6" />

          <!-- Subscription Details -->
          <div class="mb-4">
            <h3 class="text-h6 mb-3">Subscription Details</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.plan"
                  label="Subscription Plan"
                  :items="planOptions"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.status"
                  label="Status"
                  :items="statusOptions"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.maxUsers"
                  label="Max Users"
                  type="number"
                  variant="outlined"
                  :rules="[rules.required, rules.positive]"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.maxVehicles"
                  label="Max Vehicles"
                  type="number"
                  variant="outlined"
                  :rules="[rules.required, rules.positive]"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.expiresAt"
                  label="Subscription Expires At (Optional)"
                  type="date"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-6" />

          <!-- Features -->
          <div class="mb-4">
            <h3 class="text-h6 mb-3">Features</h3>
            <v-select
              v-model="formData.features"
              label="Enabled Features"
              :items="featureOptions"
              variant="outlined"
              multiple
              chips
              closable-chips
            />
          </div>

          <v-divider class="my-6" />

          <!-- Billing Information -->
          <div class="mb-4">
            <h3 class="text-h6 mb-3">Billing Information (Optional)</h3>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.billingInfo!.address"
                  label="Address"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.billingInfo!.city"
                  label="City"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.billingInfo!.state"
                  label="State"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.billingInfo!.country"
                  label="Country"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.billingInfo!.zipCode"
                  label="ZIP Code"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.billingInfo!.taxId"
                  label="Tax ID"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-6" />

          <!-- Notes -->
          <div>
            <h3 class="text-h6 mb-3">Notes</h3>
            <v-textarea
              v-model="formData.notes"
              label="Additional Notes (Optional)"
              variant="outlined"
              rows="3"
            />
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 border-t">
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSubmit"
          :loading="loading"
          :disabled="!valid"
        >
          {{ isEdit ? 'Update' : 'Create' }} Tenant
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TenantFormData } from '~/types/tenant'

interface Props {
  modelValue: boolean
  tenant?: TenantFormData | null
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: TenantFormData]
}>()

const formRef = ref()
const valid = ref(false)

const isEdit = ref(!!props.tenant)

const formData = ref<TenantFormData>({
  name: '',
  slug: '',
  email: '',
  phone: '',
  contactPerson: '',
  domain: '',
  status: 'trial',
  plan: 'starter',
  maxUsers: 5,
  maxVehicles: 20,
  features: [],
  billingInfo: {
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    taxId: '',
  },
  notes: '',
})

watch(() => props.tenant, (newTenant) => {
  if (newTenant) {
    formData.value = { ...newTenant }
    isEdit.value = true
  } else {
    resetForm()
    isEdit.value = false
  }
}, { immediate: true })

const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Suspended', value: 'suspended' },
  { title: 'Trial', value: 'trial' },
]

const planOptions = [
  { title: 'Starter', value: 'starter' },
  { title: 'Professional', value: 'professional' },
  { title: 'Enterprise', value: 'enterprise' },
  { title: 'Custom', value: 'custom' },
]

const featureOptions = [
  { title: 'Basic Analytics', value: 'basic_analytics' },
  { title: 'Advanced Analytics', value: 'advanced_analytics' },
  { title: 'API Access', value: 'api_access' },
  { title: 'Custom Branding', value: 'custom_branding' },
  { title: 'Priority Support', value: 'priority_support' },
  { title: 'White Label', value: 'white_label' },
  { title: 'Multi-location', value: 'multi_location' },
  { title: 'Advanced Reports', value: 'advanced_reports' },
]

const rules = {
  required: (v: any) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
  slug: (v: string) => /^[a-z0-9-]+$/.test(v) || 'Slug must be lowercase alphanumeric with hyphens',
  positive: (v: number) => v > 0 || 'Must be greater than 0',
}

const handleSubmit = async () => {
  const { valid: isValid } = await formRef.value.validate()
  if (isValid) {
    emit('submit', formData.value)
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    slug: '',
    email: '',
    phone: '',
    contactPerson: '',
    domain: '',
    status: 'trial',
    plan: 'starter',
    maxUsers: 5,
    maxVehicles: 20,
    features: [],
    billingInfo: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      taxId: '',
    },
    notes: '',
  }
  formRef.value?.resetValidation()
}
</script>
