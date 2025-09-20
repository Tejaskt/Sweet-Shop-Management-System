"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiClient } from "@/lib/api-client"
import { Loader2, Plus, Edit } from "lucide-react"
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

interface SweetFormProps {
  sweet?: Sweet
  onSuccess: () => void
  onCancel: () => void
}

export function SweetForm({ sweet, onSuccess, onCancel }: SweetFormProps) {
  const [formData, setFormData] = useState({
    name: sweet?.name || "",
    category: sweet?.category || "",
    price: sweet?.price?.toString() || "",
    quantity: sweet?.quantity?.toString() || "",
    description: sweet?.description || "",
    imageUrl: sweet?.imageUrl || "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const sweetData = {
      name: formData.name,
      category: formData.category,
      price: Number.parseFloat(formData.price),
      quantity: Number.parseInt(formData.quantity),
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
    }

    const response = sweet ? await apiClient.updateSweet(sweet.id, sweetData) : await apiClient.createSweet(sweetData)

    if (response.error) {
      toast({
        title: sweet ? "Update Failed" : "Creation Failed",
        description: response.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: sweet ? "Sweet Updated" : "Sweet Created",
        description: sweet ? "Sweet updated successfully" : "New sweet added to inventory",
      })
      onSuccess()
    }
    setLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {sweet ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {sweet ? "Edit Sweet" : "Add New Sweet"}
        </CardTitle>
        <CardDescription>
          {sweet ? "Update the sweet's information" : "Add a new sweet to your inventory"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Sweet name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                required
                placeholder="e.g., Chocolate, Gummies, Cookies"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                required
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the sweet..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sweet ? "Update Sweet" : "Add Sweet"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
