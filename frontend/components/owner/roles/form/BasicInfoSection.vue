<template>
  <div class="relative mb-7">
    <CommonUiSectionHeader
      title="Basic Information"
      subtitle="Define the role's name and purpose"
    />

    <CommonFormField label="Role Name">
      <v-text-field
        :model-value="name"
        @update:model-value="$emit('update:name', $event)"
        variant="outlined"
        density="compact"
        placeholder="e.g., Customer Support Manager"
        class="rounded-lg transition-all duration-200"
        hide-details="auto"
      />
    </CommonFormField>

    <CommonFormField label="Description" container-class="">
      <v-textarea
        :model-value="description"
        @update:model-value="$emit('update:description', $event)"
        variant="outlined"
        density="compact"
        placeholder="Describe the role's responsibilities and scope"
        class="rounded-lg transition-all duration-200"
        rows="2"
        hide-details="auto"
      />
    </CommonFormField>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  description: string
}>()

defineEmits<{
  'update:name': [value: string]
  'update:description': [value: string]
}>()
</script>
