"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Package, MapPin, Settings, LogOut } from "lucide-react"
import { signOut } from "@/lib/actions"

interface ProfileSidebarProps {
  user: any
  profile: any
}

export default function ProfileSidebar({ user, profile }: ProfileSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      href: "/profile",
      label: "Profile Overview",
      icon: User,
    },
    {
      href: "/profile/orders",
      label: "My Orders",
      icon: Package,
    },
    {
      href: "/profile/addresses",
      label: "Addresses",
      icon: MapPin,
    },
    {
      href: "/profile/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        {/* User Info */}
        <div className="text-center mb-6">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-foreground">{profile?.full_name || "User"}</h3>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Sign Out */}
        <div className="mt-6 pt-6 border-t border-border">
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
