import { createServerClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import HeroSection from "@/components/home/hero-section"
import FeaturedProducts from "@/components/home/featured-products"
import CategoryGrid from "@/components/home/category-grid"
import TrendingSection from "@/components/home/trending-section"
import NewsletterSection from "@/components/home/newsletter-section"
import NearbyShopsSection from "@/components/home/nearby-shops-section"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default async function HomePage() {
  const supabase = createServerClient()

  // Fetch featured products, categories, and sample shops
  const [{ data: featuredProducts }, { data: categories }, { data: sampleShops }] = await Promise.all([
    supabase
      .from("products")
      .select(`
        *,
        brands (name, slug),
        categories (name, slug),
        shops (name, city, state, logo_url)
      `)
      .eq("is_featured", true)
      .eq("is_active", true)
      .limit(8),
    supabase.from("categories").select("*").is("parent_id", null).limit(6),
    supabase
      .from("shops")
      .select(`
        *,
        profiles!shops_seller_id_fkey(full_name)
      `)
      .eq("is_active", true)
      .eq("is_verified", true)
      .order("created_at", { ascending: false })
      .limit(6),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroSection />

        <Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
          <CategoryGrid categories={categories || []} />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
          <FeaturedProducts products={featuredProducts || []} />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
          <NearbyShopsSection shops={sampleShops || []} />
        </Suspense>

        <TrendingSection />

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  )
}
