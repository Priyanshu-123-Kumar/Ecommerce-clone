"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Navigation, ArrowRight } from "lucide-react"
import { getCurrentLocation, formatDistance } from "@/lib/location"
import Image from "next/image"

interface Shop {
  id: string
  name: string
  description: string
  logo_url: string
  banner_url: string
  city: string
  state: string
  business_type: string
  rating: number
  review_count: number
  total_products: number
  latitude: number
  longitude: number
}

interface NearbyShopsSectionProps {
  shops: Shop[]
}

export default function NearbyShopsSection({ shops }: NearbyShopsSectionProps) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)

  const handleFindNearby = async () => {
    setLocationLoading(true)
    try {
      const location = await getCurrentLocation()
      setUserLocation(location)
    } catch (error) {
      console.error("Location error:", error)
    } finally {
      setLocationLoading(false)
    }
  }

  const calculateDistance = (shopLat: number, shopLng: number) => {
    if (!userLocation) return null
    const R = 6371 // Earth's radius in km
    const dLat = (shopLat - userLocation.latitude) * (Math.PI / 180)
    const dLon = (shopLng - userLocation.longitude) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.latitude * (Math.PI / 180)) *
        Math.cos(shopLat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 10) / 10
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Discover Local Shops</h2>
          <p className="text-lg text-muted-foreground mb-6">Find amazing shops near you and support local businesses</p>

          {!userLocation && (
            <Button
              onClick={handleFindNearby}
              disabled={locationLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {locationLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Finding Location...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Find Shops Near Me
                </>
              )}
            </Button>
          )}

          {userLocation && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              Showing shops near your location
            </div>
          )}
        </div>

        {shops.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {shops.slice(0, 6).map((shop) => {
                const distance =
                  shop.latitude && shop.longitude ? calculateDistance(shop.latitude, shop.longitude) : null

                return (
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

                      {distance && (
                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                          {formatDistance(distance)}
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {shop.logo_url ? (
                            <Image
                              src={shop.logo_url || "/placeholder.svg"}
                              alt={shop.name}
                              width={40}
                              height={40}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1">{shop.name}</h3>
                          <p className="text-xs text-muted-foreground mb-1">{shop.business_type}</p>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                              <span>{shop.rating || 0}</span>
                            </div>
                            <span>{shop.total_products || 0} products</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {shop.city}, {shop.state}
                        </span>
                      </div>

                      <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        View Shop
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center">
              <Button asChild variant="outline" className="border-border bg-transparent">
                <Link href="/shops">
                  View All Shops
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No shops available yet</h3>
            <p className="text-muted-foreground">Local shops will appear here once they register on our platform.</p>
          </div>
        )}
      </div>
    </section>
  )
}
