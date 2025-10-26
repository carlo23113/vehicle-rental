<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Edit Location"
      :subtitle="`Update location details for #${route.params.id}`"
      show-breadcrumbs
      parent-label="Locations"
      parent-icon="mdi-map-marker"
      @back="$router.push('/owner/locations')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <LocationFormFields v-model="form" />

            <CommonFormActions
              submit-text="Update Location"
              submit-icon="mdi-content-save"
              :loading="loading"
              @cancel="$router.push(`/owner/locations/${route.params.id}`)"
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
import { useLocationForm } from '~/composables/useLocationForm'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const locationId = String(route.params.id)

const {
  form,
  formRef,
  loading,
  snackbar,
  handleUpdate,
  loadLocationData
} = useLocationForm(true)

const handleSubmit = () => handleUpdate(locationId)

onMounted(() => {
  loadLocationData(locationId)
})
</script>
