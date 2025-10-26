<template>
  <CommonPageContainer>
    <CommonPageHeader
      title="Settings"
      subtitle="Manage your account settings and preferences"
    />

    <v-row>
      <!-- Settings Navigation -->
      <v-col cols="12" md="3">
        <v-card elevation="2">
          <v-list density="comfortable" nav>
            <v-list-item
              v-for="item in settingsSections"
              :key="item.value"
              :value="item.value"
              :active="activeSection === item.value"
              @click="handleSectionClick(item.value)"
              rounded="lg"
              class="mb-1"
            >
              <template v-slot:prepend>
                <v-icon>{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Settings Content -->
      <v-col cols="12" md="9">
        <!-- Profile Settings -->
        <v-card v-if="activeSection === 'profile'" elevation="2" class="mb-4">
          <v-card-title class="text-h5 font-weight-bold">
            Profile Information
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveProfile">
              <v-row>
                <v-col cols="12" class="text-center mb-4">
                  <v-avatar size="120" color="primary" class="mb-4">
                    <span class="text-h3 font-weight-bold">{{ userInitials }}</span>
                  </v-avatar>
                  <div>
                    <v-btn color="primary" variant="outlined" size="small">
                      Change Photo
                    </v-btn>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.firstName"
                    label="First Name"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.lastName"
                    label="Last Name"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="profileForm.email"
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="profileForm.phone"
                    label="Phone Number"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="profileForm.bio"
                    label="Bio"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    :loading="saving"
                  >
                    Save Changes
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Application Preferences -->
        <v-card v-if="activeSection === 'preferences'" elevation="2" class="mb-4">
          <v-card-title class="text-h5 font-weight-bold">
            Application Preferences
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-theme-light-dark</v-icon>
                </template>
                <v-list-item-title>Dark Mode</v-list-item-title>
                <v-list-item-subtitle>
                  Enable dark theme across the application
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-switch
                    v-model="preferences.darkMode"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-translate</v-icon>
                </template>
                <v-list-item-title>Language</v-list-item-title>
                <v-list-item-subtitle>
                  Choose your preferred language
                </v-list-item-subtitle>
              </v-list-item>
              <v-col cols="12" md="6" class="px-4">
                <v-select
                  v-model="preferences.language"
                  :items="languages"
                  item-title="label"
                  item-value="value"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>

              <v-divider></v-divider>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>{{ getCurrencyIcon() }}</v-icon>
                </template>
                <v-list-item-title>Currency</v-list-item-title>
                <v-list-item-subtitle>
                  Choose your preferred currency for displaying prices
                </v-list-item-subtitle>
              </v-list-item>
              <v-col cols="12" md="6" class="px-4">
                <v-select
                  v-model="preferences.currency"
                  :items="currencies"
                  item-title="name"
                  item-value="code"
                  variant="outlined"
                  density="comfortable"
                  @update:model-value="updateCurrency"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <span class="text-lg font-bold mr-2">{{ item.raw.symbol }}</span>
                      </template>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item }">
                    <span class="font-bold mr-2">{{ item.raw.symbol }}</span>
                    {{ item.raw.name }} ({{ item.raw.code }})
                  </template>
                </v-select>
              </v-col>

              <v-divider></v-divider>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-clock-outline</v-icon>
                </template>
                <v-list-item-title>Time Format</v-list-item-title>
                <v-list-item-subtitle>
                  Choose 12-hour or 24-hour format
                </v-list-item-subtitle>
              </v-list-item>
              <v-col cols="12" md="6" class="px-4">
                <v-select
                  v-model="preferences.timeFormat"
                  :items="['12-hour', '24-hour']"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>

              <v-divider></v-divider>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-bell-outline</v-icon>
                </template>
                <v-list-item-title>Email Notifications</v-list-item-title>
                <v-list-item-subtitle>
                  Receive email updates about your rentals
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-switch
                    v-model="preferences.emailNotifications"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-cellphone</v-icon>
                </template>
                <v-list-item-title>Push Notifications</v-list-item-title>
                <v-list-item-subtitle>
                  Receive push notifications on your device
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-switch
                    v-model="preferences.pushNotifications"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>
            </v-list>

            <v-card-actions class="px-0 mt-4">
              <v-btn
                color="primary"
                size="large"
                @click="savePreferences"
                :loading="saving"
              >
                Save Preferences
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>

        <!-- Security Settings -->
        <v-card v-if="activeSection === 'security'" elevation="2" class="mb-4">
          <v-card-title class="text-h5 font-weight-bold">
            Security Settings
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="changePassword">
              <v-row>
                <v-col cols="12">
                  <h3 class="text-h6 mb-4">Change Password</h3>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="passwordForm.currentPassword"
                    label="Current Password"
                    type="password"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="passwordForm.newPassword"
                    label="New Password"
                    type="password"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="passwordForm.confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    :loading="saving"
                  >
                    Update Password
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-divider class="my-6"></v-divider>

            <v-row>
              <v-col cols="12">
                <h3 class="text-h6 mb-4">Two-Factor Authentication</h3>
                <v-alert type="info" variant="tonal" class="mb-4">
                  Add an extra layer of security to your account
                </v-alert>

                <v-btn
                  color="primary"
                  variant="outlined"
                  size="large"
                  prepend-icon="mdi-shield-check"
                >
                  Enable 2FA
                </v-btn>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <v-row>
              <v-col cols="12">
                <h3 class="text-h6 mb-4">Active Sessions</h3>
                <v-list>
                  <v-list-item
                    v-for="session in activeSessions"
                    :key="session.id"
                    class="mb-2 border"
                  >
                    <template v-slot:prepend>
                      <v-icon :icon="session.icon" size="36"></v-icon>
                    </template>
                    <v-list-item-title>{{ session.device }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ session.location }} • {{ session.lastActive }}
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <v-btn
                        v-if="!session.current"
                        color="error"
                        variant="text"
                        size="small"
                      >
                        Revoke
                      </v-btn>
                      <v-chip v-else color="success" size="small">Current</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Notifications Settings -->
        <v-card v-if="activeSection === 'notifications'" elevation="2" class="mb-4">
          <v-card-title class="text-h5 font-weight-bold">
            Notification Settings
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-subheader>Rental Notifications</v-list-subheader>

              <v-list-item>
                <v-list-item-title>New Rental Request</v-list-item-title>
                <v-list-item-subtitle>
                  Get notified when a new rental is requested
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.newRental"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Rental Status Updates</v-list-item-title>
                <v-list-item-subtitle>
                  Updates on rental status changes
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.rentalStatus"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-subheader>Maintenance Notifications</v-list-subheader>

              <v-list-item>
                <v-list-item-title>Maintenance Due</v-list-item-title>
                <v-list-item-subtitle>
                  Alerts when vehicle maintenance is due
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.maintenanceDue"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Maintenance Completed</v-list-item-title>
                <v-list-item-subtitle>
                  Notification when maintenance is completed
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.maintenanceCompleted"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-subheader>Payment Notifications</v-list-subheader>

              <v-list-item>
                <v-list-item-title>Payment Received</v-list-item-title>
                <v-list-item-subtitle>
                  Confirmation when payment is received
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.paymentReceived"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>
            </v-list>

            <v-card-actions class="px-0 mt-4">
              <v-btn
                color="primary"
                size="large"
                @click="saveNotifications"
                :loading="saving"
              >
                Save Notification Settings
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useDarkMode } from '~/composables/useDarkMode'
import { useCurrency } from '~/composables/useCurrency'

