<template>
  <CommonPageContainer>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <template v-else-if="location">
      <!-- Header with Breadcrumbs and Actions -->
      <CommonPageDetailPageHeader
        :title="location.name"
        :subtitle="`Location ID: #${location.id} • ${getFullAddress(location)}`"
        :badge="location.status"
        :badge-color="getStatusColor(location.status)"
        show-breadcrumbs
        parent-label="Locations"
        parent-icon="mdi-map-marker"
        :actions="headerActions"
        @back="$router.push('/locations')"
        @action="handleAction"
      />

      <v-row>
        <!-- Left Column: Main Info -->
        <v-col cols="12" lg="8">
          <!-- Location Icon Section -->
          <CommonUiDetailCard class="mb-6">
            <div class="flex items-center gap-6">
              <v-avatar
                :color="location.type === 'main' ? 'primary' : 'info'"
                size="80"
                class="location-avatar"
              >
                <v-icon
                  :icon="location.type === 'main' ? 'mdi-office-building' : 'mdi-map-marker'"
                  size="48"
                />
              </v-avatar>
              <div class="flex-1">
                <h2 class="text-h5 font-bold mb-1">{{ location.name }}</h2>
                <p class="text-body-2 text-medium-emphasis mb-2">
                  {{ getTypeLabel(location.type) }}
                </p>
                <div class="flex items-center gap-2">
                  <v-chip :color="getStatusColor(location.status)" size="small" variant="flat">
                    {{ location.status.toUpperCase() }}
                  </v-chip>
                  <v-chip size="small" variant="tonal" color="primary">
                    <v-icon icon="mdi-garage" start size="14" />
                    {{ location.capacity }} Vehicles
                  </v-chip>
                </div>
              </div>
            </div>
          </CommonUiDetailCard>

          <LocationInfoCard
            :location="location"
            :type-label="getTypeLabel(location.type)"
            :status-color="getStatusColor(location.status)"
            class="mb-6"
          />

          <LocationAddressCard
            :location="location"
            :full-address="getFullAddress(location)"
            class="mb-6"
          />

          <LocationContactCard :location="location" class="mb-6" />
        </v-col>

        <!-- Right Column: Stats & Actions -->
        <v-col cols="12" lg="4">
          <LocationStatsCard :location="location" :format-date="formatDate" class="mb-6" />
        </v-col>
      </v-row>

      <!-- Delete Confirmation Dialog -->
      <CommonDialogDeleteConfirmation
        v-model="deleteDialog"
        title="Delete Location?"
        :item-name="location.name"
        :item-details="`${location.city}, ${location.state}`"
        icon="mdi-map-marker-outline"
        message="This action is permanent and cannot be undone. All location data will be removed."
        :loading="actionLoading"
        @confirm="confirmDelete"
      />

      <CommonUiSnackbar v-model="snackbar" />
    </template>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocationDetails } from '~/composables/useLocationDetails'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const locationId = String(route.params.id)

const {
  location,
  loading,
  deleteDialog,
  actionLoading,
  snackbar,
  loadLocation,
  openDeleteDialog,
  confirmDelete,
  handleEdit,
  getFullAddress,
  getTypeLabel,
  getStatusColor,
} = useLocationDetails(locationId)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const headerActions = computed(() => [
  {
    key: 'edit',
    label: 'Edit',
    icon: 'mdi-pencil',
    color: 'primary',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: 'mdi-delete',
    color: 'error',
  },
])

const handleAction = (key: string) => {
  switch (key) {
    case 'edit':
      handleEdit()
      break
    case 'delete':
      openDeleteDialog()
      break
  }
}

onMounted(() => {
  loadLocation()
})
</script>

<style lang="scss" scoped>
.location-avatar {
  @apply transition-all duration-300;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.customer-avatar {
  @apply transition-all duration-300;
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.18),
    0 0 0 3px rgba(255, 255, 255, 0.1);
}
</style>
