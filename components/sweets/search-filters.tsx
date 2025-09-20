"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface SearchFiltersProps {
  onSearch: (filters: {
    name?: string
    category?: string
    minPrice?: number
    maxPrice?: number
  }) => void
  categories: string[]
}

export function SearchFilters({ onSearch, categories }: SearchFiltersProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const handleSearch = () => {
    onSearch({
      name: name || undefined,
      category: category === "all" ? undefined : category,
      minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
    })
  }

  const handleClear = () => {
    setName("")
    setCategory("all")
    setMinPrice("")
    setMaxPrice("")
    onSearch({})
  }

  const hasFilters = name || category !== "all" || minPrice || maxPrice

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search-name">Sweet Name</Label>
            <Input
              id="search-name"
              placeholder="Search by name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-price">Min Price ($)</Label>
            <Input
              id="min-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-price">Max Price ($)</Label>
            <Input
              id="max-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="100.00"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          {hasFilters && (
            <Button variant="outline" onClick={handleClear}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
