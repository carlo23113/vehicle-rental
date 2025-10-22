<template>
  <v-menu v-model="isOpen" offset="8">
    <template v-slot:activator="{ props }">
      <NavbarActionButton v-bind="props">
        <v-icon>mdi-plus-circle</v-icon>
        <ClientOnly>
          <v-tooltip activator="parent" location="bottom">Quick Add</v-tooltip>
        </ClientOnly>
      </NavbarActionButton>
    </template>

    <NavbarPanel width="280">
      <v-card-title class="p-4">
        <h3 class="text-subtitle-1 font-bold">Quick Add</h3>
        <p class="text-caption text-medium-emphasis m-0">Create new items</p>
      </v-card-title>
      <v-divider />
      <v-list class="bg-transparent p-2" density="comfortable">
        <v-list-item
          v-for="action in actions"
          :key="action.action"
          class="rounded-xl mb-1 last:mb-0 border-l-[3px] border-transparent transition-all duration-300 cursor-pointer hover:bg-primary/6 hover:border-l-primary hover:translate-x-1"
          @click="handleClick(action.action)"
        >
          <template v-slot:prepend>
            <v-avatar :color="action.color" size="40" variant="tonal">
              <v-icon :color="action.color" size="20">{{ action.icon }}</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-2 font-medium">
            {{ action.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ action.subtitle }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </NavbarPanel>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)

const actions = ref([
  {
    title: 'New Rental',
    subtitle: 'Create new rental agreement',
    icon: 'mdi-file-document-plus',
    action: 'new-rental',
    color: 'primary',
  },
  {
    title: 'Add Vehicle',
    subtitle: 'Register new vehicle',
    icon: 'mdi-car',
    action: 'add-vehicle',
    color: 'success',
  },
  {
    title: 'Add Customer',
    subtitle: 'Register new customer',
    icon: 'mdi-account-plus',
    action: 'add-customer',
    color: 'info',
  },
  {
    title: 'Generate Report',
    subtitle: 'Create financial report',
    icon: 'mdi-file-chart',
    action: 'generate-report',
    color: 'secondary',
  },
])

const handleClick = (action: string) => {
  isOpen.value = false

  switch (action) {
    case 'new-rental':
      router.push('/rentals/add')
      break
    case 'add-vehicle':
      router.push('/vehicles/add')
      break
    case 'add-customer':
      router.push('/customers?action=new')
      break
    case 'generate-report':
      router.push('/reports')
      break
  }
}
</script>
