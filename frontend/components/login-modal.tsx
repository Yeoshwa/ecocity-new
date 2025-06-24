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
import { toast } from "sonner"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: any) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  })
  const [registerData, setRegisterData] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/token/phone/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: loginData.phone,
          password: loginData.password,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.detail || "Erreur de connexion")
        setLoading(false)
        return
      }
      const data = await res.json()
      if (data.access) localStorage.setItem("jwt", data.access)
      if (data.refresh) localStorage.setItem("refresh", data.refresh)
      // Détection admin fiable via le champ 'statut' ou 'role' si présent dans la réponse
      const isAdmin = (data.statut && data.statut.toLowerCase() === "admin") || (data.role && data.role.toLowerCase() === "admin") || data.username?.toLowerCase() === "admin" || data.phone === "+243999999999";
      onLogin({
        id: data.user_id || 1,
        name: data.username || loginData.phone,
        phone: loginData.phone,
        role: isAdmin ? "Admin" : "Citoyen",
        avatar: "/placeholder.svg?height=40&width=40",
        points: 0,
        level: 1,
      })
      toast.success("Connexion réussie !")
      onClose()
      // Redirection automatique fiable
      if (typeof window !== "undefined") {
        if (isAdmin) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (err) {
      toast.error("Erreur réseau")
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    setLoading(true)
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    try {
      const res = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerData.username,
          phone: registerData.phone,
          password: registerData.password,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.detail || "Erreur d'inscription")
        setLoading(false)
        return
      }
      const data = await res.json()
      if (data.token && data.token.access) localStorage.setItem("jwt", data.token.access)
      if (data.token && data.token.refresh) localStorage.setItem("refresh", data.token.refresh)
      // Détection admin simple (à adapter selon ta logique réelle)
      const isAdmin = registerData.username.toLowerCase() === "admin" || registerData.phone === "+243999999999"
      onLogin({
        id: data.user?.id || 1,
        name: registerData.username,
        phone: registerData.phone,
        role: isAdmin ? "Admin" : "Citoyen",
        avatar: "/placeholder.svg?height=40&width=40",
        points: 0,
        level: 1,
      })
      toast.success("Inscription réussie !")
      onClose()
    } catch (err) {
      toast.error("Erreur réseau")
    }
    setLoading(false)
  }

  const handleDevFeature = (e: React.MouseEvent) => {
    e.preventDefault()
    toast.info("Fonctionnalité en cours de développement")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md min-h-[420px] flex flex-col justify-center">
        <div className="w-auto max-w-[420px] mx-auto px-6 bg-white/90 dark:bg-background rounded-2xl shadow-xl py-6 md:py-8 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-center">Rejoignez EcoCity</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6 flex flex-col justify-center">
                <div className="space-y-2">
                  <Label htmlFor="login-phone">Téléphone</Label>
                  <Input
                    id="login-phone"
                    type="tel"
                    value={loginData.phone}
                    onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                    required
                    placeholder="Ex: +243991746157"
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
                    placeholder="Votre mot de passe"
                  />
                </div>
                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  <LogIn className="mr-2 h-4 w-4" />
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-6 flex flex-col justify-center relative">
                {/* Confettis animés */}
                {showConfetti && (
                  <div className="pointer-events-none absolute left-1/2 top-0 z-50 w-full flex justify-center" style={{transform:'translateX(-50%)'}}>
                    {[...Array(18)].map((_,i) => (
                      <span key={i} className={`confetti confetti-${i}`} />
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="register-username">Nom d'utilisateur</Label>
                  <Input
                    id="register-username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                    placeholder="Votre nom d'utilisateur"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Téléphone</Label>
                  <Input
                    id="register-phone"
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    required
                    placeholder="Ex: +243991746157"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Mot de passe</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    placeholder="Votre mot de passe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirmer le mot de passe</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                    placeholder="Confirmez le mot de passe"
                  />
                </div>
                <Button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white shadow-lg px-4 py-2 rounded-full" disabled={loading}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {loading ? "Inscription..." : "S'inscrire"}
                </Button>
              </form>
            </TabsContent>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleDevFeature}>
                Connexion Google
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={handleDevFeature}>
                Connexion Facebook
              </Button>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
