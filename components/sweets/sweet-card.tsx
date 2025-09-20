"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"
import { ShoppingCart, Package, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Sweet {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
}

interface SweetCardProps {
  sweet: Sweet
  onUpdate?: () => void
}

export function SweetCard({ sweet, onUpdate }: SweetCardProps) {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handlePurchase = async () => {
    if (!user) return

    setLoading(true)
    const response = await apiClient.purchaseSweet(sweet.id, purchaseQuantity)

    if (response.error) {
      toast({
        title: "Purchase Failed",
        description: response.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${purchaseQuantity} ${sweet.name}(s)`,
      })
      setPurchaseQuantity(1)
      onUpdate?.()
    }
    setLoading(false)
  }

  const isOutOfStock = sweet.quantity === 0
  const maxPurchaseQuantity = Math.min(sweet.quantity, 10)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        {sweet.imageUrl && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
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
            <p className="text-2xl font-bold text-primary">${sweet.price.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {sweet.description && <p className="text-sm text-muted-foreground mb-4 text-pretty">{sweet.description}</p>}

        <div className="flex items-center gap-2 mb-4">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{sweet.quantity} in stock</span>
          {isOutOfStock && (
            <Badge variant="destructive" className="ml-auto">
              Out of Stock
            </Badge>
          )}
        </div>

        <div className="mt-auto">
          {!isOutOfStock && user && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor={`quantity-${sweet.id}`} className="text-sm">
                  Quantity:
                </Label>
                <Input
                  id={`quantity-${sweet.id}`}
                  type="number"
                  min="1"
                  max={maxPurchaseQuantity}
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(Number.parseInt(e.target.value) || 1)}
                  className="w-20"
                />
              </div>
              <Button onClick={handlePurchase} disabled={loading || isOutOfStock} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy for ${(sweet.price * purchaseQuantity).toFixed(2)}
              </Button>
            </div>
          )}

          {isOutOfStock && (
            <Button disabled className="w-full">
              <Package className="mr-2 h-4 w-4" />
              Out of Stock
            </Button>
          )}

          {!user && (
            <Button disabled className="w-full">
              Sign in to Purchase
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
