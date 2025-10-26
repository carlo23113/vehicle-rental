<template>
  <CommonPageContainer>
    <CommonPageDetailPageHeader
      title="Edit User"
      :subtitle="`Update user details for ${form.firstName || 'User'} ${form.lastName || ''}`"
      show-breadcrumbs
      parent-label="Users"
      parent-icon="mdi-account-group"
      @back="$router.push('/owner/users')"
    />

    <v-row>
      <v-col cols="12">
        <CommonFormCard>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <UserFormFields v-model="form" />

            <CommonFormActions
              submit-text="Update User"
              submit-icon="mdi-content-save"
              :loading="loading"
              @cancel="$router.push(`/owner/users/${route.params.id}`)"
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
import { useUserForm } from '~/composables/useUserForm'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const userId = String(route.params.id)

const {
  form,
  formRef,
  loading,
  snackbar,
  handleUpdate,
  loadUserData
} = useUserForm(true)

const handleSubmit = () => handleUpdate(userId)

onMounted(() => {
  loadUserData(userId)
})
</script>
