import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import OrderSuccessContent from "@/components/checkout/order-success-content"

interface PageProps {
  searchParams: { order_id?: string }
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!searchParams.order_id) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <OrderSuccessContent orderId={searchParams.order_id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
