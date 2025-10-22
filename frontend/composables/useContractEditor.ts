import { ref, computed } from 'vue'
import type { ContractTemplate } from './useContractTemplate'
import type { Tab } from '~/components/contract/EditorTabs.vue'

export const useContractEditorMock = () => {
  const mockRental = ref({
    id: '12345',
    status: 'active',
    startDate: '2025-01-15',
    endDate: '2025-01-16',
    amountOfDays: 1,
    rateType: 'city' as 'city' | 'province',
    dailyRate: 45,
    totalAmount: 45,
    pickupTime: '08:00',
    returnTime: '08:00',
    mileageLimit: 100,
    notes: 'Sample rental for contract preview',
    customer: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      license: 'DL123456789',
    },
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      licensePlate: 'ABC-1234',
      color: 'Silver',
      mileage: 15420,
    },
    pickupLocation: {
      name: 'Downtown Main Branch',
      address: '123 Main St, Downtown',
    },
  })

  return {
    mockRental,
  }
}

export const useContractEditorForm = (initialTemplate: ContractTemplate) => {
  const form = ref<ContractTemplate>({ ...initialTemplate })
  const savedForm = ref<ContractTemplate>({ ...initialTemplate })

  const hasUnsavedChanges = computed(() => {
    return JSON.stringify(form.value) !== JSON.stringify(savedForm.value)
  })

  const resetForm = (template: ContractTemplate) => {
    form.value = { ...template }
    savedForm.value = { ...template }
  }

  const markAsSaved = () => {
    savedForm.value = { ...form.value }
  }

  return {
    form,
    savedForm,
    hasUnsavedChanges,
    resetForm,
    markAsSaved,
  }
}

export const useContractEditorTabs = (hasUnsavedChanges: { value: boolean }) => {
  const activeTab = ref('editor')

  const tabs = computed<Tab[]>(() => [
    {
      value: 'editor',
      label: 'Edit',
      icon: 'mdi-pencil',
      badge: hasUnsavedChanges.value && activeTab.value === 'editor',
    },
    {
      value: 'preview',
      label: 'Preview',
      icon: 'mdi-eye',
    },
  ])

  return {
    activeTab,
    tabs,
  }
}
