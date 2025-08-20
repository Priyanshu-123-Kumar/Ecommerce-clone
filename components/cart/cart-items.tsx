"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  quantity: number
  size: string
  color: string
  products: {
    id: string
    name: string
    slug: string
    price: number
    original_price: number
    images: string[]
    stock_quantity: number
    brands: { name: string }
  }
}

interface CartItemsProps {
  items: CartItem[]
}

export default function CartItems({ items }: CartItemsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    setLoading(itemId)

    const { error } = await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", itemId)

    if (!error) {
      router.refresh()
    }

    setLoading(null)
  }

  const removeItem = async (itemId: string) => {
    setLoading(itemId)

    const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

    if (!error) {
      router.refresh()
    }

    setLoading(null)
  }

  const moveToWishlist = async (item: CartItem) => {
    setLoading(item.id)

    // Add to wishlist
    const { error: wishlistError } = await supabase.from("wishlist_items").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      product_id: item.products.id,
    })

    if (!wishlistError) {
      // Remove from cart
      await supabase.from("cart_items").delete().eq("id", item.id)

      router.refresh()
    }

    setLoading(null)
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <Link href={`/product/${item.products.slug}`}>
                  <Image
                    src={item.products.images[0] || "/placeholder.svg?height=120&width=100"}
                    alt={item.products.name}
                    width={100}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                </Link>
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">{item.products.brands.name}</p>
                  <Link href={`/product/${item.products.slug}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                      {item.products.name}
                    </h3>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.color && <span>Color: {item.color}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">₹{item.products.price}</span>
                  {item.products.original_price > item.products.price && (
                    <span className="text-sm text-muted-foreground line-through">₹{item.products.original_price}</span>
                  )}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex flex-col gap-3 min-w-[120px]">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Select
                    value={item.quantity.toString()}
                    onValueChange={(value) => updateQuantity(item.id, Number.parseInt(value))}
                    disabled={loading === item.id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.min(10, item.products.stock_quantity) }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveToWishlist(item)}
                    disabled={loading === item.id}
                    className="flex-1"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    disabled={loading === item.id}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
