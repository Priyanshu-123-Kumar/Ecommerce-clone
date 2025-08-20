"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface CartItem {
  id: string
  quantity: number
  products: {
    price: number
    original_price: number
  }
}

interface CartSummaryProps {
  items: CartItem[]
}

export default function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.products.price * item.quantity, 0)
  const originalTotal = items.reduce((sum, item) => sum + item.products.original_price * item.quantity, 0)
  const savings = originalTotal - subtotal
  const shipping = subtotal > 999 ? 0 : 99
  const total = subtotal + shipping

  return (
    <Card className="border-0 shadow-lg sticky top-24">
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between text-green-600">
              <span>You Save</span>
              <span className="font-medium">-₹{savings.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Shipping {subtotal > 999 && <span className="text-green-600">(Free)</span>}
            </span>
            <span className="font-medium">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>

          {subtotal <= 999 && (
            <p className="text-sm text-muted-foreground">
              Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping
            </p>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>

        <Button asChild className="w-full bg-primary hover:bg-primary/90 h-12 text-lg">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>

        <div className="text-center">
          <Link href="/" className="text-sm text-primary hover:text-primary/80 transition-colors">
            Continue Shopping
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground">Secure Payment</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground">Easy Returns</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
