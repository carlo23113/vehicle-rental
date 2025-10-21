<template>
  <div class="public-layout">
    <!-- Navigation Bar -->
    <nav class="navbar" :class="{ 'navbar-scrolled': scrollY > 50 }">
      <v-container fluid class="px-6 py-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3 logo-container" @click="navigateTo('/')">
            <div class="logo-icon-wrapper">
              <v-icon icon="mdi-car-electric" size="36" color="primary" class="logo-icon"></v-icon>
            </div>
            <span class="text-h5 font-weight-bold logo-text">VehicleRental</span>
          </div>
          <div class="nav-links d-none d-md-flex align-center ga-6">
            <a href="/#features" class="nav-link" @click.prevent="smoothScroll('#features')">Features</a>
            <a href="/#vehicles" class="nav-link" @click.prevent="smoothScroll('#vehicles')">Vehicles</a>
            <a href="/#how-it-works" class="nav-link" @click.prevent="smoothScroll('#how-it-works')">How It Works</a>
            <a href="/#testimonials" class="nav-link" @click.prevent="smoothScroll('#testimonials')">Testimonials</a>
            <NuxtLink to="/browse" class="nav-link">Browse</NuxtLink>
            <v-btn color="primary" variant="flat" class="rounded-pill nav-btn" to="/login">
              <v-icon icon="mdi-login" start size="20"></v-icon>
              Sign In
            </v-btn>
          </div>
          <v-btn icon variant="text" class="d-md-none">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </div>
      </v-container>
    </nav>

    <!-- Page Content -->
    <main class="public-content">
      <slot />
    </main>

    <!-- Scroll to Top Button -->
    <v-btn
      v-show="scrollY > 400"
      class="scroll-to-top"
      icon
      size="large"
      color="primary"
      elevation="8"
      @click="scrollToTop"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>

    <!-- Footer -->
    <footer class="footer-section">
      <v-container class="py-12">
        <v-row class="mb-8">
          <v-col cols="12" md="4" class="mb-8 mb-md-0">
            <div class="d-flex align-center ga-3 mb-4">
              <v-icon icon="mdi-car-electric" size="36" color="primary"></v-icon>
              <span class="text-h5 font-weight-bold">VehicleRental</span>
            </div>
            <p class="text-body-1 text-medium-emphasis mb-6">
              Your trusted partner for quality vehicle rentals. Drive with confidence, travel with
              ease.
            </p>
            <div class="d-flex ga-3">
              <v-btn icon size="40" variant="tonal" color="primary">
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn icon size="40" variant="tonal" color="primary">
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
              <v-btn icon size="40" variant="tonal" color="primary">
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
              <v-btn icon size="40" variant="tonal" color="primary">
                <v-icon>mdi-linkedin</v-icon>
              </v-btn>
            </div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <h4 class="footer-heading mb-4">Quick Links</h4>
            <ul class="footer-links">
              <li><NuxtLink to="/browse">Browse Vehicles</NuxtLink></li>
              <li><NuxtLink to="/help">Help Center</NuxtLink></li>
              <li><NuxtLink to="/login">Sign In</NuxtLink></li>
            </ul>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <h4 class="footer-heading mb-4">Company</h4>
            <ul class="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <h4 class="footer-heading mb-4">Legal</h4>
            <ul class="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </v-col>
          <v-col cols="6" sm="12" md="2">
            <h4 class="footer-heading mb-4">Contact</h4>
            <ul class="footer-links">
              <li class="mb-3">
                <v-icon icon="mdi-phone" size="16" class="mr-2"></v-icon>
                (555) 123-4567
              </li>
              <li class="mb-3">
                <v-icon icon="mdi-email" size="16" class="mr-2"></v-icon>
                info@rental.com
              </li>
            </ul>
          </v-col>
        </v-row>
        <v-divider class="mb-6"></v-divider>
        <div class="text-center">
          <p class="text-body-2 text-medium-emphasis">
            &copy; {{ currentYear }} VehicleRental. All rights reserved.
          </p>
        </div>
      </v-container>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const scrollY = ref(0)
const currentYear = new Date().getFullYear()

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY
  })
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const smoothScroll = (target: string) => {
  // If we're not on the home page, navigate there first
  if (window.location.pathname !== '/') {
    navigateTo('/' + target)
    return
  }

  const element = document.querySelector(target)
  if (element) {
    const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.public-content {
  flex: 1;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.3s;
}

.navbar-scrolled {
  background: rgba(var(--v-theme-surface), 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-bottom-color: rgba(var(--v-border-color), 0.2);
}

.logo-container {
  cursor: pointer;
}

.logo-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.logo-container:hover .logo-icon-wrapper {
  background: rgba(var(--v-theme-primary), 0.15);
  transform: rotate(-5deg) scale(1.05);
}

.logo-icon {
  transition: transform 0.3s;
}

.logo-text {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-link {
  color: rgb(var(--v-theme-on-surface));
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  position: relative;
  padding: 8px 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: rgb(var(--v-theme-primary));
}

.nav-link:hover::after {
  width: 100%;
}

.nav-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s;
}

.nav-btn:hover {
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4);
  transform: translateY(-2px);
}

/* Scroll to Top Button */
.scroll-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 99;
  animation: fadeInUp 0.3s ease-out;
  transition: all 0.3s;
}

.scroll-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.4) !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Footer */
.footer-section {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.03) 0%,
    rgba(var(--v-theme-secondary), 0.02) 100%
  );
  border-top: 1px solid rgba(var(--v-border-color), 0.1);
  position: relative;
  overflow: hidden;
  margin-top: auto;
}

.footer-heading {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  padding-bottom: 8px;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), transparent);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 0.95rem;
  display: inline-block;
}

.footer-links a:hover {
  opacity: 1;
  color: rgb(var(--v-theme-primary));
  transform: translateX(4px);
}
</style>
