"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Filter, Star, Phone, Navigation, Loader2 } from "lucide-react"
import { getCurrentLocation, calculateDistance, formatDistance, type Coordinates } from "@/lib/location"
import Image from "next/image"

interface Shop {
  id: string
  name: string
  description: string
  logo_url: string
  banner_url: string
  phone: string
  email: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  postal_code: string
  latitude: number
  longitude: number
  business_type: string
  rating: number
  review_count: number
  total_products: number
  profiles?: { full_name: string }
  distance?: number
}

interface ShopsDiscoveryContentProps {
  initialShops: Shop[]
}

export default function ShopsDiscoveryContent({ initialShops }: ShopsDiscoveryContentProps) {
  const [shops, setShops] = useState<Shop[]>(initialShops)
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "newest">("distance")

  const requestLocation = async () => {
    setLocationLoading(true)
    setLocationError("")

    try {
      const location = await getCurrentLocation()
      setUserLocation(location)

      // Fetch nearby shops
      const response = await fetch(
        `/api/shops/nearby?latitude=${location.latitude}&longitude=${location.longitude}&radius=50`,
      )

      if (response.ok) {
        const { shops: nearbyShops } = await response.json()
        setShops(nearbyShops)
      }
    } catch (error: any) {
      setLocationError(error.message)
    } finally {
      setLocationLoading(false)
    }
  }

  // Calculate distances for shops if user location is available
  useEffect(() => {
    if (userLocation) {
      const shopsWithDistance = shops.map((shop) => ({
        ...shop,
        distance:
          shop.latitude && shop.longitude
            ? calculateDistance(userLocation.latitude, userLocation.longitude, shop.latitude, shop.longitude)
            : undefined,
      }))
      setShops(shopsWithDistance)
    }
  }, [userLocation])

  const filteredAndSortedShops = shops
    .filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.business_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.city.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          if (!a.distance && !b.distance) return 0
          if (!a.distance) return 1
          if (!b.distance) return -1
          return a.distance - b.distance
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Discover Local Shops</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Find amazing shops near you and explore their unique products
          </p>

          {!userLocation && (
            <Button
              onClick={requestLocation}
              disabled={locationLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Find Shops Near Me
                </>
              )}
            </Button>
          )}

          {locationError && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg max-w-md mx-auto">
              {locationError}
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search shops, categories, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-border rounded-md bg-input text-foreground"
                  >
                    <option value="distance">Sort by Distance</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="newest">Sort by Newest</option>
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Location Status */}
        {userLocation && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Showing shops near your location</span>
            </div>
          </div>
        )}

        {/* Shops Grid */}
        {filteredAndSortedShops.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No shops found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search criteria." : "No shops available in this area."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedShops.map((shop) => (
              <Card key={shop.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video relative bg-muted rounded-t-lg overflow-hidden">
                    {shop.banner_url ? (
                      <Image
                        src={shop.banner_url || "/placeholder.svg"}
                        alt={shop.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <MapPin className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {shop.distance && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      {formatDistance(shop.distance)}
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {shop.logo_url ? (
                        <Image
                          src={shop.logo_url || "/placeholder.svg"}
                          alt={shop.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <MapPin className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg mb-1">{shop.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{shop.business_type}</p>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                          <span>{shop.rating || 0}</span>
                          <span className="ml-1">({shop.review_count || 0})</span>
                        </div>
                        <span>{shop.total_products || 0} products</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {shop.address_line_1}, {shop.city}
                      </span>
                    </div>

                    {shop.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span>{shop.phone}</span>
                      </div>
                    )}
                  </div>

                  {shop.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{shop.description}</p>
                  )}

                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">View Shop</Button>
                    <Button variant="outline" size="sm" className="border-border bg-transparent">
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
