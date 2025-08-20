import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import ProductsManagement from "@/components/admin/products-management"

export default async function AdminProductsPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch products with related data
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      brands (name, slug),
      categories (name, slug)
    `)
    .order("created_at", { ascending: false })

  // Fetch categories and brands for filters
  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("brands").select("*").order("name"),
  ])

  return (
    <AdminLayout>
      <ProductsManagement products={products || []} categories={categories || []} brands={brands || []} />
    </AdminLayout>
  )
}
