"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Camera, Bell, Globe } from "lucide-react"
import { ReportModal } from "@/components/report-modal"
import { LoginModal } from "@/components/login-modal"
import { InteractiveMap } from "@/components/interactive-map"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const [showReportModal, setShowReportModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Carte interactive plein écran */}
      <InteractiveMap reports={[]} events={[]} onPinClick={() => {}} onMapClick={() => setShowReportModal(true)} />

      {/* Message d'accueil */}
      <Card className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 shadow-xl bg-white/95 backdrop-blur-sm border-0">
        <CardContent className="p-4 text-center">
          <p className="text-sm font-semibold text-gray-800">🌍 Signalez un dépôt sauvage autour de vous.</p>
        </CardContent>
      </Card>

      {/* Boutons flottants - alignés verticalement à droite */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-4">
        <Button
          onClick={() => setShowReportModal(true)}
          className="rounded-full h-16 w-16 bg-green-600 hover:bg-green-700 shadow-2xl transition-all hover:scale-105"
          size="icon"
        >
          <Plus className="h-7 w-7 text-white" />
        </Button>
      </div>

      {/* Bouton galerie - aligné à gauche */}
      <div className="absolute bottom-6 left-6 z-20">
        <Button
          onClick={() => {}}
          className="rounded-full h-16 w-16 bg-blue-600 hover:bg-blue-700 shadow-2xl transition-all hover:scale-105"
          size="icon"
        >
          <Camera className="h-7 w-7 text-white" />
        </Button>
      </div>

      {/* Top bar */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher..."
          className="px-4 py-2 rounded-full border bg-white/90 backdrop-blur-sm shadow-lg w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
        <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white">
          <Globe className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>
        <Button
          onClick={() => setShowLoginModal(true)}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white shadow-lg px-4 py-2"
        >
          Connexion
        </Button>
      </div>

      {/* Modals */}
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} onSubmit={() => {}} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={() => {}} />
    </div>
  )
}
