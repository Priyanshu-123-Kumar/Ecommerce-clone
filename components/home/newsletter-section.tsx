"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    setIsSubscribed(true)
    setEmail("")
  }

  return (
    <section className="py-16 px-4 bg-primary/5">
      <div className="container mx-auto">
        <Card className="max-w-2xl mx-auto border-0 bg-background shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Stay in Style</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and fashion
              tips.
            </p>

            {isSubscribed ? (
              <div className="text-center">
                <p className="text-primary font-semibold">Thank you for subscribing!</p>
                <p className="text-muted-foreground text-sm mt-2">You'll receive our latest updates soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12"
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 h-12 px-8">
                  Subscribe
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
