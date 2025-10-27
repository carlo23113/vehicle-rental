<template>
  <CommonUiDetailCard title="Pickup & Return" icon="mdi-map-marker">
    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Pickup Location" icon="mdi-map-marker-outline">
          <div class="text-body-2 font-weight-medium">{{ pickupLocation.name }}</div>
          <div class="text-caption text-medium-emphasis">{{ pickupLocation.address }}</div>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Pickup Time" icon="mdi-clock-outline" :value="pickupTime" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Return Date" icon="mdi-calendar-end" :value="formatDate(endDate)" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Return Time" icon="mdi-clock-check-outline" :value="returnTime" />
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
interface Props {
  pickupLocation: {
    name: string
    address: string
  }
  pickupTime: string
  endDate: string
  returnTime: string
}

defineProps<Props>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
