import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SellerDashboardContent from "@/components/seller/dashboard-content"

export default async function SellerDashboardPage() {
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

  // Get seller's shop if exists
  const { data: shop } = await supabase.from("shops").select("*").eq("seller_id", user.id).single()

  return <SellerDashboardContent user={user} shop={shop} />
}
