<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Edit Maintenance"
      :subtitle="`Update maintenance details for #${route.params.id}`"
      show-breadcrumbs
      parent-label="Maintenance"
      parent-icon="mdi-wrench"
      @back="$router.push('/maintenance')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <MaintenanceFormFields v-model="form" />

            <CommonFormActions
              submit-text="Update Maintenance"
              submit-icon="mdi-content-save"
              :loading="loading"
              @cancel="$router.push(`/maintenance/${route.params.id}`)"
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

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const maintenanceId = String(route.params.id)

const {
  form,
  formRef,
  loading,
  snackbar,
  handleUpdate,
  loadMaintenanceData,
} = useMaintenanceForm(true)

const handleSubmit = () => handleUpdate(maintenanceId)

onMounted(() => {
  loadMaintenanceData(maintenanceId)
})
</script>
