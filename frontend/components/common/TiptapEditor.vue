<template>
  <div class="tiptap-editor">
    <!-- Toolbar -->
    <div v-if="editor" class="editor-toolbar">
      <div class="toolbar-group">
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive('bold') }]"
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          title="Bold"
        >
          <v-icon size="18">mdi-format-bold</v-icon>
        </button>
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive('italic') }]"
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          title="Italic"
        >
          <v-icon size="18">mdi-format-italic</v-icon>
        </button>
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive('underline') }]"
          @click="editor.chain().focus().toggleUnderline().run()"
          :disabled="!editor.can().chain().focus().toggleUnderline().run()"
          title="Underline"
        >
          <v-icon size="18">mdi-format-underline</v-icon>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive('heading', { level: 1 }) }]"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive('heading', { level: 2 }) }]"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive('heading', { level: 3 }) }]"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive('bulletList') }]"
          @click="editor.chain().focus().toggleBulletList().run()"
          title="Bullet List"
        >
          <v-icon size="18">mdi-format-list-bulleted</v-icon>
        </button>
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive('orderedList') }]"
          @click="editor.chain().focus().toggleOrderedList().run()"
          title="Numbered List"
        >
          <v-icon size="18">mdi-format-list-numbered</v-icon>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive({ textAlign: 'left' }) }]"
          @click="editor.chain().focus().setTextAlign('left').run()"
          title="Align Left"
        >
          <v-icon size="18">mdi-format-align-left</v-icon>
        </button>
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive({ textAlign: 'center' }) }]"
          @click="editor.chain().focus().setTextAlign('center').run()"
          title="Align Center"
        >
          <v-icon size="18">mdi-format-align-center</v-icon>
        </button>
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive({ textAlign: 'right' }) }]"
          @click="editor.chain().focus().setTextAlign('right').run()"
          title="Align Right"
        >
          <v-icon size="18">mdi-format-align-right</v-icon>
        </button>
        <button
          type="button"
          :class="['toolbar-btn', { 'is-active': editor.isActive({ textAlign: 'justify' }) }]"
          @click="editor.chain().focus().setTextAlign('justify').run()"
          title="Justify"
        >
          <v-icon size="18">mdi-format-align-justify</v-icon>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          type="button"
          class="toolbar-btn"
          @click="editor.chain().focus().setHorizontalRule().run()"
          title="Horizontal Line"
        >
          <v-icon size="18">mdi-minus</v-icon>
        </button>
        <button
          type="button"
          class="toolbar-btn"
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()"
          title="Undo"
        >
          <v-icon size="18">mdi-undo</v-icon>
        </button>
        <button
          type="button"
          class="toolbar-btn"
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().chain().focus().redo().run()"
          title="Redo"
        >
          <v-icon size="18">mdi-redo</v-icon>
        </button>
      </div>
    </div>

    <!-- Editor Content -->
    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: props.placeholder || 'Start typing...',
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
    },
  },
})

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.value?.getHTML() === value
    if (!isSame && editor.value) {
      editor.value.commands.setContent(value)
    }
  }
)
</script>

<style scoped>
.tiptap-editor {
  border: 1px solid rgba(var(--v-border-color), 0.08);
  border-radius: 12px;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
  transition: all 0.2s ease;
}

.tiptap-editor:focus-within {
  border-color: rgba(var(--v-border-color), 0.16);
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
}

.toolbar-group {
  display: flex;
  gap: 2px;
  padding: 2px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  border-radius: 8px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: rgba(var(--v-border-color), 0.12);
  margin: 0 2px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.toolbar-btn:hover:not(:disabled):not(.is-active) {
  background: rgba(var(--v-theme-on-surface), 0.08);
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.toolbar-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.toolbar-btn.is-active {
  background: rgb(var(--v-theme-primary));
  color: white;
}

.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.editor-content {
  padding: 20px;
  min-height: 250px;
  max-height: 450px;
  overflow-y: auto;
  background: rgb(var(--v-theme-surface));
}

.editor-content::-webkit-scrollbar {
  width: 8px;
}

.editor-content::-webkit-scrollbar-track {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 4px;
}

.editor-content::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 4px;
}

.editor-content::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-on-surface), 0.3);
}

:deep(.ProseMirror) {
  outline: none;
  min-height: 250px;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: rgba(var(--v-theme-on-surface), 0.38);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.ProseMirror h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

:deep(.ProseMirror h3) {
  font-size: 1.17em;
  font-weight: bold;
  margin: 0.83em 0;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.5em;
  margin: 1em 0;
}

:deep(.ProseMirror ul) {
  list-style-type: disc;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
}

:deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  margin: 2em 0;
}

:deep(.ProseMirror blockquote) {
  border-left: 3px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
}

:deep(.ProseMirror code) {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

:deep(.ProseMirror pre) {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
}

:deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
}
</style>
