<template>
  <div class="landing-page">
    <!-- Hero Section - Load immediately (above the fold) -->
    <HeroSection />

    <!-- Stats Section - Lazy load with hydration -->
    <LazyStatsSection />

    <!-- Features Section - Lazy load with hydration -->
    <LazyFeaturesSection />

    <!-- Featured Vehicles Section - Lazy load with hydration -->
    <LazyVehiclesSection />

    <!-- How It Works Section - Lazy load with hydration -->
    <LazyHowItWorksSection />

    <!-- Testimonials Section - Lazy load with hydration -->
    <LazyTestimonialsSection />

    <!-- FAQ Section - Lazy load with hydration -->
    <LazyFAQSection />

    <!-- Newsletter Section - Lazy load with hydration -->
    <LazyNewsletterSection />

    <!-- CTA Section - Lazy load with hydration -->
    <LazyCTASection />
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
