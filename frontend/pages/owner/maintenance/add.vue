<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Schedule Maintenance"
      subtitle="Fill in the details to schedule vehicle maintenance"
      show-breadcrumbs
      parent-label="Maintenance"
      parent-icon="mdi-tools"
      @back="$router.push('/owner/maintenance')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleCreate">
            <MaintenanceFormFields v-model="form" />

            <CommonFormActions
              submit-text="Schedule Maintenance"
              submit-icon="mdi-plus"
              :loading="loading"
              @cancel="$router.push('/owner/maintenance')"
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
import { useMaintenanceForm } from '~/composables/useMaintenanceForm'

definePageMeta({ layout: 'default' })

const route = useRoute()

const {
  form,
  formRef,
  loading,
  snackbar,
  handleCreate,
  loadVehicleData
} = useMaintenanceForm()

onMounted(() => {
  const vehicleId = route.query.vehicleId
  if (vehicleId) {
    loadVehicleData(String(vehicleId))
  }
})
</script>
