import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import DashboardOverview from "@/components/admin/dashboard-overview"

export default async function AdminDashboardPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // For now, we'll allow any authenticated user to access admin
  // In production, you'd check for admin role in the profiles table

  // Fetch dashboard data
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalUsers },
    { data: recentOrders },
    { data: topProducts },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select(`
        *,
        profiles (full_name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("products").select("*").eq("is_featured", true).order("review_count", { ascending: false }).limit(5),
  ])

  const dashboardData = {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalUsers: totalUsers || 0,
    recentOrders: recentOrders || [],
    topProducts: topProducts || [],
  }

  return (
    <AdminLayout>
      <DashboardOverview data={dashboardData} />
    </AdminLayout>
  )
}