const router = useRouter()
const authStore = useAuthStore()
const { isDark, setDarkMode } = useDarkMode()
const { currencies, selectedCurrency, setCurrency, getCurrencyIcon } = useCurrency()

const activeSection = ref('profile')
const saving = ref(false)

const handleSectionClick = (value: string) => {
  if (value === 'contract') {
    router.push('/settings/contract-editor')
  } else {
    activeSection.value = value
  }
}

const userInitials = computed(() => {
  const name = authStore.userName?.split(' ') || ['A']
  return name.length > 1
    ? `${name[0][0]}${name[1][0]}`
    : name[0][0]
})

const settingsSections = ref([
  { title: 'Profile', value: 'profile', icon: 'mdi-account-outline' },
  { title: 'Preferences', value: 'preferences', icon: 'mdi-cog-outline' },
  { title: 'Security', value: 'security', icon: 'mdi-shield-lock-outline' },
  { title: 'Notifications', value: 'notifications', icon: 'mdi-bell-outline' },
  { title: 'Contract Template', value: 'contract', icon: 'mdi-file-document-edit-outline' },
])

// Profile Form
const profileForm = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'admin@vehiclerental.com',
  phone: '+1 234 567 8900',
  bio: 'Vehicle rental manager with 5 years of experience.',
})

// Preferences - Use computed for darkMode to sync with isDark
const preferences = ref({
  darkMode: isDark.value,
  language: 'en',
  currency: selectedCurrency.value.code,
  timeFormat: '12-hour',
  emailNotifications: true,
  pushNotifications: true,
})

// Sync preferences.darkMode with isDark on mount and when isDark changes
watch(isDark, (newValue) => {
  preferences.value.darkMode = newValue
})

// Watch for dark mode changes from the toggle
watch(() => preferences.value.darkMode, (newValue) => {
  setDarkMode(newValue)
})

const languages = ref([
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
])

// Password Form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Active Sessions
const activeSessions = ref([
  {
    id: 1,
    device: 'MacBook Pro',
    location: 'San Francisco, CA',
    lastActive: 'Active now',
    icon: 'mdi-laptop',
    current: true,
  },
  {
    id: 2,
    device: 'iPhone 13',
    location: 'San Francisco, CA',
    lastActive: '2 hours ago',
    icon: 'mdi-cellphone',
    current: false,
  },
])

// Notifications
const notifications = ref({
  newRental: true,
  rentalStatus: true,
  maintenanceDue: true,
  maintenanceCompleted: false,
  paymentReceived: true,
})

const saveProfile = async () => {
  saving.value = true
  // TODO: Implement API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  saving.value = false
  // Show success message
}

const savePreferences = async () => {
  saving.value = true
  // TODO: Implement API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  saving.value = false
  // Show success message
}

const changePassword = async () => {
  saving.value = true
  // TODO: Implement API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  saving.value = false
  // Show success message
}

const saveNotifications = async () => {
  saving.value = true
  // TODO: Implement API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  saving.value = false
  // Show success message
}

const updateCurrency = (currencyCode: string) => {
  const currency = currencies.find(c => c.code === currencyCode)
  if (currency) {
    setCurrency(currency)
  }
}
</script>

<style scoped>
.border {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
}
</style>
