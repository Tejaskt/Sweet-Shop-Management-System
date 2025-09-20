"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Candy, ShoppingCart, Users, Shield } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Candy className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Sweet Shop</h1>
          </div>
          <h2 className="text-3xl font-bold text-balance mb-4">Your favorite sweets, just a click away</h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Discover our delicious collection of candies, chocolates, and treats. Join our community and start your
            sweet journey today.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/auth")}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/auth")}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Easy Shopping</CardTitle>
              <CardDescription>
                Browse our extensive catalog and purchase your favorite sweets with just a few clicks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Community</CardTitle>
              <CardDescription>
                Join thousands of sweet lovers and discover new treats recommended by our community
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Quality Assured</CardTitle>
              <CardDescription>
                All our sweets are carefully selected and quality-tested to ensure the best experience
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
