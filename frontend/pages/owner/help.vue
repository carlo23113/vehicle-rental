<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="text-center">
          <h1 class="text-h3 font-weight-bold mb-2">Help Center</h1>
          <p class="text-h6 text-medium-emphasis font-weight-regular">
            Find answers and get support
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- Search -->
    <v-row class="mb-8">
      <v-col cols="12" md="8" offset-md="2" lg="6" offset-lg="3">
        <v-text-field
          v-model="searchQuery"
          variant="outlined"
          density="comfortable"
          placeholder="Search for help articles..."
          prepend-inner-icon="mdi-magnify"
          clearable
          class="search-field"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Quick Links -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3" v-for="link in quickLinks" :key="link.title">
        <v-card elevation="0" class="quick-link-card pa-4 text-center" hover>
          <v-avatar :color="link.color" size="64" class="mb-4">
            <v-icon :icon="link.icon" size="32" color="white"></v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold mb-2">{{ link.title }}</h3>
          <p class="text-body-2 text-medium-emphasis">{{ link.description }}</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- FAQ Sections -->
    <v-row class="mb-8">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-6">Frequently Asked Questions</h2>
      </v-col>
    </v-row>

    <v-row v-for="category in filteredCategories" :key="category.name" class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" class="modern-card">
          <v-card-title class="pa-6">
            <div class="d-flex align-center">
              <v-icon :icon="category.icon" :color="category.color" size="28" class="mr-3"></v-icon>
              <h3 class="text-h5 font-weight-bold">{{ category.name }}</h3>
            </div>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-expansion-panels variant="accordion" class="faq-panels">
              <v-expansion-panel
                v-for="(faq, index) in category.faqs"
                :key="index"
                :value="index"
              >
                <v-expansion-panel-title class="pa-6">
                  <span class="font-weight-medium">{{ faq.question }}</span>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="pa-6 pt-0">
                  <p class="text-body-1" v-html="faq.answer"></p>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Contact Support -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" class="modern-card contact-card">
          <v-card-text class="pa-8 text-center">
            <v-icon icon="mdi-help-circle-outline" size="64" color="primary" class="mb-4"></v-icon>
            <h2 class="text-h4 font-weight-bold mb-3">Still Need Help?</h2>
            <p class="text-h6 text-medium-emphasis mb-6">
              Our support team is here to assist you
            </p>
            <div class="d-flex justify-center flex-wrap ga-4">
              <v-btn
                color="primary"
                size="large"
                elevation="2"
                class="rounded-lg"
                prepend-icon="mdi-email"
              >
                Email Support
              </v-btn>
              <v-btn
                color="success"
                size="large"
                elevation="2"
                class="rounded-lg"
                prepend-icon="mdi-phone"
              >
                Call Support
              </v-btn>
              <v-btn
                color="info"
                size="large"
                elevation="2"
                class="rounded-lg"
                prepend-icon="mdi-chat"
              >
                Live Chat
              </v-btn>
            </div>
            <v-divider class="my-6"></v-divider>
            <div class="contact-info">
              <div class="d-flex justify-center align-center ga-2 mb-2">
                <v-icon icon="mdi-email" size="20"></v-icon>
                <span>support@vehiclerental.com</span>
              </div>
              <div class="d-flex justify-center align-center ga-2 mb-2">
                <v-icon icon="mdi-phone" size="20"></v-icon>
                <span>1-800-VEHICLE (843-4253)</span>
              </div>
              <div class="d-flex justify-center align-center ga-2">
                <v-icon icon="mdi-clock-outline" size="20"></v-icon>
                <span>Monday - Friday, 9:00 AM - 6:00 PM EST</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')

const quickLinks = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of the system',
    icon: 'mdi-rocket-launch',
    color: 'primary',
  },
  {
    title: 'Manage Vehicles',
    description: 'Add and configure vehicles',
    icon: 'mdi-car-multiple',
    color: 'success',
  },
  {
    title: 'Process Rentals',
    description: 'Create and manage rentals',
    icon: 'mdi-car-key',
    color: 'info',
  },
  {
    title: 'Reports & Analytics',
    description: 'View business insights',
    icon: 'mdi-chart-bar',
    color: 'warning',
  },
]

