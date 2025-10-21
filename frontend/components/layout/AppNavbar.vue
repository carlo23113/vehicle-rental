<template>
  <v-app-bar elevation="0" height="72" class="navbar px-4" border="b">
    <v-app-bar-nav-icon
      @click="$emit('toggle-rail')"
      class="nav-toggle"
      variant="text"
    ></v-app-bar-nav-icon>

    <v-app-bar-title class="font-weight-bold text-h6 ml-2">
      {{ pageTitle }}
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Search -->
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      placeholder="Search vehicles, customers..."
      variant="outlined"
      density="compact"
      hide-details
      single-line
      class="search-field mr-4"
      style="max-width: 400px"
    ></v-text-field>

    <!-- Dark Mode Toggle -->
    <v-btn icon variant="text" class="mr-1" @click="toggleDarkMode">
      <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
      <v-tooltip activator="parent" location="bottom">
        {{ isDark ? 'Light Mode' : 'Dark Mode' }}
      </v-tooltip>
    </v-btn>

    <!-- Quick Actions -->
    <v-btn icon variant="text" class="mr-1">
      <v-icon>mdi-plus-circle</v-icon>
      <v-tooltip activator="parent" location="bottom">Quick Add</v-tooltip>
    </v-btn>

    <!-- Notifications -->
    <v-btn icon variant="text" class="mr-1">
      <v-badge content="3" color="error" offset-x="-2" offset-y="-2" dot>
        <v-icon>mdi-bell-outline</v-icon>
      </v-badge>
      <v-tooltip activator="parent" location="bottom">Notifications</v-tooltip>
    </v-btn>

    <!-- User Menu -->
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          class="user-menu-btn px-2"
          rounded="lg"
        >
          <v-avatar color="primary" size="36" class="mr-2 elevation-2">
            <span class="text-subtitle-2 font-weight-bold">{{ userInitials }}</span>
          </v-avatar>
          <div class="d-none d-sm-flex flex-column align-start mr-2">
            <span class="text-body-2 font-weight-medium">{{ userName }}</span>
            <span class="text-caption text-medium-emphasis">{{ userRole }}</span>
          </div>
          <v-icon size="20">mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-list class="user-menu-list" width="240">
        <v-list-item class="px-4 py-3" lines="two">
          <template v-slot:prepend>
            <v-avatar color="primary" size="48">
              <span class="text-h6 font-weight-bold">{{ userInitials }}</span>
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-bold">{{ userName }}</v-list-item-title>
          <v-list-item-subtitle>{{ userEmail }}</v-list-item-subtitle>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item prepend-icon="mdi-account-outline" @click="goToProfile" class="py-2">
          <v-list-item-title>My Profile</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-cog-outline" @click="goToSettings" class="py-2">
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-help-circle-outline" class="py-2">
          <v-list-item-title>Help & Support</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item prepend-icon="mdi-logout" @click="handleLogout" class="py-2 text-error">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useDarkMode } from '~/composables/useDarkMode'

defineEmits<{
  'toggle-rail': []
}>()

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isDark, toggleDarkMode } = useDarkMode()

const search = ref('')

const userName = computed(() => authStore.userName || 'Admin')
const userEmail = computed(() => authStore.user?.email || '')
const userRole = computed(() => {
  const role = authStore.userRole || 'admin'
  return role.charAt(0).toUpperCase() + role.slice(1)
})
const userInitials = computed(() => {
  const name = userName.value.split(' ')
  return name.length > 1
    ? `${name[0][0]}${name[1][0]}`
    : name[0][0]
})

const pageTitle = computed(() => {
  const routeName = route.name as string
  if (routeName) {
    return routeName.charAt(0).toUpperCase() + routeName.slice(1)
  }
  return 'Dashboard'
})

const goToProfile = () => {
  router.push('/profile')
}

const goToSettings = () => {
  router.push('/settings')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface), 0.95) !important;
}

.nav-toggle {
  /* No animation */
}

.search-field {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.search-field:focus-within {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.user-menu-btn {
  transition: all 0.2s ease;
}

.user-menu-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.user-menu-list {
  margin-top: 8px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
</style>
