<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Add New User"
      subtitle="Create a new system user account"
      show-breadcrumbs
      parent-label="Users"
      parent-icon="mdi-account-group"
      @back="$router.push('/users')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <UserFormFields v-model="form" />

            <CommonFormActions
              submit-text="Create User"
              submit-icon="mdi-account-plus"
              :loading="loading"
              @cancel="$router.push('/users')"
            />
          </v-form>
        </CommonFormCard>
      </v-col>
    </v-row>

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { useUserForm } from '~/composables/useUserForm'

definePageMeta({
  layout: 'default',
})

const {
  form,
  formRef,
  loading,
  snackbar,
  handleCreate
} = useUserForm(false)

const handleSubmit = () => handleCreate()
</script>
