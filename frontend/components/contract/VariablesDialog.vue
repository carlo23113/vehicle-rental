<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="700">
    <v-card>
      <v-card-title class="pa-6 d-flex align-center">
        <v-icon icon="mdi-variable" class="mr-3" color="primary" />
        <span class="text-h5 font-weight-bold">Available Variables</span>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <p class="text-body-2 text-medium-emphasis mb-4">
          Use these variables in your contract template. They will be automatically replaced with actual data when generating contracts.
        </p>

        <v-alert type="info" variant="tonal" class="mb-4">
          <template #text>
            <strong>Tip:</strong> Copy a variable and paste it anywhere in your contract template. Make sure to keep the {{}} format intact.
          </template>
        </v-alert>

        <v-text-field
          v-model="search"
          variant="outlined"
          density="comfortable"
          placeholder="Search variables..."
          prepend-inner-icon="mdi-magnify"
          clearable
          class="mb-4"
        />

        <div class="variables-list">
          <div
            v-for="variable in filteredVariables"
            :key="variable.key"
            class="variable-item"
          >
            <div class="d-flex align-center justify-space-between">
              <div class="flex-grow-1">
                <code class="variable-code">{{ variable.key }}</code>
                <p class="text-caption text-medium-emphasis mb-0 mt-1">{{ variable.description }}</p>
              </div>
              <v-btn
                icon="mdi-content-copy"
                size="small"
                variant="text"
                @click="copyVariable(variable.key)"
              />
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">Close</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Copy Snackbar -->
    <v-snackbar v-model="copySnackbar" :timeout="2000" color="success">
      <v-icon icon="mdi-check" start />
      Variable copied to clipboard!
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAvailableVariables } from '~/utils/contractVariables'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const search = ref('')
const copySnackbar = ref(false)

const variables = getAvailableVariables()

const filteredVariables = computed(() => {
  if (!search.value) return variables

  const searchLower = search.value.toLowerCase()
  return variables.filter(v =>
    v.key.toLowerCase().includes(searchLower) ||
    v.description.toLowerCase().includes(searchLower)
  )
})

const copyVariable = async (variable: string) => {
  try {
    await navigator.clipboard.writeText(variable)
    copySnackbar.value = true
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}
</script>

<style scoped>
.variables-list {
  max-height: 400px;
  overflow-y: auto;
}

.variable-item {
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(var(--v-border-color), 0.08);
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
}

.variable-item:hover {
  border-color: rgba(var(--v-border-color), 0.12);
  background-color: rgba(var(--v-theme-surface), 0.5);
}

.variable-code {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: rgba(var(--v-theme-primary), 0.08);
  color: rgb(var(--v-theme-primary));
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