const categories = [
  {
    name: 'Getting Started',
    icon: 'mdi-rocket-launch',
    color: 'primary',
    faqs: [
      {
        question: 'How do I add my first vehicle to the system?',
        answer: 'Navigate to the <strong>Vehicles</strong> page and click the <strong>Add Vehicle</strong> button. Fill in the vehicle details including make, model, year, license plate, VIN, type, and daily rate. You can also add features and maintenance information.',
      },
      {
        question: 'How do I create a new customer profile?',
        answer: 'Go to the <strong>Customers</strong> page and click <strong>Add Customer</strong>. Enter the customer\'s personal information, address, and driver\'s license details. Make sure to verify all information before saving.',
      },
      {
        question: 'What is the difference between a rental and a reservation?',
        answer: 'A <strong>reservation</strong> is a future booking that hasn\'t started yet, while a <strong>rental</strong> is an active or completed vehicle rental. Reservations automatically convert to rentals on the start date.',
      },
    ],
  },
  {
    name: 'Vehicles & Fleet Management',
    icon: 'mdi-car-multiple',
    color: 'success',
    faqs: [
      {
        question: 'How do I mark a vehicle as unavailable for maintenance?',
        answer: 'In the <strong>Vehicles</strong> page, find the vehicle and click the edit button. Change the status to <strong>Maintenance</strong> or <strong>Out of Service</strong>. This will prevent the vehicle from being rented until you change it back.',
      },
      {
        question: 'How do I track vehicle maintenance history?',
        answer: 'Visit the <strong>Maintenance</strong> page to view all service records. You can filter by vehicle to see maintenance history. Each record includes the service type, date, cost, and notes.',
      },
      {
        question: 'Can I set different daily rates for different vehicles?',
        answer: 'Yes! Each vehicle has its own daily rate setting. You can configure this when adding a new vehicle or by editing an existing vehicle\'s details.',
      },
    ],
  },
  {
    name: 'Rentals & Reservations',
    icon: 'mdi-car-key',
    color: 'info',
    faqs: [
      {
        question: 'How do I create a new rental?',
        answer: 'Go to the <strong>Rentals</strong> page and click <strong>New Rental</strong>. Select the customer and vehicle, set the rental period, pickup/return locations, and confirm the payment details. The system will calculate the total cost automatically.',
      },
      {
        question: 'How do I confirm a pending reservation?',
        answer: 'In the <strong>Reservations</strong> page, find the pending reservation and click the <strong>Confirm</strong> button. This will lock in the booking and mark the vehicle as reserved for those dates.',
      },
      {
        question: 'What happens when a rental period ends?',
        answer: 'The rental status automatically changes to <strong>Completed</strong> on the end date. You should verify the vehicle condition and process the final payment if there are any additional charges.',
      },
    ],
  },
  {
    name: 'Payments & Billing',
    icon: 'mdi-credit-card',
    color: 'warning',
    faqs: [
      {
        question: 'How do I record a payment?',
        answer: 'Navigate to the <strong>Payments</strong> page and click <strong>Record Payment</strong>. Select the rental, enter the amount, payment method, and transaction ID. You can also add notes for reference.',
      },
      {
        question: 'How do I process a refund?',
        answer: 'In the <strong>Payments</strong> page, find the completed payment and click the <strong>Refund</strong> button. Confirm the refund amount and the system will process it and update the payment status.',
      },
      {
        question: 'What payment methods are supported?',
        answer: 'The system supports <strong>Credit Card</strong>, <strong>Debit Card</strong>, <strong>Cash</strong>, <strong>Bank Transfer</strong>, and other payment methods. You can track all transactions in the Payments page.',
      },
    ],
  },
  {
    name: 'Reports & Analytics',
    icon: 'mdi-chart-bar',
    color: 'error',
    faqs: [
      {
        question: 'How do I generate a revenue report?',
        answer: 'Go to the <strong>Reports</strong> page and select your desired date range. The page displays revenue trends, vehicle utilization, top customers, and maintenance costs. You can export these reports using the Export button.',
      },
      {
        question: 'What is vehicle utilization rate?',
        answer: 'Vehicle utilization rate shows the percentage of days a vehicle was rented out of total available days. Higher rates (80%+) indicate efficient fleet usage.',
      },
      {
        question: 'Can I see which customers bring the most revenue?',
        answer: 'Yes! The <strong>Reports</strong> page includes a <strong>Top Customers</strong> section that ranks customers by total spending and rental frequency.',
      },
    ],
  },
  {
    name: 'Settings & Account',
    icon: 'mdi-cog',
    color: 'secondary',
    faqs: [
      {
        question: 'How do I change my account password?',
        answer: 'Go to the <strong>Settings</strong> page and navigate to the <strong>Security</strong> section. Enter your current password and new password, then click <strong>Update Password</strong>.',
      },
      {
        question: 'How do I enable dark mode?',
        answer: 'In the <strong>Settings</strong> page under <strong>Preferences</strong>, toggle the <strong>Dark Mode</strong> switch. You can also use the moon/sun icon in the navigation bar.',
      },
      {
        question: 'Can I customize notification preferences?',
        answer: 'Yes! Visit the <strong>Settings</strong> page and go to the <strong>Notifications</strong> section. You can customize email and in-app notifications for rentals, maintenance, and payments.',
      },
    ],
  },
]

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories

  const query = searchQuery.value.toLowerCase()
  return categories
    .map(category => ({
      ...category,
      faqs: category.faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      ),
    }))
    .filter(category => category.faqs.length > 0)
})
</script>

<style scoped>
.search-field :deep(.v-field) {
  border-radius: 50px;
  font-size: 1.1rem;
}

.quick-link-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.quick-link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}

.modern-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.faq-panels {
  background: transparent;
}

.faq-panels :deep(.v-expansion-panel) {
  background: transparent;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
}

.faq-panels :deep(.v-expansion-panel:last-child) {
  border-bottom: none;
}

.faq-panels :deep(.v-expansion-panel-title) {
  font-size: 1rem;
}

.faq-panels :deep(.v-expansion-panel-text__wrapper) {
  padding-top: 0;
}

.contact-card {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05) 0%,
    rgba(var(--v-theme-surface), 1) 100%
  );
}

.contact-info {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
}
</style>
