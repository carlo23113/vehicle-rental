<template>
  <v-menu offset="8">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="flat"
        class="user-menu-btn"
        rounded="xl"
        height="56"
      >
        <v-avatar color="primary" size="40" class="avatar-glow">
          <span class="text-subtitle-2 font-weight-bold">{{ userInitials }}</span>
        </v-avatar>
        <div class="d-none d-sm-flex flex-column align-start mx-3">
          <span class="text-body-2 font-weight-bold user-name">{{ userName }}</span>
          <span class="text-caption user-role">{{ userRole }}</span>
        </div>
        <v-icon size="20">mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list class="user-menu-list" width="280">
      <v-list-item class="user-info-item">
        <template v-slot:prepend>
          <v-avatar color="primary" size="56" class="avatar-large">
            <span class="text-h5 font-weight-bold">{{ userInitials }}</span>
          </v-avatar>
        </template>
        <v-list-item-title class="text-h6 font-weight-bold mb-1">{{ userName }}</v-list-item-title>
        <v-list-item-subtitle class="text-body-2">{{ userEmail }}</v-list-item-subtitle>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item prepend-icon="mdi-account-outline" @click="goToProfile" class="menu-item">
        <v-list-item-title>My Profile</v-list-item-title>
      </v-list-item>
      <v-list-item prepend-icon="mdi-cog-outline" @click="goToSettings" class="menu-item">
        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item>
      <v-list-item prepend-icon="mdi-help-circle-outline" class="menu-item">
        <v-list-item-title>Help & Support</v-list-item-title>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item prepend-icon="mdi-logout" @click="handleLogout" class="menu-item logout-item">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

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

const goToProfile = () => {
  router.push('/profile')
}

const goToSettings = () => {
  router.push('/owner/settings')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.user-menu-btn {
  background: rgba(var(--v-theme-primary), 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 12px 0 8px;
}

.user-menu-btn:hover {
  background: rgba(var(--v-theme-primary), 0.12);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.15);
}

.avatar-glow {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3),
              0 0 0 3px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.user-menu-btn:hover .avatar-glow {
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4),
              0 0 0 3px rgba(var(--v-theme-primary), 0.2);
}

.user-name {
  color: rgb(var(--v-theme-on-surface));
}

.user-role {
  color: rgba(var(--v-theme-on-surface), 0.6);
  text-transform: capitalize;
}

.user-menu-list {
  margin-top: 12px;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-border-color), 0.08);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(20px);
  background: rgba(var(--v-theme-surface), 0.98);
}

.user-info-item {
  padding: 20px !important;
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 0.04) 0%,
    rgba(var(--v-theme-secondary), 0.02) 100%);
}

.avatar-large {
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.3);
}

.menu-item {
  margin: 4px 8px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}

.logout-item {
  color: rgb(var(--v-theme-error));
}

.logout-item:hover {
  background: rgba(var(--v-theme-error), 0.08);
}
</style>
