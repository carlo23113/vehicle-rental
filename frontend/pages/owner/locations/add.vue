<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Add New Location"
      subtitle="Create a new rental office or service center location"
      show-breadcrumbs
      parent-label="Locations"
      parent-icon="mdi-map-marker"
      @back="$router.push('/owner/locations')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleCreate">
            <LocationFormFields v-model="form" />

            <CommonFormActions
              submit-text="Create Location"
              submit-icon="mdi-plus"
              :loading="loading"
              @cancel="$router.push('/owner/locations')"
            />
          </v-form>
        </CommonFormCard>
      </v-col>
    </v-row>

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { useLocationForm } from '~/composables/useLocationForm'

definePageMeta({
  layout: 'default',
})

const { form, formRef, loading, snackbar, handleCreate } = useLocationForm()
</script>
