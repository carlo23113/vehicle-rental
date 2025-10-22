import { ref, onMounted, onUnmounted } from 'vue'

export const useScrollDetection = (threshold: number = 10) => {
  const isScrolled = ref(false)

  const handleScroll = () => {
    isScrolled.value = window.scrollY > threshold
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    // Check initial scroll position
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isScrolled
  }
}
