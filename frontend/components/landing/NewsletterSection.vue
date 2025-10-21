<template>
  <section class="relative py-16">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" md="8" lg="6">
          <div class="relative overflow-hidden rounded-3xl py-10 px-10 border border-[rgba(var(--v-border-color),0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.08)]" style="background: rgb(var(--v-theme-surface))">
            <div class="newsletter-top-bar"></div>
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
                class="flex-grow-1 min-w-[250px]"
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
</template>

<style scoped lang="scss">
.newsletter-top-bar {
  @apply absolute top-0 left-0 right-0 h-1;
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

.newsletter-btn {
  @apply normal-case font-semibold transition-all duration-300;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);

  &:hover {
    box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4);
    @apply -translate-y-0.5;
  }
}
</style>
