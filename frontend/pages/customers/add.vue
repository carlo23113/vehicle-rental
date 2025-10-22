<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Add New Customer"
      subtitle="Create a new customer profile for vehicle rentals"
      show-breadcrumbs
      parent-label="Customers"
      parent-icon="mdi-account-group"
      @back="$router.push('/customers')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleCreate">
            <CustomerFormFields v-model="form" />

            <CommonFormActions
              submit-text="Create Customer"
              submit-icon="mdi-account-plus"
              :loading="loading"
              @cancel="$router.push('/customers')"
            />
          </v-form>
        </CommonFormCard>
      </v-col>
    </v-row>

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { useCustomerForm } from '~/composables/useCustomerForm'

definePageMeta({
  layout: 'default',
})

const { form, formRef, loading, snackbar, handleCreate } = useCustomerForm()
</script>
