<template>
  <v-chip :color="color" :size="size" :variant="variant" :class="chipClass" v-bind="$attrs">
    <v-icon
      v-if="icon"
      :icon="icon"
      :start="iconPosition === 'start'"
      :end="iconPosition === 'end'"
      :size="iconSize"
    />
    <slot>{{ label }}</slot>
  </v-chip>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    color?: string
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
    variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
    icon?: string
    iconSize?: string | number
    iconPosition?: 'start' | 'end'
    chipClass?: string
  }>(),
  {
    label: '',
    color: 'primary',
    size: 'small',
    variant: 'flat',
    icon: undefined,
    iconSize: 14,
    iconPosition: 'start',
    chipClass: '',
  }
)
</script>
