<template>
  <div class="landing-page">
    <!-- Hero Section -->
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

    <!-- Stats Section -->
    <section class="stats-section py-16">
      <div class="stats-bg-pattern"></div>
      <v-container class="position-relative">
        <div class="stats-wrapper">
          <v-row class="stats-grid align-center">
            <v-col cols="6" sm="6" md="3" v-for="(stat, index) in stats" :key="stat.label">
              <div class="stat-card fade-in-up" :style="{ animationDelay: `${index * 100}ms` }">
                <div class="stat-icon-wrapper mb-4">
                  <div class="stat-icon-bg" :class="`stat-icon-${stat.color}`">
                    <v-icon :icon="stat.icon" size="32" :color="stat.color"></v-icon>
                  </div>
                </div>
                <h3 class="stat-value mb-2">
                  <span class="counter">{{ stat.value }}</span>
                </h3>
                <p class="stat-label">{{ stat.label }}</p>
              </div>
              <v-divider
                v-if="index < stats.length - 1"
                vertical
                class="stat-divider d-none d-md-block"
              ></v-divider>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section py-20">
      <div class="features-bg-gradient"></div>
      <v-container class="position-relative">
        <div class="text-center mb-16">
          <div class="section-badge mb-4">
            <v-chip color="primary" variant="tonal" size="small" class="px-4 badge-bounce">
              <v-icon icon="mdi-star-four-points" start size="14"></v-icon>
              Features
            </v-chip>
          </div>
          <h2 class="section-title mb-4">Why Choose Us</h2>
          <p class="section-subtitle">Everything you need for a perfect rental experience</p>
          <div class="section-underline"></div>
        </div>
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="(feature, index) in features" :key="feature.title">
            <div
              class="feature-card-modern fade-in-up"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="feature-number">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="feature-icon-container mb-6">
                <div
                  class="feature-icon-bg"
                  :style="{ background: `rgba(var(--v-theme-${feature.color}), 0.1)` }"
                >
                  <v-icon :icon="feature.icon" size="32" :color="feature.color"></v-icon>
                </div>
              </div>
              <h3 class="feature-title mb-3">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
              <div class="feature-arrow">
                <v-icon icon="mdi-arrow-right" size="20" :color="feature.color"></v-icon>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Featured Vehicles Section -->
    <section id="vehicles" class="featured-vehicles-section py-20">
      <div class="vehicles-bg-circles"></div>
      <v-container class="position-relative">
        <div class="text-center mb-16">
          <div class="section-badge mb-4">
            <v-chip color="primary" variant="tonal" size="small" class="px-4"> Our Fleet </v-chip>
          </div>
          <h2 class="section-title mb-4">Featured Vehicles</h2>
          <p class="section-subtitle">Discover our most popular and premium rentals</p>
        </div>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="(vehicle, index) in featuredVehicles"
            :key="vehicle.id"
          >
            <div class="vehicle-card-wrapper fade-in-up" :style="{ animationDelay: `${index * 100}ms` }">
              <ListingVehicleCard :vehicle="vehicle" @select="goToBrowse" @book="goToBrowse" />
            </div>
          </v-col>
        </v-row>
        <div class="text-center mt-12">
          <v-btn
            color="primary"
            size="x-large"
            variant="flat"
            class="rounded-pill px-8 view-all-btn"
            to="/browse"
          >
            View All Vehicles
            <v-icon icon="mdi-arrow-right" end class="arrow-slide"></v-icon>
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="how-it-works-section py-20">
      <div class="how-it-works-bg"></div>
      <v-container class="position-relative">
        <div class="text-center mb-16">
          <div class="section-badge mb-4">
            <v-chip color="primary" variant="tonal" size="small" class="px-4">
              Simple Process
            </v-chip>
          </div>
          <h2 class="section-title mb-4">How It Works</h2>
          <p class="section-subtitle">Get on the road in just three simple steps</p>
        </div>
        <v-row class="steps-container">
          <v-col cols="12" md="4" v-for="(step, index) in steps" :key="step.title" class="step-col">
            <div v-if="index < steps.length - 1" class="step-connector d-none d-md-block"></div>
            <div
              class="step-card-modern fade-in-up"
              :style="{ animationDelay: `${index * 150}ms` }"
            >
              <div class="step-number-badge mb-6">
                <div class="step-number-circle">
                  <span class="step-number-text">{{ index + 1 }}</span>
                </div>
                <div class="step-pulse"></div>
              </div>
              <div class="step-icon-wrapper mb-4">
                <v-icon :icon="step.icon" size="56" color="primary"></v-icon>
              </div>
              <h3 class="step-title mb-3">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="testimonials-section py-20">
      <div class="testimonials-bg-mesh"></div>
      <v-container class="position-relative">
        <div class="text-center mb-16">
          <div class="section-badge mb-4">
            <v-chip color="primary" variant="tonal" size="small" class="px-4">
              Testimonials
            </v-chip>
          </div>
          <h2 class="section-title mb-4">What Our Customers Say</h2>
          <p class="section-subtitle">Real experiences from our satisfied customers</p>
        </div>
        <v-row>
          <v-col cols="12" md="4" v-for="(testimonial, index) in testimonials" :key="index">
            <div
              class="testimonial-card fade-in-up"
              :style="{ animationDelay: `${index * 150}ms` }"
            >
              <div class="testimonial-quote-icon">
                <v-icon
                  icon="mdi-format-quote-open"
                  size="32"
                  color="primary"
                  class="quote-icon"
                ></v-icon>
              </div>
              <div class="testimonial-rating mb-4">
                <v-icon v-for="i in 5" :key="i" icon="mdi-star" size="18" color="warning"></v-icon>
              </div>
              <p class="testimonial-text mb-6">"{{ testimonial.text }}"</p>
              <div class="d-flex align-center ga-3">
                <v-avatar :color="testimonial.avatarColor" size="48">
                  <span class="text-h6 font-weight-bold">{{ testimonial.initials }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-bold">{{ testimonial.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ testimonial.role }}</div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="faq-section py-20">
      <v-container>
        <div class="text-center mb-16">
          <div class="section-badge mb-4">
            <v-chip color="primary" variant="tonal" size="small" class="px-4">
              <v-icon icon="mdi-help-circle" start size="14"></v-icon>
              FAQ
            </v-chip>
          </div>
          <h2 class="section-title mb-4">Frequently Asked Questions</h2>
          <p class="section-subtitle">Find answers to common questions</p>
        </div>
        <v-row align="center" justify="center">
          <v-col cols="12" lg="8">
            <v-expansion-panels variant="accordion" class="faq-panels">
              <v-expansion-panel v-for="(faq, index) in faqs" :key="index" class="faq-panel">
                <v-expansion-panel-title class="faq-question">
                  <div class="d-flex align-center ga-3">
                    <v-icon :icon="faq.icon" :color="faq.color" size="24"></v-icon>
                    <span class="font-weight-bold">{{ faq.question }}</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="faq-answer">
                  {{ faq.answer }}
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section py-16">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" lg="6">
            <div class="newsletter-card">
              <div class="d-flex align-center ga-4 mb-6">
                <v-avatar size="64" color="primary" class="newsletter-icon">
                  <v-icon icon="mdi-email-newsletter" size="32"></v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h5 font-weight-bold mb-2">Subscribe to Our Newsletter</h3>
                  <p class="text-body-2 text-medium-emphasis">
                    Get exclusive deals and updates delivered to your inbox
                  </p>
                </div>
              </div>
              <div class="d-flex flex-wrap ga-3">
                <v-text-field
                  placeholder="Enter your email address"
                  variant="outlined"
                  density="comfortable"
                  class="flex-grow-1 newsletter-input"
                  hide-details
                  prepend-inner-icon="mdi-email-outline"
                ></v-text-field>
                <v-btn color="primary" size="large" class="rounded-pill px-8 newsletter-btn">
                  Subscribe
                  <v-icon icon="mdi-send" end></v-icon>
                </v-btn>
              </div>
              <div class="d-flex align-center ga-4 mt-4">
                <v-icon icon="mdi-lock-outline" size="16" color="success"></v-icon>
                <span class="text-caption text-medium-emphasis"
                  >We respect your privacy. Unsubscribe anytime.</span
                >
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-20">
      <v-container>
        <div class="cta-card-modern">
          <div class="cta-background">
            <div class="cta-pattern"></div>
            <div class="cta-particles">
              <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
            </div>
          </div>
          <div class="cta-content">
            <div class="cta-icon mb-6">
              <v-icon icon="mdi-steering" size="64" color="white" class="cta-icon-spin"></v-icon>
            </div>
            <h2 class="cta-title mb-4">Ready to Hit the Road?</h2>
            <p class="cta-subtitle mb-10">
              Join thousands of satisfied customers. Book your perfect vehicle today and start your
              adventure.
            </p>
            <div class="d-flex justify-center flex-wrap ga-4">
              <v-btn
                color="white"
                size="x-large"
                elevation="0"
                class="rounded-pill px-8 cta-btn-primary"
                to="/browse"
              >
                <v-icon icon="mdi-car-key" start></v-icon>
                Get Started Now
              </v-btn>
              <v-btn
                variant="outlined"
                color="white"
                size="x-large"
                class="rounded-pill px-8 cta-btn-secondary"
                to="/help"
              >
                Contact Support
                <v-icon icon="mdi-arrow-right" end></v-icon>
              </v-btn>
            </div>
            <div class="d-flex justify-center flex-wrap ga-8 mt-8 cta-stats">
              <div class="cta-stat-item" v-for="(stat, index) in ctaStats" :key="index">
                <div class="cta-stat-value">{{ stat.value }}</div>
                <div class="cta-stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVehicles } from '~/composables/useVehicles'

definePageMeta({
  layout: 'public',
})

const router = useRouter()
const { vehicles } = useVehicles()

const stats = [
  { value: '150+', label: 'Vehicles', icon: 'mdi-car-multiple', color: 'primary' },
  { value: '5000+', label: 'Happy Customers', icon: 'mdi-account-group', color: 'success' },
  { value: '10+', label: 'Years Experience', icon: 'mdi-shield-check', color: 'info' },
  { value: '24/7', label: 'Support', icon: 'mdi-headset', color: 'warning' },
]

const features = [
  {
    title: 'Wide Selection',
    description:
      'Choose from our extensive fleet of well-maintained vehicles, from economy to luxury.',
    icon: 'mdi-car-multiple',
    color: 'primary',
  },
  {
    title: 'Competitive Pricing',
    description: 'Get the best rates in the market with transparent pricing and no hidden fees.',
    icon: 'mdi-currency-usd',
    color: 'success',
  },
  {
    title: 'Easy Booking',
    description: 'Book your vehicle in minutes with our simple and intuitive online platform.',
    icon: 'mdi-calendar-check',
    color: 'info',
  },
  {
    title: 'Flexible Terms',
    description: 'Rent by the day, week, or month. Modify or cancel your booking anytime.',
    icon: 'mdi-clock-outline',
    color: 'warning',
  },
  {
    title: '24/7 Support',
    description: 'Our dedicated support team is always here to help you with any questions.',
    icon: 'mdi-headset',
    color: 'error',
  },
  {
    title: 'Quality Assured',
    description: 'All vehicles are regularly maintained and inspected for your safety and comfort.',
    icon: 'mdi-shield-check',
    color: 'secondary',
  },
]

const steps = [
  {
    title: 'Choose Your Vehicle',
    description: 'Browse our fleet and select the perfect vehicle for your needs.',
    icon: 'mdi-car-search',
  },
  {
    title: 'Book Online',
    description: 'Complete your reservation in minutes with our easy booking process.',
    icon: 'mdi-calendar-check',
  },
  {
    title: 'Hit the Road',
    description: 'Pick up your vehicle and enjoy your journey with peace of mind.',
    icon: 'mdi-road-variant',
  },
]

const heroFeatures = ['No Hidden Fees', '24/7 Support', 'Best Price Guarantee']

const trustBadges = [
  { icon: 'mdi-shield-check', text: 'Fully Insured', color: 'success' },
  { icon: 'mdi-certificate', text: 'Licensed & Certified', color: 'info' },
  { icon: 'mdi-medal', text: 'Award Winning Service', color: 'warning' },
]

const testimonials = [
  {
    text: 'Amazing service! The booking process was seamless and the car was in perfect condition. Highly recommend for anyone looking for reliable vehicle rentals.',
    name: 'Sarah Johnson',
    role: 'Business Executive',
    initials: 'SJ',
    avatarColor: 'primary',
  },
  {
    text: "Best rental experience I've had. Great selection of vehicles, transparent pricing, and excellent customer support. Will definitely use again!",
    name: 'Michael Chen',
    role: 'Travel Blogger',
    initials: 'MC',
    avatarColor: 'success',
  },
  {
    text: 'Professional and efficient service. The 24/7 support team was incredibly helpful when I had questions. Five stars all the way!',
    name: 'Emily Davis',
    role: 'Photographer',
    initials: 'ED',
    avatarColor: 'info',
  },
]

const ctaStats = [
  { value: '150+', label: 'Vehicles' },
  { value: '5000+', label: 'Happy Customers' },
  { value: '24/7', label: 'Support' },
]

const faqs = [
  {
    question: 'What documents do I need to rent a vehicle?',
    answer:
      "You will need a valid driver's license, a credit card in your name, and proof of insurance. For international customers, an International Driving Permit (IDP) may also be required.",
    icon: 'mdi-card-account-details',
    color: 'primary',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'We offer free cancellation up to 24 hours before your scheduled pickup time. Cancellations made within 24 hours may be subject to a fee. Please check your booking confirmation for specific details.',
    icon: 'mdi-calendar-remove',
    color: 'success',
  },
  {
    question: 'Are there any additional fees?',
    answer:
      'Our pricing is transparent with no hidden fees. Additional costs may include optional extras like GPS, child seats, or additional drivers. Fuel charges apply based on the fuel policy selected at booking.',
    icon: 'mdi-cash-multiple',
    color: 'info',
  },
  {
    question: 'Can I extend my rental period?',
    answer:
      'Yes, you can extend your rental period subject to vehicle availability. Please contact our support team at least 24 hours before your scheduled return time to arrange an extension.',
    icon: 'mdi-clock-plus',
    color: 'warning',
  },
  {
    question: 'What happens if the vehicle breaks down?',
    answer:
      'All our vehicles come with 24/7 roadside assistance. In case of a breakdown, call our emergency hotline immediately, and we will arrange for repairs or a replacement vehicle at no additional cost.',
    icon: 'mdi-car-wrench',
    color: 'error',
  },
  {
    question: 'Do you offer delivery and pickup services?',
    answer:
      'Yes, we offer convenient delivery and pickup services at select locations. Additional fees may apply based on distance. Please contact us when making your reservation to arrange this service.',
    icon: 'mdi-truck-delivery',
    color: 'secondary',
  },
]

const featuredVehicles = computed(() => {
  return vehicles.value.filter(v => v.status === 'available').slice(0, 3)
})

const goToBrowse = () => {
  router.push('/browse')
}

const getParticleStyle = (_index: number) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomDelay = Math.random() * 5
  const randomDuration = 10 + Math.random() * 10
  return {
    left: `${randomX}%`,
    top: `${randomY}%`,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`,
  }
}
</script>

<style scoped>
.landing-page {
  background: rgb(var(--v-theme-background));
  overflow-x: hidden;
}

/* Animations */
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

.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.fade-in {
  animation: fadeIn 1s ease-out forwards;
  opacity: 0;
}

.pulse-icon {
  animation: pulse 2s infinite;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 700px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05) 0%,
    rgba(var(--v-theme-secondary), 0.02) 100%
  );
  z-index: 0;
}

.hero-gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  top: -10%;
  right: 10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.3) 0%, transparent 70%);
  animation-delay: 0s;
}

.orb-2 {
  bottom: -15%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(var(--v-theme-secondary), 0.2) 0%, transparent 70%);
  animation-delay: 2s;
}

.hero-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(var(--v-border-color), 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--v-border-color), 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
}

.min-height {
  min-height: 600px;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

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

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.6;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
  max-width: 600px;
}

.hero-features {
  gap: 1.5rem;
}

.hero-feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 16px;
  background: rgba(var(--v-theme-success), 0.05);
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-success), 0.1);
  transition: all 0.3s;
}

.hero-feature-item:hover {
  background: rgba(var(--v-theme-success), 0.1);
  transform: translateY(-2px);
}

.trust-badges {
  gap: 1rem;
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 12px;
  background: rgba(var(--v-theme-surface), 0.6);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-border-color), 0.1);
  transition: all 0.3s;
}

.trust-badge:hover {
  background: rgba(var(--v-theme-surface), 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.trust-badge .text-caption {
  font-weight: 500;
  opacity: 0.9;
}

.hero-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
  box-shadow: 0 4px 14px 0 rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.hero-btn:hover {
  box-shadow: 0 6px 20px 0 rgba(var(--v-theme-primary), 0.4);
  transform: translateY(-2px);
}

.hero-btn-primary {
  position: relative;
  overflow: hidden;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: btn-shine-animation 3s infinite;
}

@keyframes btn-shine-animation {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 150%;
  }
}

.hero-btn-outline {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
  border-width: 2px;
}

.hero-image-container {
  position: relative;
  min-height: 400px;
}

.hero-main-icon {
  position: relative;
  z-index: 1;
}

.hero-icon {
  opacity: 0.2;
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

.floating-card {
  position: absolute;
  z-index: 2;
  animation: floatCard 4s ease-in-out infinite;
}

.card-1 {
  top: 10%;
  left: 0;
  animation-delay: 0s;
}

.card-2 {
  bottom: 15%;
  right: 20%;
  animation-delay: 1s;
}

.card-3 {
  top: 0%;
  right: 5%;
  animation-delay: 2s;
}

.floating-card-inner {
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
  transition: all 0.3s;
}

.floating-card:hover .floating-card-inner {
  transform: scale(1.05);
  border-color: rgba(var(--v-theme-primary), 0.4);
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

/* Partners Section */
.partners-section {
  background: rgb(var(--v-theme-background));
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
}

.letter-spacing {
  letter-spacing: 0.1em;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 32px;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
}

.partner-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  transition: all 0.3s;
  opacity: 0.4;
}

.partner-item:hover {
  opacity: 1;
  transform: scale(1.1);
}

.partner-icon {
  color: rgb(var(--v-theme-on-surface));
  transition: all 0.3s;
}

.partner-item:hover .partner-icon {
  color: rgb(var(--v-theme-primary));
}

/* Stats Section */
.stats-section {
  background: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
}

.stats-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(var(--v-theme-primary), 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(var(--v-theme-success), 0.03) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(var(--v-theme-info), 0.02) 0%, transparent 50%);
  z-index: 0;
}

.stats-wrapper {
  background: rgb(var(--v-theme-surface));
  border-radius: 24px;
  padding: 40px 20px;
  border: 1px solid rgba(var(--v-border-color), 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  position: relative;
  z-index: 1;
}

.stat-card {
  text-align: center;
  transition: transform 0.3s ease;
  position: relative;
}

.stat-card:hover {
  transform: translateY(-8px);
}

.stat-card:hover .stat-icon-bg {
  transform: scale(1.1) rotate(5deg);
}

.stat-icon-wrapper {
  display: inline-flex;
}

.stat-icon-bg {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-primary), 0.08);
  border-radius: 16px;
  transition: all 0.3s;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.stat-icon-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg);
  transition: all 0.6s;
  opacity: 0;
}

.stat-card:hover .stat-icon-bg::before {
  opacity: 1;
  animation: shine 1.5s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.stat-icon-primary {
  background: rgba(var(--v-theme-primary), 0.08);
}

.stat-icon-success {
  background: rgba(var(--v-theme-success), 0.08);
}

.stat-icon-info {
  background: rgba(var(--v-theme-info), 0.08);
}

.stat-icon-warning {
  background: rgba(var(--v-theme-warning), 0.08);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.95rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  font-weight: 500;
}

.stat-divider {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 60px;
  opacity: 0.2;
}

/* Section Styling */
.section-badge {
  display: flex;
  justify-content: center;
}

.badge-bounce {
  animation: badge-bounce 2s ease-in-out infinite;
}

@keyframes badge-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  position: relative;
  display: inline-block;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  max-width: 600px;
  margin: 0 auto;
}

.section-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  margin: 16px auto 0;
  border-radius: 2px;
  position: relative;
}

.section-underline::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: rgb(var(--v-theme-primary));
  border-radius: 50%;
}

.section-underline::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 50%;
}

/* Features Section */
.features-section {
  background: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
}

.features-bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(135deg, rgba(var(--v-theme-primary), 0.02) 0%, transparent 50%),
    linear-gradient(225deg, rgba(var(--v-theme-secondary), 0.02) 0%, transparent 50%),
    linear-gradient(45deg, rgba(var(--v-theme-info), 0.01) 0%, transparent 70%);
  z-index: 0;
}

.features-bg-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.04) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 15s ease-in-out infinite;
}

.features-bg-gradient::after {
  content: '';
  position: absolute;
  bottom: -30%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(var(--v-theme-success), 0.04) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 20s ease-in-out infinite reverse;
}

.feature-card-modern {
  padding: 32px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), 0.1);
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.feature-card-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.feature-card-modern::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feature-card-modern:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.feature-card-modern:hover::before {
  opacity: 1;
}

.feature-card-modern:hover::after {
  transform: scaleX(1);
}

.feature-card-modern > * {
  position: relative;
  z-index: 1;
}

.feature-number {
  position: absolute;
  top: 24px;
  right: 24px;
  font-size: 3rem;
  font-weight: 900;
  color: rgba(var(--v-theme-primary), 0.08);
  line-height: 1;
  z-index: 0;
}

.feature-arrow {
  margin-top: 16px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
}

.feature-card-modern:hover .feature-arrow {
  opacity: 1;
  transform: translateX(0);
}

.feature-icon-bg {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  transition: all 0.3s;
}

.feature-card-modern:hover .feature-icon-bg {
  transform: scale(1.1) rotate(5deg);
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.feature-description {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  line-height: 1.6;
}

/* Featured Vehicles */
.featured-vehicles-section {
  background: rgb(var(--v-theme-surface));
  position: relative;
  overflow: hidden;
}

.vehicle-card-wrapper {
  transition: all 0.3s ease;
}

.vehicle-card-wrapper:hover {
  transform: translateY(-8px);
}

.vehicle-card-wrapper:hover :deep(.v-card) {
  box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.2) !important;
}

.vehicles-bg-circles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.vehicles-bg-circles::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 5%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(var(--v-theme-info), 0.05) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse-slow 10s ease-in-out infinite;
}

.vehicles-bg-circles::after {
  content: '';
  position: absolute;
  bottom: 10%;
  right: 5%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(var(--v-theme-warning), 0.05) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse-slow 12s ease-in-out infinite reverse;
}

@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.view-all-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
  box-shadow: 0 4px 14px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.view-all-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.view-all-btn:hover::before {
  width: 300px;
  height: 300px;
}

.view-all-btn:hover {
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.4);
  transform: translateY(-3px);
}

.arrow-slide {
  transition: transform 0.3s;
}

.view-all-btn:hover .arrow-slide {
  transform: translateX(5px);
}

/* How It Works */
.how-it-works-section {
  background: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
}

.how-it-works-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(60deg, rgba(var(--v-theme-primary), 0.02) 0%, transparent 60%),
    linear-gradient(120deg, rgba(var(--v-theme-error), 0.02) 0%, transparent 60%);
  z-index: 0;
}

.how-it-works-bg::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(var(--v-theme-secondary), 0.03) 0%, transparent 70%);
  border-radius: 50%;
}

.steps-container {
  position: relative;
}

.step-col {
  position: relative;
}

.step-card-modern {
  text-align: center;
  padding: 40px 24px;
  position: relative;
  transition: transform 0.3s;
  z-index: 1;
}

.step-card-modern:hover {
  transform: scale(1.05);
}

.step-number-badge {
  position: relative;
  z-index: 2;
}

.step-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  opacity: 0.3;
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.3;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

.step-number-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 8px 20px rgba(var(--v-theme-primary), 0.3);
  position: relative;
  z-index: 1;
}

.step-number-text {
  font-size: 2rem;
  font-weight: 800;
  color: white;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.step-description {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  line-height: 1.6;
}

.step-connector {
  position: absolute;
  top: 86px;
  left: calc(50% + 40px);
  width: calc(100% - 80px);
  height: 2px;
  background: linear-gradient(
    90deg,
    rgb(var(--v-theme-primary)),
    rgba(var(--v-theme-primary), 0.3)
  );
  z-index: 0;
}

/* Pricing Section */
.pricing-section {
  background: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
}

.pricing-bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(135deg, rgba(var(--v-theme-primary), 0.02) 0%, transparent 50%),
    linear-gradient(225deg, rgba(var(--v-theme-warning), 0.02) 0%, transparent 50%);
  z-index: 0;
}

.pricing-card {
  background: rgb(var(--v-theme-surface));
  border: 2px solid rgba(var(--v-border-color), 0.1);
  border-radius: 24px;
  padding: 40px;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.pricing-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.15);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.pricing-card-featured {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.03) 0%,
    rgba(var(--v-theme-secondary), 0.02) 100%
  );
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
  transform: scale(1.05);
  z-index: 1;
}

.pricing-card-featured:hover {
  transform: translateY(-12px) scale(1.05);
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.pricing-icon {
  text-align: center;
}

.pricing-title {
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
}

.pricing-description {
  text-align: center;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  font-size: 0.95rem;
}

.pricing-amount {
  text-align: center;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.pricing-currency {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.pricing-value {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.pricing-period {
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  font-weight: 500;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.pricing-feature {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.85;
  font-size: 0.95rem;
}

.pricing-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
  transition: all 0.3s;
}

.pricing-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.3);
}

.pricing-card-featured .pricing-btn {
  box-shadow: 0 4px 14px rgba(var(--v-theme-primary), 0.3);
}

/* Testimonials Section */
.testimonials-section {
  background: rgb(var(--v-theme-surface));
  position: relative;
  overflow: hidden;
}

.testimonials-bg-mesh {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 50px,
      rgba(var(--v-theme-primary), 0.01) 50px,
      rgba(var(--v-theme-primary), 0.01) 51px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 50px,
      rgba(var(--v-theme-success), 0.01) 50px,
      rgba(var(--v-theme-success), 0.01) 51px
    );
  z-index: 0;
}

.testimonials-bg-mesh::before {
  content: '';
  position: absolute;
  top: -20%;
  right: 10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.03) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
}

.testimonials-bg-mesh::after {
  content: '';
  position: absolute;
  bottom: -20%;
  left: 10%;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(var(--v-theme-info), 0.03) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
}

.testimonial-card {
  background: rgb(var(--v-theme-background));
  border: 1px solid rgba(var(--v-border-color), 0.1);
  border-radius: 24px;
  padding: 32px;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.testimonial-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1;
}

.testimonial-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.03) 0%, rgba(var(--v-theme-secondary), 0.03) 100%);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 0;
}

.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.testimonial-card:hover::before {
  opacity: 1;
}

.testimonial-card:hover::after {
  opacity: 1;
}

.testimonial-card > * {
  position: relative;
  z-index: 1;
}

.testimonial-quote-icon {
  position: absolute;
  top: 24px;
  right: 24px;
  opacity: 0.1;
}

.quote-icon {
  transform: rotate(180deg);
}

.testimonial-rating {
  display: flex;
  gap: 4px;
}

.testimonial-text {
  font-size: 1rem;
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.85;
  position: relative;
  z-index: 1;
}

/* FAQ Section */
.faq-section {
  background: rgb(var(--v-theme-surface));
  position: relative;
}

.faq-panels {
  background: transparent !important;
}

.faq-panel {
  background: rgb(var(--v-theme-background));
  border: 1px solid rgba(var(--v-border-color), 0.1);
  border-radius: 16px !important;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s;
}

.faq-panel:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.faq-question {
  font-size: 1.05rem;
  padding: 20px 24px !important;
}

.faq-answer {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* Newsletter Section */
.newsletter-section {
  background: rgb(var(--v-theme-background));
  position: relative;
}

.newsletter-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), 0.1);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.newsletter-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
}

.newsletter-icon {
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.newsletter-input {
  min-width: 250px;
}

.newsletter-btn {
  text-transform: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s;
}

.newsletter-btn:hover {
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4);
  transform: translateY(-2px);
}

/* CTA Section */
.cta-section {
  background: rgb(var(--v-theme-background));
  position: relative;
}

.cta-card-modern {
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  padding: 80px 40px;
  text-align: center;
}

.cta-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  z-index: 0;
}

.cta-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  opacity: 0.5;
}

.cta-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-float infinite ease-in-out;
}

@keyframes particle-float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(50px);
    opacity: 0;
  }
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-icon {
  display: inline-block;
}

.cta-icon-spin {
  animation: spin 20s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: white;
  letter-spacing: -0.02em;
}

.cta-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin: 0 auto;
}

.cta-btn-primary {
  background: white !important;
  color: rgb(var(--v-theme-primary)) !important;
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.cta-btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.cta-btn-primary:hover::before {
  width: 300px;
  height: 300px;
}

.cta-btn-primary:hover {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.cta-btn-secondary {
  border-width: 2px !important;
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0;
}

.cta-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.cta-stats {
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 32px;
}

.cta-stat-item {
  text-align: center;
}

.cta-stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 4px;
}

.cta-stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Responsive */
@media (max-width: 960px) {
  .hero-section {
    min-height: auto;
    padding: 80px 0 60px;
  }

  .min-height {
    min-height: auto;
  }

  .hero-icon {
    font-size: 200px !important;
  }

  .floating-card {
    display: none;
  }

  .hero-title {
    text-align: center;
  }

  .hero-subtitle {
    text-align: center;
    margin: 0 auto;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-card-modern {
    padding: 60px 24px;
  }
}

@media (max-width: 600px) {
  .stat-value {
    font-size: 2rem;
  }

  .step-number-circle {
    width: 64px;
    height: 64px;
  }

  .step-number-text {
    font-size: 1.5rem;
  }
}
</style>
