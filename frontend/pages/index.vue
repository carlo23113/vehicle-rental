<template>
  <div class="landing-page">
    <!-- Hero Section - Load immediately (above the fold) -->
    <HeroSection />

    <!-- Stats Section - Lazy load with hydration -->
    <StatsSection />

    <!-- Features Section - Lazy load with hydration -->
    <FeaturesSection />

    <!-- Featured Vehicles Section - Lazy load with hydration -->
    <VehiclesSection />

    <!-- How It Works Section - Lazy load with hydration -->
    <HowItWorksSection />

    <!-- Testimonials Section - Lazy load with hydration -->
    <TestimonialsSection />

    <!-- FAQ Section - Lazy load with hydration -->
    <FAQSection />

    <!-- Newsletter Section - Lazy load with hydration -->
    <NewsletterSection />

    <!-- CTA Section - Lazy load with hydration -->
    <CTASection />
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
