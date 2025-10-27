<template>
  <v-card variant="outlined" class="range-filter">
    <v-card-text class="pb-2">
      <div class="d-flex align-center justify-space-between mb-2">
        <label class="text-subtitle-2 font-weight-bold">{{ label }}</label>
        <v-btn
          v-if="hasValue"
          variant="text"
          size="x-small"
          color="primary"
          @click="clearRange"
        >
          Clear
        </v-btn>
      </div>

      <v-row dense>
        <v-col cols="6">
          <v-text-field
            :model-value="min"
            type="number"
            variant="outlined"
            density="compact"
            :label="`Min ${unit}`"
            :prefix="prefix"
            :suffix="suffix"
            hide-details
            @update:model-value="updateMin"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            :model-value="max"
            type="number"
            variant="outlined"
            density="compact"
            :label="`Max ${unit}`"
            :prefix="prefix"
            :suffix="suffix"
            hide-details
            @update:model-value="updateMax"
          />
        </v-col>
      </v-row>

      <!-- Optional: Range Slider -->
      <v-range-slider
        v-if="showSlider && sliderMin !== undefined && sliderMax !== undefined"
        :model-value="[min ?? sliderMin, max ?? sliderMax]"
        :min="sliderMin"
        :max="sliderMax"
        :step="step"
        class="mt-4"
        hide-details
        color="primary"
        @update:model-value="updateFromSlider"
      >
        <template #prepend>
          <v-chip size="x-small" variant="text">
            {{ formatValue(min ?? sliderMin) }}
          </v-chip>
        </template>
        <template #append>
          <v-chip size="x-small" variant="text">
            {{ formatValue(max ?? sliderMax) }}
          </v-chip>
        </template>
      </v-range-slider>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
export interface RangeFilterProps {
  label: string
  min?: number | null
  max?: number | null
  unit?: string
  prefix?: string
  suffix?: string
  showSlider?: boolean
  sliderMin?: number
  sliderMax?: number
  step?: number
}

const props = withDefaults(defineProps<RangeFilterProps>(), {
  unit: '',
  prefix: '',
  suffix: '',
  showSlider: false,
  step: 1,
})

const emit = defineEmits<{
  'update:min': [value: number | null]
  'update:max': [value: number | null]
}>()

const hasValue = computed(() => props.min !== null || props.max !== null)

const updateMin = (value: string | number) => {
  const numValue = value === '' || value === null ? null : Number(value)
  emit('update:min', numValue)
}

const updateMax = (value: string | number) => {
  const numValue = value === '' || value === null ? null : Number(value)
  emit('update:max', numValue)
}

const updateFromSlider = (value: number[]) => {
  if (props.sliderMin !== undefined && props.sliderMax !== undefined) {
    emit('update:min', value[0] === props.sliderMin ? null : value[0])
    emit('update:max', value[1] === props.sliderMax ? null : value[1])
  }
}

const clearRange = () => {
  emit('update:min', null)
  emit('update:max', null)
}

const formatValue = (value: number) => {
  return `${props.prefix}${value.toLocaleString()}${props.suffix}`
}
</script>

<style scoped>
.range-filter {
  border: 1px solid rgba(var(--v-border-color), 0.12);
}
</style>
