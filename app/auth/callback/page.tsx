import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; redirect?: string }
}) {
  const code = searchParams.code
  const redirectUrl = searchParams.redirect

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if there's a custom redirect URL from signup
      if (redirectUrl) {
        redirect(decodeURIComponent(redirectUrl))
      }

      // Get user profile to check role
      const { data: profile } = await supabase.from("profiles").select("user_role").eq("id", user.id).single()

      // Redirect based on user role
      if (profile?.user_role === "seller") {
        redirect("/seller/dashboard")
      } else {
        redirect("/")
      }
    }
  }

  // Default redirect to home page
  redirect("/")
}
