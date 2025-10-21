<template>
  <div class="landing-page">
    <!-- Hero Section - Load immediately (above the fold) -->
    <LandingHeroSection />

    <!-- Stats Section - Lazy load with hydration -->
    <LazyLandingStatsSection />

    <!-- Features Section - Lazy load with hydration -->
    <LazyLandingFeaturesSection />

    <!-- Featured Vehicles Section - Lazy load with hydration -->
    <LazyLandingVehiclesSection />

    <!-- How It Works Section - Lazy load with hydration -->
    <LazyLandingHowItWorksSection />

    <!-- Testimonials Section - Lazy load with hydration -->
    <LazyLandingTestimonialsSection />

    <!-- FAQ Section - Lazy load with hydration -->
    <LazyLandingFAQSection />

    <!-- Newsletter Section - Lazy load with hydration -->
    <LazyLandingNewsletterSection />

    <!-- CTA Section - Lazy load with hydration -->
    <LazyLandingCTASection />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'public',
})
</script>

<style scoped>
.landing-page {
  background: rgb(var(--v-theme-background));
  overflow-x: hidden;
}
</style>
