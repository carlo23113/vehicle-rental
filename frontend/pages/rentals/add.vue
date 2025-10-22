<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Create New Rental"
      subtitle="Fill in the details to create a new rental booking"
      show-breadcrumbs
      parent-label="Rentals"
      parent-icon="mdi-calendar-check"
      @back="$router.push('/rentals')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleCreate">
            <RentalFormFields v-model="form" />

            <CommonFormActions
              submit-text="Create Rental"
              submit-icon="mdi-plus"
              :loading="loading"
              @cancel="$router.push('/rentals')"
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
import { useRentalForm } from '~/composables/useRentalForm'

const route = useRoute()

const {
  form,
  formRef,
  loading,
  snackbar,
  handleCreate,
  loadCustomerData
} = useRentalForm()

onMounted(() => {
  const customerId = route.query.customerId
  if (customerId) {
    loadCustomerData(String(customerId))
  }
})
</script>
