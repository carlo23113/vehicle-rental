<template>
  <section class="hero-section">
    <div class="hero-background">
      <div class="hero-gradient-orb orb-1"></div>
      <div class="hero-gradient-orb orb-2"></div>
      <div class="hero-grid"></div>
    </div>
    <v-container fluid class="px-6 py-16 position-relative">
      <v-row align="center" class="min-height">
        <v-col cols="12" md="6">
          <div class="hero-badge mb-4 fade-in-up" style="animation-delay: 0ms">
            <v-chip color="primary" variant="tonal" size="small" class="px-4">
              <v-icon icon="mdi-star" start size="16"></v-icon>
              Trusted by 5000+ Customers
            </v-chip>
          </div>
          <h1 class="hero-title mb-6 fade-in-up" style="animation-delay: 100ms">
            Drive Your <span class="text-gradient">Dreams</span><br />
            Anywhere, Anytime
          </h1>
          <p class="hero-subtitle mb-8 fade-in-up" style="animation-delay: 200ms">
            Experience premium vehicle rentals with unmatched service. From city cruises to road
            trips, we've got you covered.
          </p>
          <div class="d-flex flex-wrap ga-4 mb-8 fade-in-up" style="animation-delay: 300ms">
            <v-btn
              color="primary"
              size="x-large"
              elevation="0"
              class="rounded-pill px-8 hero-btn hero-btn-primary"
              to="/browse"
            >
              <v-icon icon="mdi-car" start></v-icon>
              Explore Fleet
              <div class="btn-shine"></div>
            </v-btn>
            <v-btn
              variant="outlined"
              size="x-large"
              class="rounded-pill px-8 hero-btn-outline"
              to="/help"
            >
              <v-icon icon="mdi-play-circle" start></v-icon>
              Watch Demo
            </v-btn>
          </div>
          <div
            class="d-flex flex-wrap ga-6 align-center hero-features fade-in-up"
            style="animation-delay: 400ms"
          >
            <div
              class="hero-feature-item"
              v-for="(feature, index) in heroFeatures"
              :key="index"
              :style="{ animationDelay: `${500 + index * 100}ms` }"
            >
              <v-icon icon="mdi-check-circle" size="20" color="success"></v-icon>
              <span class="text-body-2 font-weight-medium">{{ feature }}</span>
            </div>
          </div>

          <!-- Trust Badges -->
          <div
            class="trust-badges d-flex flex-wrap ga-4 mt-8 fade-in-up"
            style="animation-delay: 800ms"
          >
            <div class="trust-badge" v-for="badge in trustBadges" :key="badge.text">
              <v-icon :icon="badge.icon" size="16" :color="badge.color"></v-icon>
              <span class="text-caption">{{ badge.text }}</span>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="text-center position-relative">
          <div class="hero-image-container fade-in" style="animation-delay: 200ms">
            <div class="floating-card card-1">
              <v-card elevation="8" class="pa-4 floating-card-inner" rounded="xl">
                <div class="d-flex align-center ga-3">
                  <v-avatar color="primary" size="40" class="pulse-icon">
                    <v-icon icon="mdi-lightning-bolt" size="24"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">Instant</div>
                    <div class="font-weight-bold">Booking</div>
                  </div>
                </div>
              </v-card>
            </div>
            <div class="floating-card card-2">
              <v-card elevation="8" class="pa-4 floating-card-inner" rounded="xl">
                <div class="d-flex align-center ga-3">
                  <v-avatar color="success" size="40" class="pulse-icon">
                    <v-icon icon="mdi-shield-check" size="24"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">100%</div>
                    <div class="font-weight-bold">Insured</div>
                  </div>
                </div>
              </v-card>
            </div>
            <div class="floating-card card-3">
              <v-card elevation="8" class="pa-4 floating-card-inner" rounded="xl">
                <div class="d-flex align-center ga-3">
                  <v-avatar color="info" size="40" class="pulse-icon">
                    <v-icon icon="mdi-clock-fast" size="24"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">Quick</div>
                    <div class="font-weight-bold">Process</div>
                  </div>
                </div>
              </v-card>
            </div>
            <div class="hero-main-icon">
              <v-icon icon="mdi-car-sports" size="280" color="primary" class="hero-icon"></v-icon>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
const heroFeatures = ['No Hidden Fees', '24/7 Support', 'Best Price Guarantee']

const trustBadges = [
  { icon: 'mdi-shield-check', text: 'Fully Insured', color: 'success' },
  { icon: 'mdi-certificate', text: 'Licensed & Certified', color: 'info' },
  { icon: 'mdi-medal', text: 'Award Winning Service', color: 'warning' },
]
</script>

