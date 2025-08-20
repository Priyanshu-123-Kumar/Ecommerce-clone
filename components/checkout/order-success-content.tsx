"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, Package, Truck, Home, Download } from "lucide-react"
import Link from "next/link"

interface OrderDetails {
  id: string
  total_amount: number
  status: string
  payment_method: string
  created_at: string
  addresses: {
    full_name: string
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    postal_code: string
    phone: string
  }
  order_items: Array<{
    quantity: number
    price: number
    size: string
    color: string
    products: {
      name: string
      brand: string
      image_url: string
    }
  }>
}

interface OrderSuccessContentProps {
  orderId: string
}

export default function OrderSuccessContent({ orderId }: OrderSuccessContentProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          addresses (*),
          order_items (
            *,
            products (name, brand, image_url)
          )
        `)
        .eq("id", orderId)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order not found</h2>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Order ID: #{order.id.slice(-8).toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {new Date(order.created_at).toLocaleDateString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium text-green-600">Confirmed</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Package className="h-4 w-4 text-gray-400" />
              </div>
              <span className="text-xs text-gray-400">Processing</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Truck className="h-4 w-4 text-gray-400" />
              </div>
              <span className="text-xs text-gray-400">Shipped</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Home className="h-4 w-4 text-gray-400" />
              </div>
              <span className="text-xs text-gray-400">Delivered</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.order_items.map((item, index) => (
            <div key={index} className="flex gap-4">
              <img
                src={item.products.image_url || "/placeholder.svg"}
                alt={item.products.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.products.name}</h4>
                <p className="text-sm text-gray-600">{item.products.brand}</p>
                <p className="text-sm text-gray-600">
                  Size: {item.size} | Color: {item.color}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>₹{order.total_amount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <p className="font-medium">{order.addresses.full_name}</p>
            <p>{order.addresses.address_line_1}</p>
            {order.addresses.address_line_2 && <p>{order.addresses.address_line_2}</p>}
            <p>
              {order.addresses.city}, {order.addresses.state} {order.addresses.postal_code}
            </p>
            <p>{order.addresses.phone}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/profile/orders" className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            <Package className="h-4 w-4 mr-2" />
            Track Order
          </Button>
        </Link>
        <Button variant="outline" className="flex-1 bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Download Invoice
        </Button>
        <Link href="/" className="flex-1">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
