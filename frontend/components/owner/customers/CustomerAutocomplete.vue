<template>
  <v-autocomplete
    :model-value="modelValue"
    label="Select Customer"
    placeholder="Search by name, email, or license..."
    variant="outlined"
    density="comfortable"
    :items="customers"
    item-title="displayName"
    item-value="id"
    :rules="rules"
    prepend-inner-icon="mdi-account-search"
    clearable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <v-avatar color="primary" size="40" class="text-white">
            <span class="text-subtitle-2 font-weight-bold">{{ item.raw.initials }}</span>
          </v-avatar>
        </template>
        <template #title>
          <div class="font-weight-semibold">{{ item.raw.fullName }}</div>
        </template>
        <template #subtitle>
          <div class="text-caption">
            <div>{{ item.raw.email }}</div>
            <div class="d-flex align-center ga-1">
              <span>{{ item.raw.phone }}</span>
              <span>•</span>
              <span>DL: {{ item.raw.driversLicense }}</span>
            </div>
          </div>
        </template>
      </v-list-item>
    </template>
    <template #chip="{ item }">
      <v-chip>
        <template #prepend>
          <v-avatar color="primary" size="24" class="text-white mr-1.5">
            <span class="text-caption font-weight-bold">{{ item.raw.initials }}</span>
          </v-avatar>
        </template>
        {{ item.raw.fullName }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
interface CustomerOption {
  id: number
  displayName: string
  fullName: string
  initials: string
  email: string
  phone: string
  driversLicense: string
  totalRentals: number
}

defineProps<{
  modelValue: number | null
  customers: CustomerOption[]
  rules?: Array<(value: any) => boolean | string>
}>()

defineEmits<{
  'update:modelValue': [value: number | null]
}>()
</script>
