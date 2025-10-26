<template>
  <CommonFilterSection v-model="modelValue" :filters="filters" @clear="handleClear">
    <v-row dense>
      <v-col cols="12" md="8">
        <v-text-field
          v-model="filters.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by role name or description..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="filters.module"
          :items="moduleFilterOptions"
          variant="outlined"
          density="comfortable"
          label="Module"
          prepend-inner-icon="mdi-view-module"
          clearable
        />
      </v-col>
    </v-row>
  </CommonFilterSection>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true })

const props = defineProps<{
  filters: {
    search: string
    module: string
  }
  moduleFilterOptions: Array<{ title: string; value: string }>
}>()

const emit = defineEmits<{
  clear: []
}>()

const handleClear = () => {
  emit('clear')
}
</script>
