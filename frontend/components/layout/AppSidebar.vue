<template>
  <v-navigation-drawer
    :rail="rail"
    permanent
    :width="200"
    :rail-width="55"
    elevation="2"
    class="sidebar"
    style="z-index: 1004 !important"
  >
    <!-- Logo / Header -->
    <div class="sidebar-header pa-4" :class="{ 'rail-header': rail }">
      <v-avatar :size="30" color="primary" class="logo-avatar elevation-3">
        <v-icon :size="20" color="white">mdi-car-multiple</v-icon>
      </v-avatar>
      <transition name="fade">
        <div v-if="!rail" class="logo-text ml-3">
          <h3 class="font-weight-bold text-primary">VehicleRent</h3>
        </div>
      </transition>
    </div>

    <v-divider class="mx-3"></v-divider>

    <!-- Navigation Items -->
    <v-list density="compact" nav class="pa-2">
      <div v-if="!rail" class="text-xs text-medium-emphasis px-3 mb-2 mt-2 font-weight-medium">
        MAIN MENU
      </div>
      <v-list-item
        v-for="item in navigationItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="rail ? undefined : item.title"
        :value="item.value"
        :to="item.to"
        color="primary"
        rounded="lg"
        class="nav-item mb-1"
      >
        <template v-slot:prepend>
          <v-icon :size="18">{{ item.icon }}</v-icon>
        </template>
        <template v-if="item.badge && !rail" v-slot:append>
          <v-chip
            :color="item.badgeColor || 'error'"
            size="x-small"
            variant="flat"
            class="badge-chip"
          >
            {{ item.badge }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="mx-3 my-2"></v-divider>

    <!-- Settings & Support -->
    <v-list density="compact" nav class="pa-2">
      <div v-if="!rail" class="text-xs text-medium-emphasis px-3 mb-2 font-weight-medium">
        OTHERS
      </div>
      <v-list-item
        v-for="item in secondaryItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="rail ? undefined : item.title"
        :value="item.value"
        :to="item.to"
        rounded="lg"
        class="nav-item mb-1"
      >
        <template v-slot:prepend>
          <v-icon :size="18">{{ item.icon }}</v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  rail: boolean
}>()

// Navigation items
const navigationItems = ref([
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    value: 'dashboard',
    to: '/dashboard',
  },
  {
    title: 'Vehicles',
    icon: 'mdi-car-multiple',
    value: 'vehicles',
    to: '/vehicles',
  },
  {
    title: 'Rentals',
    icon: 'mdi-key-variant',
    value: 'rentals',
    to: '/rentals',
    badge: '3',
    badgeColor: 'primary',
  },
  {
    title: 'Customers',
    icon: 'mdi-account-group',
    value: 'customers',
    to: '/customers',
  },
  {
    title: 'Reservations',
    icon: 'mdi-calendar-clock',
    value: 'reservations',
    to: '/reservations',
  },
  {
    title: 'Maintenance',
    icon: 'mdi-tools',
    value: 'maintenance',
    to: '/maintenance',
    badge: '8',
    badgeColor: 'warning',
  },
  {
    title: 'Reports',
    icon: 'mdi-chart-line',
    value: 'reports',
    to: '/reports',
  },
  {
    title: 'Payments',
    icon: 'mdi-credit-card-outline',
    value: 'payments',
    to: '/payments',
  },
  {
    title: 'Users',
    icon: 'mdi-account-cog',
    value: 'users',
    to: '/users',
  },
  {
    title: 'Roles & Permissions',
    icon: 'mdi-shield-account',
    value: 'roles',
    to: '/roles',
  },
])

const secondaryItems = ref([
  {
    title: 'Settings',
    icon: 'mdi-cog-outline',
    value: 'settings',
    to: '/settings',
  },
  {
    title: 'Help & Support',
    icon: 'mdi-help-circle-outline',
    value: 'help',
    to: '/help',
  },
])
</script>

<style scoped>
.sidebar {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.sidebar-header {
  display: flex;
  align-items: center;
  min-height: 72px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-header.rail-header {
  justify-content: center;
  padding: 1rem 0.5rem !important;
}

.logo-avatar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
}

.logo-text {
  transition: opacity 0.2s ease;
}

.nav-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
}

.nav-item :deep(.v-list-item__prepend) {
  margin-inline-end: 4px !important;
}

.nav-item :deep(.v-list-item__prepend > .v-list-item__spacer) {
  width: 4px !important;
}

.nav-item:hover {
  transform: translateX(4px);
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.nav-item.v-list-item--active {
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-primary), 0.15) 0%,
    rgba(var(--v-theme-primary), 0.05) 100%
  );
  border-left: 3px solid rgb(var(--v-theme-primary));
  font-weight: 600;
}

.badge-chip {
  font-weight: 700;
  font-size: 0.7rem;
  height: 20px;
  min-width: 20px;
  padding: 0 6px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
