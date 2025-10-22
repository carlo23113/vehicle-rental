<template>
  <div class="bg-surface rounded-2xl border border-border/[0.08] overflow-hidden">
    <div class="flex items-center justify-between px-8 py-6 border-b border-border/[0.08] bg-white">
      <div class="flex items-center gap-3 font-semibold text-base">
        <v-icon size="20" color="primary">mdi-file-document</v-icon>
        <span>Contract Preview</span>
      </div>
      <div class="flex items-center gap-3">
        <v-chip size="small" variant="outlined" prepend-icon="mdi-information-outline">
          Sample Data
        </v-chip>
        <v-btn
          size="small"
          variant="text"
          prepend-icon="mdi-printer"
          @click="$emit('print')"
        >
          Print
        </v-btn>
      </div>
    </div>
    <div class="preview-paper px-8 py-12 max-h-[80vh] overflow-y-auto bg-white">
      <RentalContract :rental="rental" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  rental: any
}>()

defineEmits<{
  print: []
}>()
</script>
