<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Edit Rental"
      :subtitle="`Update rental details for #${route.params.id}`"
      show-breadcrumbs
      parent-label="Rentals"
      parent-icon="mdi-calendar-check"
      @back="$router.push('/rentals')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <RentalFormFields v-model="form" />

            <CommonFormActions
              submit-text="Update Rental"
              submit-icon="mdi-content-save"
              :loading="loading"
              @cancel="$router.push(`/rentals/${route.params.id}`)"
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
const rentalId = String(route.params.id)

const {
  form,
  formRef,
  loading,
  snackbar,
  handleUpdate,
  loadRentalData
} = useRentalForm(true)

const handleSubmit = () => handleUpdate(rentalId)

onMounted(() => {
  loadRentalData(rentalId)
})
</script>
