"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Trophy, Star } from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onUpdateUser: (user: any) => void
}

export function ProfileModal({ isOpen, onClose, user, onUpdateUser }: ProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "Citoyen",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateUser({ ...user, ...formData })
    onClose()
  }

  const userStats = {
    reports: 12,
    resolved: 8,
    points: 340,
    level: 3,
    badges: [
      { name: "Premier signalement", icon: "🎯", earned: true },
      { name: "Éco-warrior", icon: "🌱", earned: true },
      { name: "Photographe", icon: "📸", earned: true },
      { name: "Nettoyeur", icon: "🧹", earned: false },
      { name: "Ambassadeur", icon: "👑", earned: false },
    ],
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Mon Profil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="text-lg">{formData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Changer la photo
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Citoyen">👤 Citoyen</SelectItem>
                        <SelectItem value="Organisation">🏛️ Organisation</SelectItem>
                        <SelectItem value="ONG">🌿 ONG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Sauvegarder les modifications
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Mes statistiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.reports}</div>
                  <div className="text-sm text-muted-foreground">Signalements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.resolved}</div>
                  <div className="text-sm text-muted-foreground">Résolus</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{userStats.points}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.level}</div>
                  <div className="text-sm text-muted-foreground">Niveau</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Mes badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {userStats.badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-center ${
                      badge.earned
                        ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
                        : "bg-muted border-muted-foreground/20 opacity-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-sm font-medium">{badge.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
