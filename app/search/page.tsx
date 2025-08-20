import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SearchResults from "@/components/search/search-results"
import SearchFilters from "@/components/search/search-filters"

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    brand?: string
    min_price?: string
    max_price?: string
    sort?: string
    shop_type?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = createClient()
  const query = searchParams.q || ""

  // Build search query
  let searchQuery = supabase
    .from("products")
    .select(`
      *,
      brands (name, slug),
      categories (name, slug),
      shops (name, city, state, logo_url, is_verified)
    `)
    .eq("is_active", true)

  // Apply filters
  if (query) {
    searchQuery = searchQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (searchParams.category) {
    searchQuery = searchQuery.eq("categories.slug", searchParams.category)
  }

  if (searchParams.brand) {
    searchQuery = searchQuery.eq("brands.slug", searchParams.brand)
  }

  if (searchParams.min_price) {
    searchQuery = searchQuery.gte("price", Number.parseFloat(searchParams.min_price))
  }

  if (searchParams.max_price) {
    searchQuery = searchQuery.lte("price", Number.parseFloat(searchParams.max_price))
  }

  if (searchParams.shop_type === "local") {
    searchQuery = searchQuery.not("shop_id", "is", null)
  }

  // Apply sorting
  switch (searchParams.sort) {
    case "price_low":
      searchQuery = searchQuery.order("price", { ascending: true })
      break
    case "price_high":
      searchQuery = searchQuery.order("price", { ascending: false })
      break
    case "rating":
      searchQuery = searchQuery.order("rating", { ascending: false })
      break
    case "newest":
      searchQuery = searchQuery.order("created_at", { ascending: false })
      break
    default:
      searchQuery = searchQuery.order("is_featured", { ascending: false }).order("created_at", { ascending: false })
  }

  const { data: products } = await searchQuery.limit(24)

  // Get filter options
  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from("categories").select("name, slug").is("parent_id", null),
    supabase.from("brands").select("name, slug").order("name"),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {query ? `Search results for "${query}"` : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {products?.length || 0} products found
            {searchParams.shop_type === "local" && " from local shops"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
              <SearchFilters categories={categories || []} brands={brands || []} searchParams={searchParams} />
            </Suspense>
          </aside>

          <div className="flex-1">
            <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
              <SearchResults products={products || []} />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
