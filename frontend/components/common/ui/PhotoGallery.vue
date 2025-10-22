<template>
  <div class="photo-gallery">
    <!-- Main Photo -->
    <div v-if="photos.length > 0" class="main-photo-wrapper">
      <div class="main-photo">
        <img
          :src="photos[selectedIndex]"
          :alt="`Photo ${selectedIndex + 1}`"
          class="main-image"
        />
        <div class="photo-navigation">
          <v-btn
            v-if="photos.length > 1"
            icon="mdi-chevron-left"
            size="small"
            variant="flat"
            color="white"
            class="nav-btn"
            @click="previousPhoto"
          />
          <v-btn
            v-if="photos.length > 1"
            icon="mdi-chevron-right"
            size="small"
            variant="flat"
            color="white"
            class="nav-btn"
            @click="nextPhoto"
          />
        </div>
        <div v-if="photos.length > 1" class="photo-counter">
          {{ selectedIndex + 1 }} / {{ photos.length }}
        </div>
      </div>
    </div>

    <!-- Thumbnail Grid -->
    <div v-if="photos.length > 1" class="thumbnail-grid">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="thumbnail"
        :class="{ active: index === selectedIndex }"
        @click="selectedIndex = index"
      >
        <img :src="photo" :alt="`Thumbnail ${index + 1}`" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="photos.length === 0" class="empty-gallery">
      <v-icon icon="mdi-image-off" size="64" class="empty-icon" />
      <p class="text-sm text-medium-emphasis mt-3">No photos available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  photos: string[]
}

const props = defineProps<Props>()

const selectedIndex = ref(0)

const nextPhoto = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.photos.length
}

const previousPhoto = () => {
  selectedIndex.value = selectedIndex.value === 0
    ? props.photos.length - 1
    : selectedIndex.value - 1
}
</script>

<style scoped>
.photo-gallery {
  width: 100%;
}

.main-photo-wrapper {
  margin-bottom: 1rem;
}

.main-photo {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-photo:hover .main-image {
  transform: scale(1.05);
}

.photo-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-photo:hover .photo-navigation {
  opacity: 1;
}

.nav-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.photo-counter {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.thumbnail {
  aspect-ratio: 4/3;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.thumbnail:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.thumbnail.active {
  opacity: 1;
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.3);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-gallery {
  aspect-ratio: 16/9;
  border: 2px dashed rgba(var(--v-border-color), 0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-surface-variant), 0.1);
}

.empty-icon {
  opacity: 0.3;
}
</style>
