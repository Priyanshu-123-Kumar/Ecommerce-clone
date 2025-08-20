import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProfileSidebar from "@/components/profile/profile-sidebar"
import ProfileOverview from "@/components/profile/profile-overview"

export default async function ProfilePage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        product_name,
        product_image,
        quantity,
        unit_price
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} profile={profile} />
          </div>
          <div className="lg:col-span-3">
            <ProfileOverview user={user} profile={profile} recentOrders={recentOrders || []} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
