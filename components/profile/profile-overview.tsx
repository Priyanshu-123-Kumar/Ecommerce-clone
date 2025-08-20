"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Package, MapPin, Heart, ShoppingBag } from "lucide-react"

interface ProfileOverviewProps {
  user: any
  profile: any
  recentOrders: any[]
}

export default function ProfileOverview({ user, profile, recentOrders }: ProfileOverviewProps) {
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back, {profile?.full_name || "User"}!</h1>
          <p className="text-muted-foreground">Manage your account, track orders, and update your preferences.</p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{recentOrders.length}</h3>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">0</h3>
            <p className="text-sm text-muted-foreground">Wishlist Items</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">0</h3>
            <p className="text-sm text-muted-foreground">Cart Items</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">0</h3>
            <p className="text-sm text-muted-foreground">Saved Addresses</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Recent Orders</CardTitle>
          <Button asChild variant="outline">
            <Link href="/profile/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className="flex-shrink-0">
                    {order.order_items[0]?.product_image && (
                      <Image
                        src={order.order_items[0].product_image || "/placeholder.svg"}
                        alt={order.order_items[0].product_name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">Order #{order.order_number}</span>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {order.order_items.length} item{order.order_items.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">₹{order.total_amount}</p>
                    <Button asChild variant="outline" size="sm" className="mt-2 bg-transparent">
                      <Link href={`/profile/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-16 flex-col gap-2 bg-transparent">
              <Link href="/profile/addresses">
                <MapPin className="h-5 w-5" />
                Manage Addresses
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 flex-col gap-2 bg-transparent">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                View Wishlist
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 flex-col gap-2 bg-transparent">
              <Link href="/profile/settings">
                <Package className="h-5 w-5" />
                Account Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
