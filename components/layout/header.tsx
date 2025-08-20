"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Heart, ShoppingBag, User, Menu, X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    console.log("[v0] Header: Checking initial user state")

    // Get initial user
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      console.log("[v0] Header: Initial user check", { user: user?.email, error })
      setUser(user)
      if (user) {
        fetchCounts(user.id)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[v0] Header: Auth state changed", { event, user: session?.user?.email })
      setUser(session?.user || null)
      if (session?.user) {
        fetchCounts(session.user.id)
      } else {
        setCartCount(0)
        setWishlistCount(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCounts = async (userId: string) => {
    console.log("[v0] Header: Fetching counts for user", userId)
    try {
      const [{ count: cartCount }, { count: wishlistCount }] = await Promise.all([
        supabase.from("cart_items").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("wishlist_items").select("*", { count: "exact", head: true }).eq("user_id", userId),
      ])
      console.log("[v0] Header: Counts fetched", { cartCount, wishlistCount })
      setCartCount(cartCount || 0)
      setWishlistCount(wishlistCount || 0)
    } catch (error) {
      console.log("[v0] Header: Error fetching counts", error)
      setCartCount(0)
      setWishlistCount(0)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-primary">Fashion Hub</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/men" className="text-sm font-medium hover:text-primary transition-colors">
                Men
              </Link>
              <Link href="/women" className="text-sm font-medium hover:text-primary transition-colors">
                Women
              </Link>
              <Link href="/kids" className="text-sm font-medium hover:text-primary transition-colors">
                Kids
              </Link>
              <Link
                href="/shops"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Shops
              </Link>
              <Link href="/home-living" className="text-sm font-medium hover:text-primary transition-colors">
                Home & Living
              </Link>
              <Link href="/beauty" className="text-sm font-medium hover:text-primary transition-colors">
                Beauty
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              {console.log("[v0] Header: Rendering user actions", { userEmail: user?.email, isLoggedIn: !!user })}
              {user ? (
                <>
                  <Button variant="ghost" size="sm" asChild className="relative">
                    <Link href="/wishlist">
                      <Heart className="h-5 w-5" />
                      {wishlistCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                          {wishlistCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="relative">
                    <Link href="/cart">
                      <ShoppingBag className="h-5 w-5" />
                      {cartCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                          {cartCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/profile">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                  <Link href="/auth/login">Login</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 bg-muted/50 border-0"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/men"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Men
              </Link>
              <Link
                href="/women"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Women
              </Link>
              <Link
                href="/kids"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kids
              </Link>
              <Link
                href="/shops"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Nearby Shops
              </Link>
              <Link
                href="/home-living"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home & Living
              </Link>
              <Link
                href="/beauty"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Beauty
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
