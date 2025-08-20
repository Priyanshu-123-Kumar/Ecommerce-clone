"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Category {
  name: string
  slug: string
}

interface Brand {
  name: string
  slug: string
}

interface SearchFiltersProps {
  categories: Category[]
  brands: Brand[]
  searchParams: any
}

export default function SearchFilters({ categories, brands, searchParams }: SearchFiltersProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  const [minPrice, setMinPrice] = useState(searchParams.min_price || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.max_price || "")

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(currentSearchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/search?${params.toString()}`)
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(currentSearchParams.toString())

    if (minPrice) {
      params.set("min_price", minPrice)
    } else {
      params.delete("min_price")
    }

    if (maxPrice) {
      params.set("max_price", maxPrice)
    } else {
      params.delete("max_price")
    }

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    if (searchParams.q) {
      params.set("q", searchParams.q)
    }
    router.push(`/search?${params.toString()}`)
    setMinPrice("")
    setMaxPrice("")
  }

  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={searchParams.sort || "relevance"} onValueChange={(value) => updateFilters("sort", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shop Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="local-shops"
              checked={searchParams.shop_type === "local"}
              onCheckedChange={(checked) => updateFilters("shop_type", checked ? "local" : null)}
            />
            <Label htmlFor="local-shops" className="text-sm font-normal cursor-pointer">
              Local Shops Only
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price">Min</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="₹0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="max-price">Max</Label>
              <Input
                id="max-price"
                type="number"
                placeholder="₹10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={applyPriceFilter} className="w-full" size="sm">
            Apply
          </Button>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.slug} className="flex items-center space-x-2">
              <Checkbox
                id={category.slug}
                checked={searchParams.category === category.slug}
                onCheckedChange={(checked) => updateFilters("category", checked ? category.slug : null)}
              />
              <Label htmlFor={category.slug} className="text-sm font-normal cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-64 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand.slug} className="flex items-center space-x-2">
              <Checkbox
                id={brand.slug}
                checked={searchParams.brand === brand.slug}
                onCheckedChange={(checked) => updateFilters("brand", checked ? brand.slug : null)}
              />
              <Label htmlFor={brand.slug} className="text-sm font-normal cursor-pointer">
                {brand.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
        Clear All Filters
      </Button>
    </div>
  )
}
