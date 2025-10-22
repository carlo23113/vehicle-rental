<template>
  <CommonFormSection title="Vehicle Photos" icon="mdi-camera">
    <div class="border-2 border-dashed rounded-xl transition-all duration-300 border-[rgba(var(--v-border-color),0.2)] hover:border-primary/30 hover:bg-primary/[0.03]">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileSelect"
      />

      <div v-if="allPhotosComputed.length === 0" class="p-12 text-center cursor-pointer group" @click="fileInputRef?.click()">
        <v-icon icon="mdi-cloud-upload" size="64" class="opacity-40 transition-all duration-300 group-hover:opacity-60 group-hover:scale-110" />
        <h4 class="text-lg font-bold mt-4">Upload Vehicle Photos</h4>
        <p class="text-sm text-medium-emphasis mt-2">
          Click to browse or drag and drop images here
        </p>
        <p class="text-xs text-medium-emphasis mt-1">
          Supports: JPG, PNG, WEBP (Max 5MB each, {{ maxPhotos }} photos max)
        </p>
        <v-btn
          color="primary"
          variant="tonal"
          class="mt-4"
          prepend-icon="mdi-upload"
        >
          Select Photos
        </v-btn>
      </div>

      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 p-4">
        <div
          v-for="(photo, index) in allPhotosComputed"
          :key="isExistingPhoto(photo) ? photo.url : photo.preview"
          class="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-[rgba(var(--v-border-color),0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:border-primary/30 group"
        >
          <img
            :src="isExistingPhoto(photo) ? photo.url : photo.preview"
            :alt="`Vehicle photo ${index + 1}`"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <v-btn
              icon="mdi-delete"
              size="small"
              color="error"
              variant="flat"
              @click="removePhoto(index)"
            />
          </div>
          <v-chip
            v-if="index === 0"
            size="x-small"
            color="primary"
            class="!absolute top-2 left-2 !font-bold"
          >
            Primary
          </v-chip>
        </div>

        <div v-if="allPhotosComputed.length < maxPhotos" class="aspect-[4/3] border-2 border-dashed border-[rgba(var(--v-border-color),0.3)] rounded-xl flex flex-col items-center justify-center cursor-pointer bg-transparent transition-all duration-300 text-[rgba(var(--v-theme-on-surface),0.6)] hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:scale-[1.02]" @click="fileInputRef?.click()">
          <v-icon icon="mdi-plus" size="48" />
          <span class="text-sm font-semibold mt-2">Add More</span>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-3">
      <p class="text-xs text-medium-emphasis">
        <v-icon icon="mdi-information" size="14" class="mr-1" />
        The first photo will be used as the primary image
      </p>
      <p class="text-xs font-semibold" :class="allPhotosComputed.length === maxPhotos ? 'text-warning' : 'text-medium-emphasis'">
        {{ allPhotosComputed.length }} / {{ maxPhotos }} photos
      </p>
    </div>
  </CommonFormSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface PhotoFile {
  file: File
  preview: string
}

export interface ExistingPhoto {
  url: string
  isExisting: true
}

type Photo = PhotoFile | ExistingPhoto

interface Props {
  modelValue: PhotoFile[]
  existingPhotos?: string[]
  maxPhotos?: number
  maxFileSize?: number // in MB
}

const props = withDefaults(defineProps<Props>(), {
  maxPhotos: 6,
  maxFileSize: 5,
  existingPhotos: () => []
})

const emit = defineEmits<{
  'update:modelValue': [photos: PhotoFile[]]
  'error': [message: string]
  'warning': [message: string]
}>()

const fileInputRef = ref<HTMLInputElement>()


const photos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const displayedExistingPhotos = ref<string[]>([])

// Initialize displayed existing photos
watch(() => props.existingPhotos, (newPhotos) => {
  displayedExistingPhotos.value = [...newPhotos]
}, { immediate: true })

const isExistingPhoto = (photo: Photo): photo is ExistingPhoto => {
  return 'isExisting' in photo && photo.isExisting === true
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files) return

  const totalPhotos = displayedExistingPhotos.value.length + photos.value.length
  const remainingSlots = props.maxPhotos - totalPhotos

  if (remainingSlots === 0) {
    emit('error', `Maximum of ${props.maxPhotos} photos allowed. Please remove some photos before adding more.`)
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
    return
  }

  let addedCount = 0
  let skippedFiles: string[] = []
  const newPhotos = [...photos.value]

  Array.from(files).forEach((file) => {
    if (totalPhotos + addedCount >= props.maxPhotos) {
      skippedFiles.push(file.name)
      return
    }

    const maxBytes = props.maxFileSize * 1024 * 1024
    if (file.size > maxBytes) {
      emit('error', `"${file.name}" is too large. Maximum size is ${props.maxFileSize}MB per file.`)
      return
    }

    if (!file.type.startsWith('image/')) {
      emit('error', `"${file.name}" is not a valid image file. Only JPG, PNG, and WEBP are supported.`)
      return
    }

    const preview = URL.createObjectURL(file)
    newPhotos.push({ file, preview })
    addedCount++
  })

  photos.value = newPhotos

  if (skippedFiles.length > 0) {
    emit('warning', `${addedCount} photo(s) added. ${skippedFiles.length} file(s) skipped (maximum ${props.maxPhotos} photos allowed).`)
  }

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const removePhoto = (index: number) => {
  const photo = allPhotosComputed.value[index]
  const existingCount = displayedExistingPhotos.value.length

  if (isExistingPhoto(photo)) {
    // Remove existing photo
    const existingIndex = displayedExistingPhotos.value.indexOf(photo.url)
    if (existingIndex > -1) {
      displayedExistingPhotos.value.splice(existingIndex, 1)
    }
  } else {
    // Remove new uploaded photo
    URL.revokeObjectURL(photo.preview)
    const newPhotoIndex = index - existingCount
    const newPhotos = [...photos.value]
    newPhotos.splice(newPhotoIndex, 1)
    photos.value = newPhotos
  }
}

// Recompute allPhotos to use displayedExistingPhotos
const allPhotosComputed = computed<Photo[]>(() => {
  const existing: ExistingPhoto[] = displayedExistingPhotos.value.map(url => ({ url, isExisting: true as const }))
  return [...existing, ...photos.value]
})

// Expose method to get removed photos
defineExpose({
  getRemovedPhotos: () => {
    return props.existingPhotos.filter(url => !displayedExistingPhotos.value.includes(url))
  }
})

// Cleanup on unmount
onUnmounted(() => {
  photos.value.forEach(photo => URL.revokeObjectURL(photo.preview))
})
</script>
