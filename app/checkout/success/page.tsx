"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, Home } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  total_amount: number
  shipping_amount: number
  payment_method: string
  status: string
  created_at: string
  addresses: {
    full_name: string
    address_line_1: string
    city: string
    state: string
    postal_code: string
  }
  order_items: {
    quantity: number
    price: number
    size: string
    color: string
    products: {
      name: string
      image_url: string
      brand: string
    }
  }[]
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("order_id")
  const supabase = createClient()

  useEffect(() => {
    if (!orderId) {
      router.push("/")
      return
    }
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: orderData, error } = await supabase
        .from("orders")
        .select(`
          *,
          addresses (*),
          order_items (
            *,
            products (name, image_url, brand)
          )
        `)
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single()

      if (error) throw error
      setOrder(orderData)
    } catch (error) {
      console.error("Error fetching order:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{order.id.slice(0, 8).toUpperCase()}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.products.image_url || "/placeholder.svg"}
                        alt={item.products.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.products.name}</h3>
                        <p className="text-sm text-gray-500">{item.products.brand}</p>
                        <p className="text-sm text-gray-500">
                          Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{order.addresses.full_name}</p>
                  <p className="text-gray-600">{order.addresses.address_line_1}</p>
                  <p className="text-gray-600">
                    {order.addresses.city}, {order.addresses.state} {order.addresses.postal_code}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{(order.total_amount - order.shipping_amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {order.shipping_amount === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${order.shipping_amount}`
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{order.total_amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                  <p className="font-medium">
                    {order.payment_method === "cod" ? "Cash on Delivery" : "Credit/Debit Card"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Order Confirmed</p>
                      <p className="text-gray-500">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Order Shipped</p>
                      <p className="text-gray-500">Within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Out for Delivery</p>
                      <p className="text-gray-500">2-3 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Delivered</p>
                      <p className="text-gray-500">3-5 business days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/profile/orders" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  <Package className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button className="w-full">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
