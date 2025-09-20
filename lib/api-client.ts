interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl = "/api"
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token)
      } else {
        localStorage.removeItem("auth_token")
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "An error occurred" }
      }

      return { data, message: data.message }
    } catch (error) {
      return { error: "Network error occurred" }
    }
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  // Sweet endpoints
  async getSweets() {
    return this.request("/sweets")
  }

  async searchSweets(params: {
    name?: string
    category?: string
    minPrice?: number
    maxPrice?: number
  }) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value.toString())
      }
    })
    return this.request(`/sweets/search?${searchParams.toString()}`)
  }

  async createSweet(sweetData: {
    name: string
    category: string
    price: number
    quantity: number
    description?: string
    imageUrl?: string
  }) {
    return this.request("/sweets", {
      method: "POST",
      body: JSON.stringify(sweetData),
    })
  }

  async updateSweet(
    id: string,
    sweetData: {
      name: string
      category: string
      price: number
      quantity: number
      description?: string
      imageUrl?: string
    },
  ) {
    return this.request(`/sweets/${id}`, {
      method: "PUT",
      body: JSON.stringify(sweetData),
    })
  }

  async deleteSweet(id: string) {
    return this.request(`/sweets/${id}`, {
      method: "DELETE",
    })
  }

  async purchaseSweet(id: string, quantity: number) {
    return this.request(`/sweets/${id}/purchase`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    })
  }

  async restockSweet(id: string, quantity: number) {
    return this.request(`/sweets/${id}/restock`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    })
  }
}

export const apiClient = new ApiClient()
