"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Map, BarChart3, User, Trophy, Calendar, Camera, Settings, LogOut, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentView: "map" | "dashboard"
  onViewChange: (view: "map" | "dashboard") => void
  user: any
  onShowProfile: () => void
  onShowLogin: () => void
  onLogout: () => void
  translations: any
}

export function Sidebar({
  isOpen,
  onClose,
  currentView,
  onViewChange,
  user,
  onShowProfile,
  onShowLogin,
  onLogout,
  translations: t,
}: SidebarProps) {
  const menuItems = [
    { id: "map", label: t.map, icon: Map, view: "map" as const },
    { id: "dashboard", label: t.dashboard, icon: BarChart3, view: "dashboard" as const },
    { id: "gallery", label: "Galerie", icon: Camera },
    { id: "events", label: "Événements", icon: Calendar },
    { id: "leaderboard", label: "Classement", icon: Trophy },
  ]

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-600">EcoCity</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Profil utilisateur */}
          <div className="p-4 border-b">
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      🏆 {user.points || 0} pts
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Niveau {user.level || 1}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <Button onClick={onShowLogin} className="w-full">
                Se connecter
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Button
                    variant={currentView === item.view ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      if (item.view) {
                        onViewChange(item.view)
                      }
                      onClose()
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          {user && (
            <div className="p-4 border-t">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={onShowProfile}>
                  <User className="mr-2 h-4 w-4" />
                  {t.profile}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.logout}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
