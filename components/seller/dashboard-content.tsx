"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, Package, ShoppingCart, TrendingUp, Plus, MapPin, Star } from "lucide-react"
import SellerSidebar from "@/components/seller/sidebar"
import ShopRegistrationForm from "@/components/seller/shop-registration-form"

interface SellerDashboardContentProps {
  user: any
  shop: any
}

export default function SellerDashboardContent({ user, shop }: SellerDashboardContentProps) {
  const [showShopForm, setShowShopForm] = useState(false)

  if (!shop) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <SellerSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <Store className="h-16 w-16 text-primary mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Seller Dashboard</h1>
                <p className="text-muted-foreground text-lg mb-8">
                  Start your journey by registering your shop and begin selling to thousands of customers.
                </p>
                <Button
                  onClick={() => setShowShopForm(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Register Your Shop
                </Button>
              </div>

              {showShopForm && <ShopRegistrationForm userId={user.id} onClose={() => setShowShopForm(false)} />}
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <SellerSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user.email}</p>
              </div>
              <Badge variant={shop.is_verified ? "default" : "secondary"} className="text-sm">
                {shop.is_verified ? "Verified Shop" : "Pending Verification"}
              </Badge>
            </div>

            {/* Shop Info Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Store className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-card-foreground">{shop.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {shop.city}, {shop.state}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {shop.rating || 0} ({shop.review_count || 0} reviews)
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" className="border-border bg-transparent">
                    Edit Shop
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{shop.total_products || 0}</div>
                  <p className="text-xs text-muted-foreground">Active listings</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">0</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">₹0</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Shop Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{shop.rating || 0}</div>
                  <p className="text-xs text-muted-foreground">Average rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
                <CardDescription>Manage your shop and products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                  <Button variant="outline" className="border-border h-12 bg-transparent">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Inventory
                  </Button>
                  <Button variant="outline" className="border-border h-12 bg-transparent">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
