"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ShoppingBag, Star } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface WishlistItem {
  id: string
  products: {
    id: string
    name: string
    slug: string
    price: number
    original_price: number
    discount_percentage: number
    images: string[]
    rating: number
    review_count: number
    stock_quantity: number
    brands: { name: string }
  }
}

interface WishlistItemsProps {
  items: WishlistItem[]
}

export default function WishlistItems({ items }: WishlistItemsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const removeFromWishlist = async (itemId: string) => {
    setLoading(itemId)

    const { error } = await supabase.from("wishlist_items").delete().eq("id", itemId)

    if (!error) {
      router.refresh()
    }

    setLoading(null)
  }

  const moveToCart = async (item: WishlistItem) => {
    setLoading(item.id)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Add to cart
      const { error: cartError } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: item.products.id,
        quantity: 1,
      })

      if (!cartError) {
        // Remove from wishlist
        await supabase.from("wishlist_items").delete().eq("id", item.id)

        router.refresh()
      }
    }

    setLoading(null)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-background">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <Link href={`/product/${item.products.slug}`}>
                <Image
                  src={item.products.images[0] || "/placeholder.svg?height=300&width=250"}
                  alt={item.products.name}
                  width={250}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {item.products.discount_percentage > 0 && (
                <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                  {item.products.discount_percentage}% OFF
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromWishlist(item.id)}
                disabled={loading === item.id}
                className="absolute top-3 right-3 bg-background/80 hover:bg-background text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <div className="mb-2">
                <p className="text-sm text-muted-foreground">{item.products.brands.name}</p>
                <Link href={`/product/${item.products.slug}`}>
                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                    {item.products.name}
                  </h3>
                </Link>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{item.products.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({item.products.review_count})</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-foreground">₹{item.products.price}</span>
                {item.products.original_price > item.products.price && (
                  <span className="text-sm text-muted-foreground line-through">₹{item.products.original_price}</span>
                )}
              </div>

              <Button
                onClick={() => moveToCart(item)}
                disabled={loading === item.id || item.products.stock_quantity === 0}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {loading === item.id ? (
                  "Moving..."
                ) : item.products.stock_quantity === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Move to Cart
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
