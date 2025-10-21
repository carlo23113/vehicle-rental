<template>
  <section id="testimonials" class="relative py-20 overflow-hidden">
    <div class="testimonials-bg-mesh"></div>
    <v-container class="position-relative">
      <div class="text-center mb-16">
        <div class="flex justify-center mb-4">
          <v-chip color="primary" variant="tonal" size="small" class="px-4">
            Testimonials
          </v-chip>
        </div>
        <h2 class="text-[clamp(2rem,4vw,3rem)] font-extrabold -tracking-[0.02em] mb-4 md:text-[2rem]">
          What Our Customers Say
        </h2>
        <p class="text-[clamp(1rem,2vw,1.25rem)] opacity-70 max-w-[600px] mx-auto" style="color: rgb(var(--v-theme-on-surface))">
          Real experiences from our satisfied customers
        </p>
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
            <div class="flex gap-1 mb-4">
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
</template>

<script setup lang="ts">
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
</script>

<style scoped lang="scss">
.testimonials-bg-mesh {
  @apply absolute inset-0 z-0;
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

  &::before {
    content: '';
    @apply absolute -top-[20%] right-[10%] w-[500px] h-[500px] rounded-full;
    background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.03) 0%, transparent 70%);
    filter: blur(40px);
  }

  &::after {
    content: '';
    @apply absolute -bottom-[20%] left-[10%] w-[450px] h-[450px] rounded-full;
    background: radial-gradient(circle, rgba(var(--v-theme-info), 0.03) 0%, transparent 70%);
    filter: blur(40px);
  }
}

.testimonial-card {
  @apply rounded-3xl p-8 h-full relative overflow-hidden border border-[rgba(var(--v-border-color),0.1)];
  background: rgb(var(--v-theme-background));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    @apply absolute top-0 left-0 w-1 h-full opacity-0 z-10;
    background: linear-gradient(
      180deg,
      rgb(var(--v-theme-primary)) 0%,
      rgb(var(--v-theme-secondary)) 100%
    );
    transition: opacity 0.3s;
  }

  &::after {
    content: '';
    @apply absolute inset-0 opacity-0 z-0;
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.03) 0%, rgba(var(--v-theme-secondary), 0.03) 100%);
    transition: opacity 0.3s;
  }

  &:hover {
    @apply -translate-y-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)];
    border-color: rgba(var(--v-theme-primary), 0.3);

    &::before {
      @apply opacity-100;
    }

    &::after {
      @apply opacity-100;
    }
  }

  > * {
    @apply relative z-10;
  }
}

.testimonial-quote-icon {
  @apply absolute top-6 right-6 opacity-10;
}

.quote-icon {
  @apply rotate-180;
}

.testimonial-text {
  @apply text-base leading-relaxed opacity-85 relative z-10;
  color: rgb(var(--v-theme-on-surface));
}
</style>
