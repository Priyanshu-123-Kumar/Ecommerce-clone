"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddToCartButtonProps {
  productId: string
  selectedSize?: string
  selectedColor?: string
  inStock: boolean
  className?: string
}

export default function AddToCartButton({
  productId,
  selectedSize,
  selectedColor,
  inStock,
  className,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const router = useRouter()

  const addToCart = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          size: selectedSize,
          color: selectedColor,
        }),
      })

      if (response.ok) {
        router.refresh()
        // You could add a toast notification here
      } else {
        const error = await response.json()
        console.error("Failed to add to cart:", error)
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    }

    setLoading(false)
  }

  const toggleWishlist = async () => {
    setWishlistLoading(true)

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      })

      if (response.ok) {
        router.refresh()
        // You could add a toast notification here
      } else {
        const error = await response.json()
        console.error("Failed to toggle wishlist:", error)
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }

    setWishlistLoading(false)
  }

  return (
    <div className={`flex gap-3 ${className}`}>
      <Button onClick={addToCart} disabled={!inStock || loading} className="flex-1 bg-primary hover:bg-primary/90 h-12">
        {loading ? (
          "Adding..."
        ) : !inStock ? (
          "Out of Stock"
        ) : (
          <>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>

      <Button
        variant="outline"
        onClick={toggleWishlist}
        disabled={wishlistLoading}
        className="h-12 px-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
      >
        <Heart className="h-4 w-4" />
      </Button>
    </div>
  )
}
