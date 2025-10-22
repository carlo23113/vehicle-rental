<script setup lang="ts">
defineProps<{
  title: string
  icon: string
  color: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <v-btn
    block
    size="large"
    variant="flat"
    :color="color"
    class="action-button"
    height="90"
    @click="$emit('click')"
  >
    <div class="d-flex flex-column align-center gap-2">
      <div class="icon-wrapper">
        <v-icon :icon="icon" size="32" />
      </div>
      <span class="text-caption font-weight-bold text-capitalize">{{ title }}</span>
    </div>
  </v-btn>
</template>

<style scoped>
.action-button {
  border-radius: 16px;
  text-transform: none;
  letter-spacing: normal;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-button:hover::before {
  opacity: 1;
}

.action-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px -8px rgba(0, 0, 0, 0.3);
}

.icon-wrapper {
  transition: transform 0.3s ease;
}

.action-button:hover .icon-wrapper {
  transform: scale(1.1);
}
</style>
