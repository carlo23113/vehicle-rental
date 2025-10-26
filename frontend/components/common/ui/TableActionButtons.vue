<template>
  <div class="flex gap-2" @click.stop>
    <slot name="prepend" />

    <CommonUiTableActionButton
      v-if="showView"
      icon="mdi-eye"
      :tooltip="viewTooltip"
      color="info"
      @click="$emit('view')"
    />

    <CommonUiTableActionButton
      v-if="showEdit"
      icon="mdi-pencil"
      :tooltip="editTooltip"
      color="primary"
      @click="$emit('edit')"
    />

    <slot name="middle" />

    <CommonUiTableActionButton
      v-if="showDelete"
      icon="mdi-delete"
      :tooltip="deleteTooltip"
      color="error"
      @click="$emit('delete')"
    />

    <slot name="append" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showView?: boolean
    showEdit?: boolean
    showDelete?: boolean
    viewTooltip?: string
    editTooltip?: string
    deleteTooltip?: string
  }>(),
  {
    showView: true,
    showEdit: true,
    showDelete: true,
    viewTooltip: 'View Details',
    editTooltip: 'Edit',
    deleteTooltip: 'Delete',
  }
)

defineEmits<{
  view: []
  edit: []
  delete: []
}>()
</script>
