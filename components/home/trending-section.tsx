import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { TrendingUp, Zap, Award } from "lucide-react"

export default function TrendingSection() {
  const trendingItems = [
    {
      icon: TrendingUp,
      title: "Trending Now",
      description: "Oversized blazers and wide-leg trousers",
      link: "/trending",
      color: "text-primary",
    },
    {
      icon: Zap,
      title: "Flash Sale",
      description: "Up to 70% off on selected items",
      link: "/sale",
      color: "text-secondary",
    },
    {
      icon: Award,
      title: "New Arrivals",
      description: "Fresh styles from top brands",
      link: "/new-arrivals",
      color: "text-accent",
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What's Trending</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay ahead of the fashion curve with our trending picks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingItems.map((item, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50">
              <CardContent className="p-8 text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform ${item.color}`}
                >
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <Link href={item.link}>Explore Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
