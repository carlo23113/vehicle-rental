<template>
  <CommonPageContainer>
    <!-- Header Section -->
    <CommonPageHeader
      title="Admin Dashboard"
      subtitle="Manage your multi-tenant SaaS platform"
      icon="mdi-shield-crown"
    />

    <!-- Stats Cards -->
    <TenantsStatsCards
      :total-tenants="tenants.length"
      :active-tenants="activeTenants.length"
      :trial-tenants="trialTenants.length"
      revenue="$24,500"
    />

    <!-- Charts Row -->
    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon start color="primary">mdi-chart-line</v-icon>
            Tenant Growth
          </v-card-title>
          <v-card-text>
            <div class="text-center text-medium-emphasis py-12">
              <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
              <p class="mt-4">Growth chart will be displayed here</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon start color="primary">mdi-chart-donut</v-icon>
            Plan Distribution
          </v-card-title>
          <v-card-text>
            <div class="text-center text-medium-emphasis py-12">
              <v-icon size="64" color="grey-lighten-1">mdi-chart-donut</v-icon>
              <p class="mt-4">Plan chart will be displayed here</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Tenants -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon start color="primary">mdi-office-building</v-icon>
              <span>Recent Tenants</span>
            </div>
            <v-btn color="primary" variant="text" to="/admin/tenants">
              View All
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0">
            <CommonUiDataTable
              :headers="headers"
              :items="recentTenants"
              :loading="false"
              :items-per-page="5"
            >
              <template #item.name="{ item }">
                <div class="py-2">
                  <div class="font-weight-medium">{{ item.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ item.contactPerson }}</div>
                </div>
              </template>

              <template #item.plan="{ item }">
                <CommonUiTableChip :text="item.plan" :color="getPlanColor(item.plan)" />
              </template>

              <template #item.status="{ item }">
                <CommonUiTableChip :text="item.status" :color="getStatusColor(item.status)" />
              </template>

              <template #item.createdAt="{ item }">
                <span class="text-caption">{{ formatDate(item.createdAt) }}</span>
              </template>
            </CommonUiDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTenants } from '~/composables/useTenants'

definePageMeta({
  layout: 'admin',
})

const {
  tenants,
  activeTenants,
  trialTenants,
  getStatusColor,
  getPlanColor,
  formatDate,
  initializeMockData,
} = useTenants()

const recentTenants = computed(() => {
  return tenants.value.slice(0, 5)
})

const headers = [
  { title: 'Tenant', key: 'name', sortable: true },
  { title: 'Plan', key: 'plan', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Created', key: 'createdAt', sortable: true },
]

onMounted(() => {
  initializeMockData()
})
</script>
