<template>
  <section id="features" class="relative py-20 overflow-hidden">
    <div class="features-bg-gradient"></div>
    <v-container class="position-relative">
      <div class="text-center mb-16">
        <div class="flex justify-center mb-4">
          <v-chip color="primary" variant="tonal" size="small" class="px-4">
            <v-icon icon="mdi-star-four-points" start size="14"></v-icon>
            Features
          </v-chip>
        </div>
        <h2 class="text-[clamp(2rem,4vw,3rem)] font-extrabold -tracking-[0.02em] mb-4 md:text-[2rem]">
          Why Choose Us
        </h2>
        <p class="text-[clamp(1rem,2vw,1.25rem)] opacity-70 max-w-[600px] mx-auto" style="color: rgb(var(--v-theme-on-surface))">
          Everything you need for a perfect rental experience
        </p>
        <div class="section-underline"></div>
      </div>
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="(feature, index) in features" :key="feature.title">
          <div
            class="feature-card-modern fade-in-up"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="feature-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="mb-6">
              <div
                class="feature-icon-bg"
                :style="{ background: `rgba(var(--v-theme-${feature.color}), 0.1)` }"
              >
                <v-icon :icon="feature.icon" size="32" :color="feature.color"></v-icon>
              </div>
            </div>
            <h3 class="text-xl font-bold mb-3">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-arrow">
              <v-icon icon="mdi-arrow-right" size="20" :color="feature.color"></v-icon>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
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
</script>

<style scoped lang="scss">
.features-bg-gradient {
  @apply absolute inset-0 z-0;
  background:
    linear-gradient(135deg, rgba(var(--v-theme-primary), 0.02) 0%, transparent 50%),
    linear-gradient(225deg, rgba(var(--v-theme-secondary), 0.02) 0%, transparent 50%),
    linear-gradient(45deg, rgba(var(--v-theme-info), 0.01) 0%, transparent 70%);

  &::before {
    content: '';
    @apply absolute -top-1/2 -left-[10%] w-[600px] h-[600px] rounded-full;
    background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.04) 0%, transparent 70%);
    animation: float 15s ease-in-out infinite;
  }

  &::after {
    content: '';
    @apply absolute -bottom-[30%] -right-[10%] w-[500px] h-[500px] rounded-full;
    background: radial-gradient(circle, rgba(var(--v-theme-success), 0.04) 0%, transparent 70%);
    animation: float 20s ease-in-out infinite reverse;
  }
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

.section-underline {
  @apply w-20 h-1 mx-auto mt-4 rounded relative;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));

  &::before {
    content: '';
    @apply absolute -left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full;
    background: rgb(var(--v-theme-primary));
  }

  &::after {
    content: '';
    @apply absolute -right-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full;
    background: rgb(var(--v-theme-secondary));
  }
}

.feature-card-modern {
  @apply p-8 rounded-3xl border border-[rgba(var(--v-border-color),0.1)] h-full relative overflow-hidden cursor-pointer;
  background: rgb(var(--v-theme-surface));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    @apply absolute inset-0 opacity-0 z-0;
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.05) 100%);
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    @apply absolute bottom-0 left-0 w-full h-[3px];
    background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:hover {
    @apply -translate-y-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)];
    border-color: rgba(var(--v-theme-primary), 0.3);

    &::before {
      @apply opacity-100;
    }

    &::after {
      transform: scaleX(1);
    }

    .feature-icon-bg {
      @apply scale-110 rotate-[5deg];
    }

    .feature-arrow {
      @apply opacity-100 translate-x-0;
    }
  }

  > * {
    @apply relative z-10;
  }
}

.feature-number {
  @apply absolute top-6 right-6 text-[3rem] font-black leading-none z-0;
  color: rgba(var(--v-theme-primary), 0.08);
}

.feature-arrow {
  @apply mt-4 opacity-0 -translate-x-2.5 transition-all duration-300;
}

.feature-icon-bg {
  @apply w-[72px] h-[72px] flex items-center justify-center rounded-2xl transition-all duration-300;
}

.feature-description {
  @apply opacity-70 leading-relaxed;
  color: rgb(var(--v-theme-on-surface));
}
</style>
