<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <!-- Left side - Branding -->
      <v-col
        cols="12"
        md="6"
        class="d-none d-md-flex align-center justify-center bg-primary"
      >
        <div class="text-center pa-8">
          <v-icon size="120" color="white" class="mb-6"
            >mdi-car-multiple</v-icon
          >
          <h1 class="text-h3 text-white font-weight-bold mb-4">
            Vehicle Rental Management
          </h1>
          <p class="text-h6 text-white opacity-90">
            Streamline your fleet operations with our comprehensive management
            system
          </p>
        </div>
      </v-col>

      <!-- Right side - Login form -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center">
        <v-card flat max-width="450" width="100%" class="pa-4">
          <v-card-text>
            <div class="text-center mb-8">
              <v-icon size="60" color="primary" class="mb-4"
                >mdi-shield-account</v-icon
              >
              <h2 class="text-h4 font-weight-bold mb-2">Welcome Back</h2>
              <p class="text-body-1 text-medium-emphasis">
                Sign in to your account to continue
              </p>
            </div>

            <v-form
              ref="loginForm"
              v-model="formValid"
              @submit.prevent="handleLogin"
            >
              <v-text-field
                v-model="email"
                label="Email Address"
                type="email"
                variant="outlined"
                prepend-inner-icon="mdi-email-outline"
                :rules="emailRules"
                :disabled="loading"
                required
                class="mb-4"
              />

              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="passwordRules"
                :disabled="loading"
                required
                class="mb-2"
                @click:append-inner="showPassword = !showPassword"
              />

              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox
                  v-model="rememberMe"
                  label="Remember me"
                  density="compact"
                  hide-details
                  :disabled="loading"
                />
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  :disabled="loading"
                >
                  Forgot Password?
                </v-btn>
              </div>

              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                closable
                class="mb-4"
                @click:close="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!formValid || loading"
                class="mb-4"
              >
                Sign In
              </v-btn>

              <div class="text-center">
                <span class="text-body-2 text-medium-emphasis"
                  >Don't have an account?</span
                >
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  :disabled="loading"
                >
                  Sign Up
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: false
});

const authStore = useAuthStore();

const loginForm = ref();
const formValid = ref(false);
const email = ref("admin@vehiclerental.com");
const password = ref("admin123");
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid"
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 6 || "Password must be at least 6 characters"
];

const handleLogin = async () => {
  if (!formValid.value) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    await authStore.login({ email: email.value, password: password.value });
    await navigateTo("/owner/dashboard");
  } catch (error: any) {
    errorMessage.value =
      error.message || "Invalid email or password. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
