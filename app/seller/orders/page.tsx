import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SellerOrdersContent from "@/components/seller/orders-content"

export default async function SellerOrdersPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is a seller
  const { data: profile } = await supabase.from("profiles").select("user_role").eq("id", user.id).single()

  if (profile?.user_role !== "seller") {
    redirect("/")
  }

  // Get seller's shop
  const { data: shop } = await supabase.from("shops").select("*").eq("seller_id", user.id).single()

  if (!shop) {
    redirect("/seller/dashboard")
  }

  // Get orders for this shop's products
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        products(
          name,
          price,
          images,
          shop_id
        )
      ),
      profiles(
        full_name,
        email
      )
    `)
    .eq("order_items.products.shop_id", shop.id)
    .order("created_at", { ascending: false })

  return <SellerOrdersContent shop={shop} orders={orders || []} />
}
