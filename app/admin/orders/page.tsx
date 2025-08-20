import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import OrdersManagement from "@/components/admin/orders-management"

export default async function AdminOrdersPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch orders with user and item details
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      profiles (full_name, email),
      order_items (
        id,
        product_name,
        quantity,
        unit_price,
        total_price
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <AdminLayout>
      <OrdersManagement orders={orders || []} />
    </AdminLayout>
  )
}
