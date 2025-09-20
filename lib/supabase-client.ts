import { createClient } from "@/lib/supabase/client"

interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

class SupabaseApiClient {
  private supabase = createClient()

  // Sweet endpoints using Supabase directly
  async getSweets(): Promise<ApiResponse> {
    try {
      const { data: sweets, error } = await this.supabase
        .from("sweets")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        return { error: error.message }
      }

      return { data: { sweets } }
    } catch (error) {
      return { error: "Failed to fetch sweets" }
    }
  }

  async searchSweets(params: {
    name?: string
    category?: string
    minPrice?: number
    maxPrice?: number
  }): Promise<ApiResponse> {
    try {
      let query = this.supabase.from("sweets").select("*").order("created_at", { ascending: false })

      if (params.name) {
        query = query.ilike("name", `%${params.name}%`)
      }
      if (params.category) {
        query = query.eq("category", params.category)
      }
      if (params.minPrice !== undefined) {
        query = query.gte("price", params.minPrice)
      }
      if (params.maxPrice !== undefined) {
        query = query.lte("price", params.maxPrice)
      }

      const { data: sweets, error } = await query

      if (error) {
        return { error: error.message }
      }

      return { data: { sweets } }
    } catch (error) {
      return { error: "Failed to search sweets" }
    }
  }

  async createSweet(sweetData: {
    name: string
    category: string
    price: number
    quantity: number
    description?: string
    image_url?: string
  }): Promise<ApiResponse> {
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
      image_url?: string
    },
  ): Promise<ApiResponse> {
    return this.request(`/sweets/${id}`, {
      method: "PUT",
      body: JSON.stringify(sweetData),
    })
  }

  async deleteSweet(id: string): Promise<ApiResponse> {
    return this.request(`/sweets/${id}`, {
      method: "DELETE",
    })
  }

  async purchaseSweet(id: string, quantity: number): Promise<ApiResponse> {
    return this.request(`/sweets/${id}/purchase`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    })
  }

  async restockSweet(id: string, quantity: number): Promise<ApiResponse> {
    return this.request(`/sweets/${id}/restock`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    })
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    try {
      const response = await fetch(`/api${endpoint}`, {
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
}

export const supabaseApiClient = new SupabaseApiClient()
