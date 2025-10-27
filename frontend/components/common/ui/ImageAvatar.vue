<template>
  <div class="image-avatar-wrapper" :class="wrapperClass">
    <v-avatar
      :size="size"
      :rounded="rounded"
      :class="['image-avatar', avatarClass, { 'image-avatar--clickable': clickable }]"
      @click="handleClick"
    >
      <!-- Image with fallback -->
      <v-img
        v-if="!imageError && computedImageUrl"
        :src="computedImageUrl"
        :alt="alt"
        :cover="cover"
        :lazy-src="lazySrc"
        @error="handleImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate color="primary" size="24" />
          </div>
        </template>
      </v-img>

      <!-- Fallback: Icon or Initials -->
      <div
        v-else
        class="image-avatar__fallback"
        :style="{ background: fallbackColor }"
      >
        <!-- Icon fallback -->
        <v-icon
          v-if="fallbackIcon"
          :icon="fallbackIcon"
          :size="iconSize"
          :color="iconColor"
        />
        <!-- Initials fallback -->
        <span
          v-else-if="initials"
          class="image-avatar__initials"
          :style="{ fontSize: initialsSize }"
        >
          {{ initials }}
        </span>
        <!-- Default icon -->
        <v-icon v-else :icon="defaultIcon" :size="iconSize" :color="iconColor" />
      </div>

      <!-- Badge overlay -->
      <div v-if="badge" class="image-avatar__badge">
        <v-badge :content="badge" :color="badgeColor" floating />
      </div>
    </v-avatar>

    <!-- Optional label below avatar -->
    <div v-if="label" class="image-avatar__label text-caption text-center mt-1">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  // Image source
  src?: string | null
  alt?: string
  lazySrc?: string
  // Size and style
  size?: string | number
  rounded?: string | number | boolean
  cover?: boolean
  // Fallback options
  fallbackIcon?: string
  initials?: string
  fallbackColor?: string
  iconSize?: string | number
  iconColor?: string
  initialsSize?: string
  // Default icon when no fallback provided
  defaultIcon?: string
  // Badge
  badge?: string | number
  badgeColor?: string
  // Label
  label?: string
  // Interaction
  clickable?: boolean
  // Classes
  avatarClass?: string
  wrapperClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Image',
  size: 48,
  rounded: '12',
  cover: true,
  iconSize: 24,
  iconColor: 'white',
  initialsSize: '1rem',
  defaultIcon: 'mdi-image',
  badgeColor: 'error',
  clickable: false,
  avatarClass: '',
  wrapperClass: '',
})

const emit = defineEmits<{
  click: []
  error: [error: Event]
}>()

const imageError = ref(false)

const computedImageUrl = computed(() => {
  if (!props.src) return null
  // Reset error when src changes
  imageError.value = false
  return props.src
})

const fallbackColor = computed(() => {
  if (props.fallbackColor) return props.fallbackColor

  // Generate color from initials or use default gradient
  if (props.initials) {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    ]
    const index = props.initials.charCodeAt(0) % colors.length
    return colors[index]
  }

  return 'linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-secondary), 0.1))'
})

const handleImageError = (error: Event) => {
  imageError.value = true
  emit('error', error)
}

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.image-avatar-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.image-avatar {
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
}

.image-avatar--clickable {
  cursor: pointer;
}

.image-avatar--clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.image-avatar__fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1),
    rgba(var(--v-theme-secondary), 0.1)
  );
}

.image-avatar__initials {
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  user-select: none;
}

.image-avatar__badge {
  position: absolute;
  top: 0;
  right: 0;
}

.image-avatar__label {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgb(var(--v-theme-on-surface-variant));
}
</style>
