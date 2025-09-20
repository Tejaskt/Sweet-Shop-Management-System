"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { SweetCard } from "@/components/sweets/sweet-card"
import { SearchFilters } from "@/components/sweets/search-filters"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Sweet {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState<any>({})

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  const fetchSweets = async (filters = {}) => {
    setLoading(true)
    const response =
      Object.keys(filters).length > 0 ? await apiClient.searchSweets(filters) : await apiClient.getSweets()

    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      })
    } else {
      setSweets(response.data?.sweets || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) {
      fetchSweets()
    }
  }, [user])

  const handleSearch = (filters: any) => {
    setSearchFilters(filters)
    fetchSweets(filters)
  }

  const handleSweetUpdate = () => {
    fetchSweets(searchFilters)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  const categories = [...new Set(sweets.map((sweet) => sweet.category))].sort()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Sweet Shop Dashboard</h1>
            <p className="text-muted-foreground mt-2">Discover and purchase your favorite sweets</p>
          </div>

          {user.role === "ADMIN" && (
            <div className="flex gap-2">
              <Button onClick={() => router.push("/admin")} variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Admin Panel
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters onSearch={handleSearch} categories={categories} />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sweets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-lg font-medium mb-2">No sweets found</p>
                  <p className="text-muted-foreground text-center">
                    {Object.keys(searchFilters).length > 0
                      ? "Try adjusting your search filters"
                      : "No sweets are currently available"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sweets.map((sweet) => (
                  <SweetCard key={sweet.id} sweet={sweet} onUpdate={handleSweetUpdate} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
