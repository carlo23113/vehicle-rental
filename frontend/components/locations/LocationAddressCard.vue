<template>
  <CommonUiDetailCard title="Address Information" icon="mdi-map">
    <v-row>
      <v-col cols="12">
        <CommonUiDetailItem label="Street Address" icon="mdi-home-map-marker" :value="location.address" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="City" icon="mdi-city-variant-outline" :value="location.city" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="State/Province" icon="mdi-map-outline" :value="location.state" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="ZIP/Postal Code" icon="mdi-mailbox-outline" :value="location.zipCode" />
      </v-col>
      <v-col v-if="location.country" cols="12" md="6">
        <CommonUiDetailItem label="Country" icon="mdi-earth" :value="countryName" />
      </v-col>
      <v-col cols="12">
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="mdi-map-search"
          :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`"
          target="_blank"
        >
          View on Map
        </v-btn>
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Location } from '~/composables/useLocations'
import { useCountryLocations } from '~/composables/useCountryLocations'

const props = defineProps<{
  location: Location
  fullAddress: string
}>()

const { getCountryName } = useCountryLocations()

const countryName = computed(() => {
  return props.location.country ? getCountryName(props.location.country) : ''
})
</script>
