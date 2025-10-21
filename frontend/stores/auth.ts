import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'staff'
}

interface LoginCredentials {
  email: string
  password: string
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role)
  const userName = computed(() => user.value?.name)

  // Actions
  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: credentials,
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock successful login
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: 'John Doe',
          role: 'admin',
        }
        const mockToken = 'mock-jwt-token-' + Date.now()

        user.value = mockUser
        token.value = mockToken

        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', mockToken)
          localStorage.setItem('auth_user', JSON.stringify(mockUser))
        }

        return { user: mockUser, token: mockToken }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Login failed')
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      // TODO: Replace with actual API call
      // await $fetch('/api/auth/logout', {
      //   method: 'POST',
      // })

      // Clear state
      user.value = null
      token.value = null

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    } catch (error: any) {
      console.error('Logout error:', error)
    } finally {
      loading.value = false
    }
  }

  const checkAuth = () => {
    // Check if user is authenticated from localStorage
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        return true
      }
    }
    return false
  }

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }

      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }
    }
  }

  return {
    // State
    user,
    token,
    loading,
    // Getters
    isAuthenticated,
    userRole,
    userName,
    // Actions
    login,
    logout,
    checkAuth,
    updateUser,
  }
})
