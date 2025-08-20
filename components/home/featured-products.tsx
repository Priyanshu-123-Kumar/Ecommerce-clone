import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, MapPin } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  original_price: number
  discount_percentage: number
  images: string[]
  rating: number
  review_count: number
  brands: { name: string; slug: string }
  categories: { name: string; slug: string }
  shops?: { name: string; city: string; state: string; logo_url: string }
}

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked favorites from our latest collection and local shops
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-background">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Link href={`/product/${product.slug}`}>
                    <Image
                      src={product.images[0] || "/placeholder.svg?height=300&width=250"}
                      alt={product.name}
                      width={250}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {product.discount_percentage > 0 && (
                    <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                      {product.discount_percentage}% OFF
                    </Badge>
                  )}

                  {product.shops && (
                    <Badge className="absolute top-3 right-12 bg-primary text-primary-foreground text-xs">
                      Local Shop
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground">{product.brands?.name}</p>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  {product.shops && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">
                          {product.shops.name} • {product.shops.city}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.review_count})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                    {product.original_price > product.price && (
                      <span className="text-sm text-muted-foreground line-through">₹{product.original_price}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
