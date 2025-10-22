import { onMounted, onUnmounted } from 'vue'

export interface KeyboardShortcut {
  key: string
  meta?: boolean
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  callback: () => void
  description?: string
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const metaMatch = shortcut.meta === undefined || shortcut.meta === e.metaKey
      const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === e.ctrlKey
      const shiftMatch = shortcut.shift === undefined || shortcut.shift === e.shiftKey
      const altMatch = shortcut.alt === undefined || shortcut.alt === e.altKey
      const keyMatch = shortcut.key.toLowerCase() === e.key.toLowerCase()

      if (metaMatch && ctrlMatch && shiftMatch && altMatch && keyMatch) {
        e.preventDefault()
        shortcut.callback()
        break
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    shortcuts
  }
}
