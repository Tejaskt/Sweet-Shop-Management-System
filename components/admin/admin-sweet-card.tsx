"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { Edit, Trash2, Package, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Sweet {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
}

interface AdminSweetCardProps {
  sweet: Sweet
  onEdit: (sweet: Sweet) => void
  onUpdate: () => void
}

export function AdminSweetCard({ sweet, onEdit, onUpdate }: AdminSweetCardProps) {
  const [restockQuantity, setRestockQuantity] = useState(10)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { toast } = useToast()

  const handleRestock = async () => {
    setLoading(true)
    const response = await apiClient.restockSweet(sweet.id, restockQuantity)

    if (response.error) {
      toast({
        title: "Restock Failed",
        description: response.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Restock Successful",
        description: `Added ${restockQuantity} units to ${sweet.name}`,
      })
      onUpdate()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    const response = await apiClient.deleteSweet(sweet.id)

    if (response.error) {
      toast({
        title: "Delete Failed",
        description: response.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Sweet Deleted",
        description: `${sweet.name} has been removed from inventory`,
      })
      onUpdate()
    }
    setDeleteLoading(false)
  }

  const isLowStock = sweet.quantity < 10
  const isOutOfStock = sweet.quantity === 0

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        {sweet.imageUrl && (
          <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-muted">
            <Image
              src={sweet.imageUrl || "/placeholder.svg"}
              alt={sweet.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg text-balance">{sweet.name}</CardTitle>
            <CardDescription className="mt-1">{sweet.category}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">${sweet.price.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {sweet.description && <p className="text-sm text-muted-foreground mb-4 text-pretty">{sweet.description}</p>}

        <div className="flex items-center gap-2 mb-4">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{sweet.quantity} in stock</span>
          {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
          {isLowStock && !isOutOfStock && <Badge variant="outline">Low Stock</Badge>}
        </div>

        <div className="mt-auto space-y-3">
          {/* Restock Section */}
          <div className="space-y-2">
            <Label htmlFor={`restock-${sweet.id}`} className="text-sm font-medium">
              Restock Quantity:
            </Label>
            <div className="flex gap-2">
              <Input
                id={`restock-${sweet.id}`}
                type="number"
                min="1"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(Number.parseInt(e.target.value) || 1)}
                className="flex-1"
              />
              <Button onClick={handleRestock} disabled={loading} size="sm">
                {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                <Package className="mr-1 h-3 w-3" />
                Restock
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={() => onEdit(sweet)} variant="outline" className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Sweet</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{sweet.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={deleteLoading}>
                    {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
