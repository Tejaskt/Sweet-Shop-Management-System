"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = apiClient.getToken()
    if (token) {
      // Verify token is still valid by making a test request
      apiClient.getSweets().then((response) => {
        if (response.error) {
          // Token is invalid, clear it
          apiClient.setToken(null)
        }
      })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password })
    if (response.data) {
      setUser(response.data.user)
      apiClient.setToken(response.data.token)
      return { success: true }
    }
    return { success: false, error: response.error }
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await apiClient.register({ name, email, password })
    if (response.data) {
      setUser(response.data.user)
      apiClient.setToken(response.data.token)
      return { success: true }
    }
    return { success: false, error: response.error }
  }

  const logout = () => {
    setUser(null)
    apiClient.setToken(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
