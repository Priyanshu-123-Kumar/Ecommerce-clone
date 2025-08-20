import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get seller's shop
  const { data: shop } = await supabase.from("shops").select("id").eq("seller_id", user.id).single()

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 })
  }

  // Get products for this shop
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      brands(name)
    `)
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get seller's shop
  const { data: shop } = await supabase.from("shops").select("id").eq("seller_id", user.id).single()

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const productData = {
      ...body,
      shop_id: shop.id,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
    }

    const { data: product, error } = await supabase.from("products").insert([productData]).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
