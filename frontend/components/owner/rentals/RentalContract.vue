<template>
  <div class="rental-contract" v-html="renderedContract"></div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useContractTemplate } from '~/composables/useContractTemplate'
import {
  replaceContractVariables,
  getContractVariablesFromRental,
} from '~/utils/contractVariables'

interface Props {
  rental: any
}

const props = defineProps<Props>()

const { contractTemplate, loadTemplate } = useContractTemplate()

// Generate the contract with replaced variables
const renderedContract = computed(() => {
  const template = contractTemplate.value.fullContractTemplate

  const variables = getContractVariablesFromRental(props.rental, {
    name: contractTemplate.value.companyName,
    address: contractTemplate.value.companyAddress,
    phone: contractTemplate.value.companyPhone,
    email: contractTemplate.value.companyEmail,
  })

  return replaceContractVariables(template, variables)
})

onMounted(() => {
  loadTemplate()
})
</script>

<style scoped>
.rental-contract {
  padding: 2rem;
  background: white;
  min-height: 100vh;
}

/* Ensure proper spacing for TipTap generated content */
.rental-contract :deep(p) {
  margin: 0.5rem 0;
  min-height: 1.5em;
  line-height: 1.5;
}

.rental-contract :deep(p:empty) {
  min-height: 1.5em;
}

.rental-contract :deep(p:first-child) {
  margin-top: 0;
}

.rental-contract :deep(p:last-child) {
  margin-bottom: 0;
}

.rental-contract :deep(br) {
  display: block;
  margin: 0.5rem 0;
  content: "";
}

.rental-contract :deep(h1),
.rental-contract :deep(h2),
.rental-contract :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.rental-contract :deep(h1:first-child),
.rental-contract :deep(h2:first-child),
.rental-contract :deep(h3:first-child) {
  margin-top: 0;
}

.rental-contract :deep(ul),
.rental-contract :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.rental-contract :deep(ul) {
  list-style-type: disc;
  list-style-position: outside;
}

.rental-contract :deep(ol) {
  list-style-type: decimal;
  list-style-position: outside;
}

.rental-contract :deep(li) {
  margin: 0.25rem 0;
  display: list-item;
}

.rental-contract :deep(hr) {
  margin: 2rem 0;
}

.rental-contract :deep(table) {
  margin: 1rem 0;
}

/* Print styles */
@media print {
  .rental-contract {
    padding: 0;
  }
}
</style>
