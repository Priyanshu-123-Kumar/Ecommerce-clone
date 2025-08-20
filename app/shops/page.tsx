import { createClient } from "@/lib/supabase/server"
import ShopsDiscoveryContent from "@/components/shops/discovery-content"

export default async function ShopsPage() {
  const supabase = createClient()

  // Get all active shops for initial display
  const { data: shops } = await supabase
    .from("shops")
    .select(`
      *,
      profiles!shops_seller_id_fkey(full_name)
    `)
    .eq("is_active", true)
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(20)

  return <ShopsDiscoveryContent initialShops={shops || []} />
}
