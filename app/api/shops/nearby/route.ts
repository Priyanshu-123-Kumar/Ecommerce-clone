import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)

  const latitude = searchParams.get("latitude")
  const longitude = searchParams.get("longitude")
  const radius = searchParams.get("radius") || "10" // Default 10km radius
  const limit = searchParams.get("limit") || "20" // Default 20 shops

  if (!latitude || !longitude) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // Query shops within radius using PostGIS earth_distance function
    const { data: shops, error } = await supabase
      .rpc("get_nearby_shops", {
        user_lat: Number.parseFloat(latitude),
        user_lng: Number.parseFloat(longitude),
        radius_km: Number.parseFloat(radius),
      })
      .limit(Number.parseInt(limit))

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ shops: shops || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
