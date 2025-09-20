"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { SweetForm } from "@/components/admin/sweet-form"
import { AdminSweetCard } from "@/components/admin/admin-sweet-card"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Package, TrendingUp, Users, DollarSign } from "lucide-react"
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

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSweet, setEditingSweet] = useState<Sweet | undefined>()

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  const fetchSweets = async () => {
    setLoading(true)
    const response = await apiClient.getSweets()

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
    if (user?.role === "ADMIN") {
      fetchSweets()
    }
  }, [user])

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingSweet(undefined)
    fetchSweets()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingSweet(undefined)
  }

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet)
    setShowForm(true)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "ADMIN") {
    return null // Will redirect
  }

  // Calculate stats
  const totalSweets = sweets.length
  const totalValue = sweets.reduce((sum, sweet) => sum + sweet.price * sweet.quantity, 0)
  const lowStockItems = sweets.filter((sweet) => sweet.quantity < 10).length
  const outOfStockItems = sweets.filter((sweet) => sweet.quantity === 0).length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your sweet shop inventory and operations</p>
          </div>

          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Back to Shop
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSweets}</div>
              <p className="text-xs text-muted-foreground">Active products in inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total inventory worth</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Items with less than 10 units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
              <p className="text-xs text-muted-foreground">Items that need restocking</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
            <TabsTrigger value="add">Add New Sweet</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Sweet
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sweets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No sweets in inventory</p>
                  <p className="text-muted-foreground text-center mb-4">
                    Start by adding your first sweet to the inventory
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Sweet
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sweets.map((sweet) => (
                  <AdminSweetCard key={sweet.id} sweet={sweet} onEdit={handleEdit} onUpdate={fetchSweets} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <SweetForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
          </TabsContent>
        </Tabs>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <SweetForm sweet={editingSweet} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
