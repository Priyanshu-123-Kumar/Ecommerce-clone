import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import WishlistItems from "@/components/wishlist/wishlist-items"

export default async function WishlistPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch wishlist items with product details
  const { data: wishlistItems } = await supabase
    .from("wishlist_items")
    .select(`
      *,
      products (
        id,
        name,
        slug,
        price,
        original_price,
        discount_percentage,
        images,
        rating,
        review_count,
        stock_quantity,
        brands (name)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlistItems?.length || 0} items in your wishlist</p>
        </div>

        {wishlistItems && wishlistItems.length > 0 ? (
          <WishlistItems items={wishlistItems} />
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">Save items you love for later</p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
