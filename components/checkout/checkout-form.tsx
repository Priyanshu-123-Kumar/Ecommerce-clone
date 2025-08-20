"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { CreditCard, Wallet, Building, Truck, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface CartItem {
  id: string
  product_id: string
  quantity: number
  size: string
  color: string
  products: {
    name: string
    price: number
    image_url: string
    brand: string
  }
}

interface Address {
  id: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  is_default: boolean
}

export default function CheckoutForm() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchCheckoutData()
  }, [])

  const fetchCheckoutData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Fetch cart items
      const { data: cart } = await supabase
        .from("cart_items")
        .select(`
          *,
          products (name, price, image_url, brand)
        `)
        .eq("user_id", user.id)

      // Fetch addresses
      const { data: userAddresses } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })

      setCartItems(cart || [])
      setAddresses(userAddresses || [])

      // Set default address
      const defaultAddress = userAddresses?.find((addr) => addr.is_default)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id)
      }
    } catch (error) {
      console.error("Error fetching checkout data:", error)
      toast.error("Failed to load checkout data")
    } finally {
      setLoading(false)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.products.price * item.quantity, 0)
  }

  const calculateShipping = () => {
    const subtotal = calculateSubtotal()
    return subtotal > 1999 ? 0 : 99 // Free shipping above ₹1999
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address")
      return
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setProcessing(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: calculateTotal(),
          status: "confirmed",
          payment_method: paymentMethod,
          shipping_address_id: selectedAddress,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price,
        size: item.size,
        color: item.color,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      const { error: clearCartError } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (clearCartError) throw clearCartError

      toast.success("Order placed successfully!")
      router.push(`/order-success?order_id=${order.id}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Checkout Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {addresses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">No addresses found</p>
                <Link href="/profile/addresses">
                  <Button variant="outline">Add Address</Button>
                </Link>
              </div>
            ) : (
              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor={address.id} className="font-medium">
                          {address.full_name}
                        </Label>
                        {address.is_default && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {address.address_line_1}
                        {address.address_line_2 && `, ${address.address_line_2}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-gray-600" />
                <div>
                  <Label htmlFor="card" className="font-medium">
                    Credit/Debit Card
                  </Label>
                  <p className="text-sm text-gray-600">Pay securely with your card</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="upi" id="upi" />
                <Wallet className="h-5 w-5 text-gray-600" />
                <div>
                  <Label htmlFor="upi" className="font-medium">
                    UPI
                  </Label>
                  <p className="text-sm text-gray-600">Pay using UPI apps</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="cod" id="cod" />
                <Building className="h-5 w-5 text-gray-600" />
                <div>
                  <Label htmlFor="cod" className="font-medium">
                    Cash on Delivery
                  </Label>
                  <p className="text-sm text-gray-600">Pay when you receive</p>
                </div>
              </div>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="John Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img
                  src={item.products.image_url || "/placeholder.svg"}
                  alt={item.products.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.products.name}</h4>
                  <p className="text-xs text-gray-600">{item.products.brand}</p>
                  <p className="text-xs text-gray-600">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                    <span className="font-medium">₹{item.products.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className={calculateShipping() === 0 ? "text-green-600" : ""}>
                  {calculateShipping() === 0 ? "FREE" : `₹${calculateShipping()}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 p-3 rounded-lg">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Safe and secure payments. Easy returns. 100% Authentic products.</span>
            </div>

            <Button onClick={handlePlaceOrder} disabled={processing || !selectedAddress} className="w-full" size="lg">
              {processing ? "Processing..." : `Place Order - ₹${calculateTotal()}`}
            </Button>

            <Link href="/cart">
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
