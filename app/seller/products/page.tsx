import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SellerProductsContent from "@/components/seller/products-content"

export default async function SellerProductsPage() {
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

  // Get products for this shop
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      brands(name)
    `)
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false })

  return <SellerProductsContent shop={shop} products={products || []} />
}
