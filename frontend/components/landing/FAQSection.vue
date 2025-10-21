<template>
  <section id="faq" class="relative py-20">
    <v-container>
      <div class="text-center mb-16">
        <div class="flex justify-center mb-4">
          <v-chip color="primary" variant="tonal" size="small" class="px-4">
            <v-icon icon="mdi-help-circle" start size="14"></v-icon>
            FAQ
          </v-chip>
        </div>
        <h2 class="text-[clamp(2rem,4vw,3rem)] font-extrabold -tracking-[0.02em] mb-4 md:text-[2rem]">
          Frequently Asked Questions
        </h2>
        <p class="text-[clamp(1rem,2vw,1.25rem)] opacity-70 max-w-[600px] mx-auto" style="color: rgb(var(--v-theme-on-surface))">
          Find answers to common questions
        </p>
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
</template>

<script setup lang="ts">
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
</script>

<style scoped lang="scss">
.faq-panels {
  background: transparent !important;
}

.faq-panel {
  @apply rounded-2xl mb-4 overflow-hidden transition-all duration-300;
  background: rgb(var(--v-theme-background));
  border: 1px solid rgba(var(--v-border-color), 0.1);

  &:hover {
    border-color: rgba(var(--v-theme-primary), 0.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  }
}

.faq-question {
  @apply text-[1.05rem];
  padding: 20px 24px !important;
}

.faq-answer {
  @apply opacity-80 leading-relaxed text-[0.95rem];
  color: rgb(var(--v-theme-on-surface));
}
</style>