<style scoped lang="scss">
// Hero section
.hero-section {
  @apply relative min-h-[700px] flex items-center overflow-hidden;
}

// Background
.hero-background {
  @apply absolute inset-0 z-0;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05) 0%,
    rgba(var(--v-theme-secondary), 0.02) 100%
  );
}

// Min height
.min-height {
  @apply min-h-[600px];
}

// Hero title
.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  @apply font-extrabold leading-tight;
  letter-spacing: -0.02em;
}

// Gradient text effect
.text-gradient {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// Hero subtitle
.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  @apply leading-relaxed opacity-80 max-w-[600px];
  color: rgb(var(--v-theme-on-surface));
}

// Background orbs
.hero-gradient-orb {
  @apply absolute rounded-full opacity-60;
  filter: blur(80px);
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  @apply -top-[10%] right-[10%] w-[500px] h-[500px];
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.3) 0%, transparent 70%);
  animation-delay: 0s;
}

.orb-2 {
  @apply -bottom-[15%] -left-[10%] w-[400px] h-[400px];
  background: radial-gradient(circle, rgba(var(--v-theme-secondary), 0.2) 0%, transparent 70%);
  animation-delay: 2s;
}

// Grid background
.hero-grid {
  @apply absolute inset-0 opacity-50;
  background-image:
    linear-gradient(rgba(var(--v-border-color), 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--v-border-color), 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

// Feature items
.hero-feature-item {
  @apply flex items-center gap-2 py-2 px-4 rounded-xl border transition-all duration-300;
  background: rgba(var(--v-theme-success), 0.05);
  border-color: rgba(var(--v-theme-success), 0.1);

  &:hover {
    background: rgba(var(--v-theme-success), 0.1);
    @apply -translate-y-0.5;
  }
}

// Trust badges
.trust-badge {
  @apply flex items-center gap-2 py-1.5 px-3 rounded-lg border transition-all duration-300;
  background: rgba(var(--v-theme-surface), 0.6);
  border-color: rgba(var(--v-border-color), 0.1);

  &:hover {
    background: rgba(var(--v-theme-surface), 1);
    @apply -translate-y-0.5 shadow-md;
  }

  .text-caption {
    @apply font-medium opacity-90;
  }
}

// Hero buttons
.hero-btn {
  @apply normal-case font-semibold tracking-normal transition-all duration-300;
  box-shadow: 0 4px 14px 0 rgba(var(--v-theme-primary), 0.3);

  &:hover {
    box-shadow: 0 6px 20px 0 rgba(var(--v-theme-primary), 0.4);
    @apply -translate-y-0.5;
  }
}

.hero-btn-primary {
  @apply relative overflow-hidden;
}

.hero-btn-outline {
  @apply normal-case font-semibold tracking-normal border-2;
}

// Button shine effect
.btn-shine {
  @apply absolute top-0 left-[-100%] w-1/2 h-full;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: btn-shine-animation 3s infinite;
}

@keyframes btn-shine-animation {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 150%;
  }
}

// Hero image container
.hero-image-container {
  @apply relative min-h-[400px];
}

.hero-main-icon {
  @apply relative z-10;
}

// Hero icon
.hero-icon {
  @apply opacity-20;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(var(--v-theme-primary), 0.3));
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(5deg);
  }
}

// Floating cards
.floating-card {
  @apply absolute z-20;
  animation: floatCard 4s ease-in-out infinite;

  &.card-1 {
    @apply top-[10%] left-0;
    animation-delay: 0s;
  }

  &.card-2 {
    @apply bottom-[15%] right-[20%];
    animation-delay: 1s;
  }

  &.card-3 {
    @apply top-0 right-[5%];
    animation-delay: 2s;
  }

  &:hover .floating-card-inner {
    @apply scale-105;
    border-color: rgba(var(--v-theme-primary), 0.4);
  }
}

.floating-card-inner {
  @apply transition-all duration-300;
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

@keyframes floatCard {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

// Animations
.fade-in-up {
  @apply opacity-0;
  animation: fadeInUp 0.8s ease-out forwards;
}

.fade-in {
  @apply opacity-0;
  animation: fadeIn 1s ease-out forwards;
}

.pulse-icon {
  animation: pulse 2s infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-primary), 0);
  }
}

// Responsive
@media (max-width: 960px) {
  .hero-section {
    @apply min-h-0 py-20;
  }

  .min-height {
    @apply min-h-0;
  }

  .hero-icon {
    font-size: 200px !important;
  }

  .floating-card {
    @apply hidden;
  }

  .hero-title {
    @apply text-center;
  }

  .hero-subtitle {
    @apply text-center mx-auto;
  }
}
</style>
