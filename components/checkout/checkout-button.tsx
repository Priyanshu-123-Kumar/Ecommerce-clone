"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

interface CheckoutButtonProps {
  disabled?: boolean
  className?: string
}

export default function CheckoutButton({ disabled, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      router.push("/checkout")
    } catch (error) {
      console.error("Error navigating to checkout:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={disabled || loading} className={className} size="lg">
      <ShoppingBag className="h-4 w-4 mr-2" />
      {loading ? "Loading..." : "Proceed to Checkout"}
    </Button>
  )
}
