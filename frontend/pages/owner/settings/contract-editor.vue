<template>
  <div class="min-h-screen p-0 bg-background">
    <!-- Header -->
    <EditorHeader
      title="Contract Editor"
      subtitle="Customize your rental agreement template"
      :has-unsaved-changes="hasUnsavedChanges"
      :saving="saving"
      @back="$router.push('/owner/settings')"
      @reset="handleReset"
      @save="handleSave"
    />

    <!-- Tabs -->
    <div class="px-8 bg-surface border-b border-border/[0.08]">
      <v-tabs v-model="activeTab" bg-color="transparent" color="primary" density="comfortable">
        <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
          <v-icon size="18" start>{{ tab.icon }}</v-icon>
          {{ tab.label }}
          <v-badge v-if="tab.badge" color="warning" dot inline class="ml-2" />
        </v-tab>
      </v-tabs>
    </div>

    <!-- Content Area -->
    <div class="max-w-6xl mx-auto px-8 py-8 md:px-8 md:py-8">
      <v-window v-model="activeTab" class="bg-transparent">
        <!-- Editor Tab -->
        <v-window-item value="editor">
          <v-form ref="formRef">
            <div class="flex flex-col gap-6">
              <EditorSection
                v-model="form.fullContractTemplate"
                title="Full Contract Template"
                subtitle="Customize the entire contract with dynamic variables. Use {{VARIABLE_NAME}} format for placeholders."
                icon="mdi-file-document-edit"
                placeholder="Enter your complete contract template here..."
              >
                <template #actions>
                  <v-btn
                    size="small"
                    variant="text"
                    prepend-icon="mdi-variable"
                    @click="showVariables = true"
                  >
                    Variables
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="text"
                    prepend-icon="mdi-help-circle-outline"
                    @click="showHelp = true"
                  >
                    Help
                  </v-btn>
                </template>
              </EditorSection>
            </div>
          </v-form>
        </v-window-item>

        <!-- Preview Tab -->
        <v-window-item value="preview">
          <ContractPreview :rental="mockRental" @print="handlePrint" />
        </v-window-item>
      </v-window>
    </div>

    <!-- Dialogs -->
    <LazyVariablesDialog v-if="showVariables" v-model="showVariables" />
    <LazyHelpDialog v-if="showHelp" v-model="showHelp" />
    <LazyContractDialog v-if="showPreview" v-model="showPreview" @print="handlePrint">
      <LazyRentalContract :rental="mockRental" />
    </LazyContractDialog>

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useContractTemplate } from '~/composables/useContractTemplate'
import {
  useContractEditorMock,
  useContractEditorForm,
  useContractEditorTabs,
} from '~/composables/useContractEditor'
import { printContract } from '~/utils/contractPrint'

const formRef = ref()
const saving = ref(false)
const showPreview = ref(false)
const showHelp = ref(false)
const showVariables = ref(false)

const { contractTemplate, saveTemplate, loadTemplate, resetTemplate, defaultTemplate } =
  useContractTemplate()
const { mockRental } = useContractEditorMock()
const { form, hasUnsavedChanges, resetForm, markAsSaved } = useContractEditorForm(
  contractTemplate.value
)
const { activeTab, tabs } = useContractEditorTabs(hasUnsavedChanges)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success' as 'success' | 'error',
  icon: 'mdi-check-circle',
})

const handleSave = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    saveTemplate(form.value)
    markAsSaved()
    snackbar.value = {
      show: true,
      message: 'Contract template saved successfully',
      color: 'success',
      icon: 'mdi-check-circle',
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Failed to save template',
      color: 'error',
      icon: 'mdi-alert-circle',
    }
  } finally {
    saving.value = false
  }
}

const handleReset = () => {
  if (
    confirm(
      'Are you sure you want to reset to the default template? This will discard all your changes.'
    )
  ) {
    resetTemplate()
    resetForm(defaultTemplate)
    snackbar.value = {
      show: true,
      message: 'Template reset to default',
      color: 'success',
      icon: 'mdi-check-circle',
    }
  }
}

const handlePrint = () => {
  printContract({ title: 'Contract Template Preview' })
}

onMounted(async () => {
  console.log(
    '1. Before loadTemplate:',
    contractTemplate.value.fullContractTemplate?.substring(0, 100)
  )

  loadTemplate()

  console.log(
    '2. After loadTemplate:',
    contractTemplate.value.fullContractTemplate?.substring(0, 100)
  )

  // Wait for next tick to ensure template is loaded
  await nextTick()

  console.log('3. Before resetForm:', form.value.fullContractTemplate?.substring(0, 100))

  resetForm(contractTemplate.value)

  console.log('4. After resetForm:', form.value.fullContractTemplate?.substring(0, 100))
  console.log('5. Contract template loaded:', {
    hasFullTemplate: !!contractTemplate.value.fullContractTemplate,
    templateLength: contractTemplate.value.fullContractTemplate?.length || 0,
    formTemplateLength: form.value.fullContractTemplate?.length || 0,
  })
})
</script>
