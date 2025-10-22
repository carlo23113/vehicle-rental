<template>
  <CommonUiDetailCard title="Contact Information" icon="mdi-phone">
    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Phone Number" icon="mdi-phone-outline">
          <a :href="`tel:${location.phone}`" class="contact-link">
            {{ location.phone }}
          </a>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Email Address" icon="mdi-email-outline">
          <a :href="`mailto:${location.email}`" class="contact-link">
            {{ location.email }}
          </a>
        </CommonUiDetailItem>
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

defineProps<{
  location: Location
}>()
</script>

<style lang="scss" scoped>
.contact-link {
  @apply no-underline transition-all duration-200;
  color: rgb(var(--v-theme-primary));

  &:hover {
    @apply underline;
  }
}
</style>
