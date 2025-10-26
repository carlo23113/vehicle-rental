<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Edit Customer"
      :subtitle="`Update customer details for #${route.params.id}`"
      show-breadcrumbs
      parent-label="Customers"
      parent-icon="mdi-account-group"
      @back="$router.push('/owner/customers')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <CustomerFormFields v-model="form" />

            <CommonFormActions
              submit-text="Update Customer"
              submit-icon="mdi-content-save"
              :loading="loading"
              @cancel="$router.push(`/owner/customers/${route.params.id}`)"
            />
          </v-form>
        </CommonFormCard>
      </v-col>
    </v-row>

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCustomerForm } from '~/composables/useCustomerForm'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const customerId = String(route.params.id)

const {
  form,
  formRef,
  loading,
  snackbar,
  handleUpdate,
  loadCustomerData
} = useCustomerForm(true)

const handleSubmit = () => handleUpdate(customerId)

onMounted(() => {
  loadCustomerData(customerId)
})
</script>
