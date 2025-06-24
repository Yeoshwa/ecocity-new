"use client"

import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

interface AdminAccessProps {
  onAdminLogin: (user: any) => void
}

export function AdminAccess({ onAdminLogin }: AdminAccessProps) {
  const handleAdminAccess = () => {
    const adminUser = {
      id: 999,
      name: "Administrateur EcoWatch",
      email: "admin@ecowatch.com",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 1000,
      level: 10,
    }
    onAdminLogin(adminUser)
  }

  return (
    <Button
      onClick={handleAdminAccess}
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-20 z-50 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:border-red-800 dark:text-red-300"
    >
      <Shield className="h-4 w-4 mr-2" />
      Accès Admin (Test)
    </Button>
  )
}
