"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, X, Upload, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AddProductFormProps {
  shopId: string
  onClose: () => void
}

export default function AddProductForm({ shopId, onClose }: AddProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"])
  const [colors, setColors] = useState<string[]>(["Black", "White"])
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize])
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size))
  }

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor])
      setNewColor("")
    }
  }

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const productData = {
      shop_id: shopId,
      name: formData.get("name") as string,
      slug: (formData.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      original_price: formData.get("original_price")
        ? Number.parseFloat(formData.get("original_price") as string)
        : null,
      stock_quantity: Number.parseInt(formData.get("stock_quantity") as string),
      sizes: sizes,
      colors: colors,
      images: [], // TODO: Handle image uploads
      is_active: true,
      is_featured: false,
    }

    // Calculate discount percentage if original price is provided
    if (productData.original_price && productData.original_price > productData.price) {
      productData.discount_percentage = Math.round(
        ((productData.original_price - productData.price) / productData.original_price) * 100,
      )
    }

    try {
      const { error } = await supabase.from("products").insert([productData])

      if (error) {
        setError(error.message)
        return
      }

      router.refresh()
      onClose()
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-card-foreground">Add New Product</CardTitle>
              <CardDescription>Fill in the product details to add it to your catalog</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your product"
                  rows={4}
                  className="bg-input border-border"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">Pricing</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (Optional)</Label>
                  <Input
                    id="original_price"
                    name="original_price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">Inventory</h3>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  placeholder="0"
                  required
                  className="bg-input border-border"
                />
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">Product Variants</h3>

              {/* Sizes */}
              <div className="space-y-2">
                <Label>Available Sizes</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Add size"
                    className="bg-input border-border"
                  />
                  <Button type="button" onClick={addSize} variant="outline" className="border-border bg-transparent">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label>Available Colors</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {colors.map((color) => (
                    <div key={color} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add color"
                    className="bg-input border-border"
                  />
                  <Button type="button" onClick={addColor} variant="outline" className="border-border bg-transparent">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">Product Images</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Upload product images</p>
                <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                <Button type="button" variant="outline" className="mt-4 border-border bg-transparent">
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onClose} className="border-border bg-transparent">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
