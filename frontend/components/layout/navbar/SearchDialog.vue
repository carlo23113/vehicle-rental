<template>
  <v-dialog v-model="isOpen" max-width="700" transition="dialog-top-transition">
    <v-card class="search-dialog" rounded="xl">
      <v-card-text class="pa-0">
        <div class="search-input-wrapper">
          <v-icon class="search-icon ml-6">mdi-magnify</v-icon>
          <input
            ref="searchInput"
            v-model="query"
            type="text"
            placeholder="Search for vehicles, rentals, customers, invoices..."
            class="search-input"
            @input="handleInput"
          />
          <v-btn
            icon
            variant="text"
            size="small"
            class="mr-2"
            @click="close"
          >
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </div>

        <v-divider></v-divider>

        <!-- Search Results -->
        <div v-if="query" class="search-results">
          <div v-if="filteredResults.vehicles.length > 0" class="result-category">
            <div class="category-header">
              <v-icon size="18" color="success">mdi-car</v-icon>
              <span class="category-title">Vehicles</span>
            </div>
            <v-list density="compact" class="result-list">
              <v-list-item
                v-for="item in filteredResults.vehicles"
                :key="item.id"
                class="result-item"
                @click="navigate(item.route)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="item.color" size="36" variant="tonal">
                    <v-icon :color="item.color" size="18">{{ item.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2">{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ item.subtitle }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>

          <div v-if="filteredResults.rentals.length > 0" class="result-category">
            <div class="category-header">
              <v-icon size="18" color="primary">mdi-file-document</v-icon>
              <span class="category-title">Rentals</span>
            </div>
            <v-list density="compact" class="result-list">
              <v-list-item
                v-for="item in filteredResults.rentals"
                :key="item.id"
                class="result-item"
                @click="navigate(item.route)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="item.color" size="36" variant="tonal">
                    <v-icon :color="item.color" size="18">{{ item.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2">{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ item.subtitle }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>

          <div v-if="filteredResults.customers.length > 0" class="result-category">
            <div class="category-header">
              <v-icon size="18" color="info">mdi-account</v-icon>
              <span class="category-title">Customers</span>
            </div>
            <v-list density="compact" class="result-list">
              <v-list-item
                v-for="item in filteredResults.customers"
                :key="item.id"
                class="result-item"
                @click="navigate(item.route)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="item.color" size="36" variant="tonal">
                    <span class="text-caption font-weight-bold">{{ item.initials }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2">{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ item.subtitle }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>

          <div v-if="filteredResults.pages.length > 0" class="result-category">
            <div class="category-header">
              <v-icon size="18" color="secondary">mdi-view-dashboard</v-icon>
              <span class="category-title">Pages</span>
            </div>
            <v-list density="compact" class="result-list">
              <v-list-item
                v-for="item in filteredResults.pages"
                :key="item.id"
                class="result-item"
                @click="navigate(item.route)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="item.color" size="36" variant="tonal">
                    <v-icon :color="item.color" size="18">{{ item.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2">{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ item.subtitle }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>

          <div v-if="!hasResults" class="no-results">
            <v-icon size="48" color="grey-lighten-1">mdi-magnify</v-icon>
            <p class="text-body-2 text-medium-emphasis mt-4">No results found for "{{ query }}"</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="search-empty-state">
          <v-icon size="48" color="grey-lighten-1">mdi-magnify</v-icon>
          <p class="text-body-2 text-medium-emphasis mt-4">Start typing to search</p>
          <div class="quick-search-tips mt-6">
            <p class="text-caption font-weight-bold mb-2">Quick Tips</p>
            <div class="d-flex flex-wrap gap-2 justify-center">
              <v-chip size="small" variant="tonal" @click="query = 'Toyota'">Vehicles</v-chip>
              <v-chip size="small" variant="tonal" @click="query = 'Rental'">Rentals</v-chip>
              <v-chip size="small" variant="tonal" @click="query = 'John'">Customers</v-chip>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isOpen = defineModel<boolean>({ default: false })

const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const searchData = ref({
  vehicles: [
    { id: 1, title: 'Toyota Camry 2023', subtitle: 'ABC-1234 • Available', icon: 'mdi-car', color: 'success', route: '/vehicles/1' },
    { id: 2, title: 'Honda CR-V 2024', subtitle: 'XYZ-5678 • Rented', icon: 'mdi-car', color: 'primary', route: '/vehicles/2' },
    { id: 3, title: 'Ford Explorer 2023', subtitle: 'DEF-9012 • Maintenance', icon: 'mdi-car', color: 'warning', route: '/vehicles/3' },
    { id: 4, title: 'Tesla Model 3', subtitle: 'GHI-3456 • Available', icon: 'mdi-car', color: 'success', route: '/vehicles/4' },
  ],
  rentals: [
    { id: 1, title: 'Rental #1234', subtitle: 'John Smith • Active', icon: 'mdi-file-document', color: 'success', route: '/rentals/1' },
    { id: 2, title: 'Rental #1235', subtitle: 'Sarah Johnson • Active', icon: 'mdi-file-document', color: 'success', route: '/rentals/2' },
    { id: 3, title: 'Rental #1236', subtitle: 'Michael Brown • Completed', icon: 'mdi-file-document', color: 'info', route: '/rentals/3' },
  ],
  customers: [
    { id: 1, title: 'John Smith', subtitle: 'john@example.com', initials: 'JS', color: 'primary', route: '/customers/1' },
    { id: 2, title: 'Sarah Johnson', subtitle: 'sarah@example.com', initials: 'SJ', color: 'secondary', route: '/customers/2' },
    { id: 3, title: 'Michael Brown', subtitle: 'michael@example.com', initials: 'MB', color: 'info', route: '/customers/3' },
  ],
  pages: [
    { id: 1, title: 'Dashboard', subtitle: 'Overview and statistics', icon: 'mdi-view-dashboard', color: 'primary', route: '/dashboard' },
    { id: 2, title: 'Vehicles', subtitle: 'Manage vehicles', icon: 'mdi-car-multiple', color: 'success', route: '/vehicles' },
    { id: 3, title: 'Rentals', subtitle: 'Manage rentals', icon: 'mdi-file-document-multiple', color: 'info', route: '/rentals' },
    { id: 4, title: 'Customers', subtitle: 'Manage customers', icon: 'mdi-account-group', color: 'warning', route: '/customers' },
    { id: 5, title: 'Documents', subtitle: 'Manage documents', icon: 'mdi-file-document-multiple', color: 'warning', route: '/documents' },
    { id: 6, title: 'Invoices', subtitle: 'Manage invoices & receipts', icon: 'mdi-file-document-outline', color: 'info', route: '/invoices' },
    { id: 7, title: 'Reports', subtitle: 'Financial reports', icon: 'mdi-chart-box', color: 'secondary', route: '/reports' },
  ],
})

const filteredResults = computed(() => {
  const searchQuery = query.value.toLowerCase().trim()

  if (!searchQuery) {
    return {
      vehicles: [],
      rentals: [],
      customers: [],
      pages: [],
    }
  }

  return {
    vehicles: searchData.value.vehicles.filter(item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.subtitle.toLowerCase().includes(searchQuery)
    ).slice(0, 3),
    rentals: searchData.value.rentals.filter(item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.subtitle.toLowerCase().includes(searchQuery)
    ).slice(0, 3),
    customers: searchData.value.customers.filter(item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.subtitle.toLowerCase().includes(searchQuery)
    ).slice(0, 3),
    pages: searchData.value.pages.filter(item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.subtitle.toLowerCase().includes(searchQuery)
    ).slice(0, 3),
  }
})

const hasResults = computed(() => {
  return filteredResults.value.vehicles.length > 0 ||
         filteredResults.value.rentals.length > 0 ||
         filteredResults.value.customers.length > 0 ||
         filteredResults.value.pages.length > 0
})

const handleInput = () => {
  // Trigger search filtering (handled by computed)
}

const navigate = (route: string) => {
  isOpen.value = false
  query.value = ''
  router.push(route)
}

const close = () => {
  isOpen.value = false
}

watch(isOpen, (open) => {
  if (open) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    query.value = ''
  }
})
</script>

<style scoped>
.search-dialog {
  overflow: hidden;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 12px 0;
  gap: 12px;
}

.search-icon {
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 8px 0;
  background: transparent;
  color: rgb(var(--v-theme-on-surface));
}

.search-input::placeholder {
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.search-results {
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
}

.result-category {
  margin-bottom: 24px;
}

.result-category:last-child {
  margin-bottom: 0;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.category-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.result-list {
  background: transparent;
}

.result-item {
  border-radius: 12px;
  margin-bottom: 4px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.result-item:hover {
  background: rgba(var(--v-theme-primary), 0.06);
  border-left-color: rgb(var(--v-theme-primary));
  transform: translateX(4px);
}

.search-empty-state,
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.quick-search-tips {
  width: 100%;
  max-width: 300px;
}
</style>
