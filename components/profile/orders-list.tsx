"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { Package, Truck, CheckCircle, XCircle } from "lucide-react"

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  order_items: Array<{
    id: string
    product_name: string
    product_image: string
    size: string
    color: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

interface OrdersListProps {
  orders: Order[]
}

export default function OrdersList({ orders }: OrdersListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "confirmed":
        return <Package className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  if (orders.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-6">You haven't placed any orders yet</p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground">{orders.length} orders found</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                  <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="font-bold text-foreground">₹{order.total_amount.toLocaleString()}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {order.order_items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.product_image || "/placeholder.svg?height=60&width=60"}
                          alt={item.product_name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{item.product_name}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">₹{item.total_price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">₹{item.unit_price} each</p>
                      </div>
                    </div>
                    {index < order.order_items.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button asChild variant="outline">
                  <Link href={`/profile/orders/${order.id}`}>View Details</Link>
                </Button>
                {order.status === "delivered" && <Button variant="outline">Write Review</Button>}
                {order.status === "shipped" && <Button variant="outline">Track Order</Button>}
                {(order.status === "pending" || order.status === "confirmed") && (
                  <Button variant="outline" className="text-destructive hover:text-destructive bg-transparent">
                    Cancel Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
