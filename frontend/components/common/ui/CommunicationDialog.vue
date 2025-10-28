<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 bg-primary">
        <div class="d-flex align-center gap-3">
          <v-icon :icon="dialogConfig.icon" size="24" />
          <div>
            <div class="text-h6">{{ dialogConfig.title }}</div>
            <div v-if="recipient" class="text-caption mt-1 opacity-90">
              To: {{ recipient.name }}
            </div>
          </div>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="$emit('update:modelValue', false)"
        />
      </v-card-title>

      <v-divider />

      <!-- Content -->
      <v-card-text class="pa-6">
        <!-- Recipient Info -->
        <div v-if="recipient" class="recipient-info mb-4 pa-3 bg-grey-lighten-4 rounded">
          <div class="d-flex align-center gap-3">
            <v-avatar color="primary" size="40">
              <span class="font-bold">{{ getInitials(recipient.name) }}</span>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="font-weight-bold">{{ recipient.name }}</div>
              <div class="text-body-2 text-medium-emphasis">
                <v-icon icon="mdi-email" size="14" class="mr-1" />
                {{ recipient.email }}
              </div>
              <div v-if="recipient.phone" class="text-body-2 text-medium-emphasis">
                <v-icon icon="mdi-phone" size="14" class="mr-1" />
                {{ recipient.phone }}
              </div>
            </div>
          </div>
        </div>

        <!-- Template Selection (for reminders) -->
        <v-select
          v-if="type === 'reminder'"
          v-model="selectedTemplate"
          :items="reminderTemplates"
          item-title="name"
          item-value="id"
          label="Select Template"
          variant="outlined"
          density="comfortable"
          class="mb-4"
          @update:model-value="loadTemplate"
        >
          <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
              <template #prepend>
                <v-icon :icon="item.raw.icon" />
              </template>
              <template #subtitle>
                {{ item.raw.description }}
              </template>
            </v-list-item>
          </template>
        </v-select>

        <!-- Subject (for email) -->
        <v-text-field
          v-if="type === 'email' || type === 'reminder'"
          v-model="subject"
          label="Subject"
          variant="outlined"
          density="comfortable"
          class="mb-4"
          :rules="[rules.required]"
        />

        <!-- Message -->
        <v-textarea
          v-model="message"
          :label="dialogConfig.messageLabel"
          variant="outlined"
          rows="8"
          :rules="[rules.required, rules.minLength]"
          :counter="type === 'sms' ? 160 : undefined"
          :hint="type === 'sms' ? 'SMS messages are limited to 160 characters' : undefined"
        />

        <!-- Additional Options -->
        <div class="mt-4">
          <v-checkbox
            v-if="type === 'email' || type === 'reminder'"
            v-model="sendCopy"
            label="Send me a copy"
            density="compact"
            hide-details
          />
          <v-checkbox
            v-if="type === 'reminder'"
            v-model="scheduleForLater"
            label="Schedule for later"
            density="compact"
            hide-details
            class="mt-2"
          />
          <v-text-field
            v-if="scheduleForLater"
            v-model="scheduleDate"
            type="datetime-local"
            label="Schedule Date & Time"
            variant="outlined"
            density="comfortable"
            class="mt-3"
          />
        </div>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="loading"
          :disabled="!isValid"
          @click="handleSend"
        >
          <v-icon start :icon="dialogConfig.sendIcon" />
          {{ dialogConfig.sendLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export interface Recipient {
  name: string
  email: string
  phone?: string
}

const props = defineProps<{
  modelValue: boolean
  type: 'email' | 'sms' | 'reminder'
  recipient?: Recipient
  loading?: boolean
  contextData?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  send: [payload: {
    type: string
    subject?: string
    message: string
    sendCopy: boolean
    scheduleDate?: string
    template?: string
  }]
}>()

// Form data
const selectedTemplate = ref('')
const subject = ref('')
const message = ref('')
const sendCopy = ref(false)
const scheduleForLater = ref(false)
const scheduleDate = ref('')

// Reminder templates
const reminderTemplates = [
  {
    id: 'pickup',
    name: 'Pickup Reminder',
    icon: 'mdi-calendar-clock',
    description: 'Remind customer about upcoming pickup',
    subject: 'Pickup Reminder - {vehicleName}',
    message: `Dear {customerName},

This is a friendly reminder that your rental pickup is scheduled for {startDate} at {pickupLocation}.

Vehicle: {vehicleName}
License Plate: {licensePlate}
Pickup Time: {startTime}

Please bring:
- Valid driver's license
- Credit card for deposit
- Proof of insurance

If you have any questions, please don't hesitate to contact us.

Best regards,
{companyName}`,
  },
  {
    id: 'return',
    name: 'Return Reminder',
    icon: 'mdi-calendar-end',
    description: 'Remind customer about upcoming return',
    subject: 'Return Reminder - {vehicleName}',
    message: `Dear {customerName},

Your rental period is ending soon. Please return the vehicle by {endDate} at {returnLocation}.

Vehicle: {vehicleName}
Return Time: {endTime}
Return Location: {returnLocation}

Before returning:
- Refuel the vehicle
- Remove all personal belongings
- Clean the interior

Thank you for choosing us!

Best regards,
{companyName}`,
  },
  {
    id: 'overdue',
    name: 'Overdue Notice',
    icon: 'mdi-alert-circle',
    description: 'Send overdue return notice',
    subject: 'URGENT: Overdue Return - {vehicleName}',
    message: `Dear {customerName},

Our records show that the vehicle was due for return on {endDate}, but we have not yet received it.

Vehicle: {vehicleName}
License Plate: {licensePlate}
Days Overdue: {daysOverdue}

Please return the vehicle immediately to avoid additional charges. Contact us if you need to extend your rental.

Late fees may apply.

{companyName}`,
  },
  {
    id: 'payment',
    name: 'Payment Reminder',
    icon: 'mdi-cash-alert',
    description: 'Remind customer about pending payment',
    subject: 'Payment Reminder - Rental #{rentalId}',
    message: `Dear {customerName},

We noticed that your payment for rental #{rentalId} is still pending.

Amount Due: {totalAmount}
Payment Status: {paymentStatus}

Please complete your payment at your earliest convenience.

You can pay online or contact us for assistance.

Thank you,
{companyName}`,
  },
  {
    id: 'documents',
    name: 'Missing Documents',
    icon: 'mdi-file-alert',
    description: 'Request missing documentation',
    subject: 'Missing Documents - Rental #{rentalId}',
    message: `Dear {customerName},

We still need some documents to complete your rental booking.

Please provide:
- Copy of driver's license
- Proof of insurance
- Credit card authorization

You can upload these documents through our portal or email them to us.

{companyName}`,
  },
]

const dialogConfig = computed(() => {
  const configs = {
    email: {
      icon: 'mdi-email',
      title: 'Send Email',
      messageLabel: 'Email Message',
      sendIcon: 'mdi-send',
      sendLabel: 'Send Email',
    },
    sms: {
      icon: 'mdi-message-text',
      title: 'Send SMS',
      messageLabel: 'SMS Message (160 characters max)',
      sendIcon: 'mdi-send',
      sendLabel: 'Send SMS',
    },
    reminder: {
      icon: 'mdi-bell',
      title: 'Send Reminder',
      messageLabel: 'Reminder Message',
      sendIcon: 'mdi-send',
      sendLabel: scheduleForLater.value ? 'Schedule Reminder' : 'Send Reminder',
    },
  }
  return configs[props.type] || configs.email
})

// Validation rules
const rules = {
  required: (v: string) => !!v || 'This field is required',
  minLength: (v: string) => v.length >= 10 || 'Message must be at least 10 characters',
}

const isValid = computed(() => {
  if (props.type === 'sms') {
    return message.value.length >= 10 && message.value.length <= 160
  }
  if (props.type === 'email' || props.type === 'reminder') {
    return subject.value && message.value.length >= 10
  }
  return message.value.length >= 10
})

const getInitials = (name: string): string => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const loadTemplate = () => {
  const template = reminderTemplates.find(t => t.id === selectedTemplate.value)
  if (template && props.contextData) {
    subject.value = replacePlaceholders(template.subject, props.contextData)
    message.value = replacePlaceholders(template.message, props.contextData)
  }
}

const replacePlaceholders = (text: string, data: any): string => {
  let result = text
  Object.keys(data).forEach(key => {
    const placeholder = `{${key}}`
    result = result.replace(new RegExp(placeholder, 'g'), data[key] || '')
  })
  return result
}

const handleSend = () => {
  emit('send', {
    type: props.type,
    subject: subject.value,
    message: message.value,
    sendCopy: sendCopy.value,
    scheduleDate: scheduleForLater.value ? scheduleDate.value : undefined,
    template: selectedTemplate.value || undefined,
  })
}

// Reset form when dialog closes
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    selectedTemplate.value = ''
    subject.value = ''
    message.value = ''
    sendCopy.value = false
    scheduleForLater.value = false
    scheduleDate.value = ''
  }
})
</script>

<style scoped lang="scss">
.recipient-info {
  border-left: 3px solid rgb(var(--v-theme-primary));
}
</style>
