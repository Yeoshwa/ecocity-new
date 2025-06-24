"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, UserPlus } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: any) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Citoyen",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Connexion admin par défaut
    if (loginData.email === "admin@ecowatch.com") {
      const adminUser = {
        id: 999,
        name: "Administrateur",
        email: loginData.email,
        role: "Admin",
        avatar: "/placeholder.svg?height=40&width=40",
        points: 1000,
        level: 10,
      }
      onLogin(adminUser)
      onClose()
      return
    }

    // Simulation de connexion normale
    const user = {
      id: 1,
      name: "Marie Dupont",
      email: loginData.email,
      role: "Citoyen",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 340,
      level: 3,
    }
    onLogin(user)
    onClose()
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    // Simulation d'inscription
    const user = {
      id: 1,
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      role: registerData.role,
      avatar: "/placeholder.svg?height=40&width=40",
      points: 0,
      level: 1,
    }
    onLogin(user)
    onClose()
  }

  const handleSocialLogin = (provider: string) => {
    // Simulation de connexion sociale
    const user = {
      id: 1,
      name: "Utilisateur " + provider,
      email: `user@${provider}.com`,
      role: "Citoyen",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 0,
      level: 1,
    }
    onLogin(user)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Rejoignez EcoWatch</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Mot de passe</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nom complet</Label>
                <Input
                  id="register-name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Téléphone</Label>
                  <Input
                    id="register-phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-role">Rôle</Label>
                <Select
                  value={registerData.role}
                  onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Citoyen">👤 Citoyen</SelectItem>
                    <SelectItem value="Organisation">🏛️ Organisation</SelectItem>
                    <SelectItem value="ONG">🌿 ONG</SelectItem>
                    <SelectItem value="Admin">🔧 Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="register-password">Mot de passe</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirmer</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                S'inscrire
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
