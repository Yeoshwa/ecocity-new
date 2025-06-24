"use client"

import { useEffect, useRef } from "react"

interface Report {
  id: number
  lat: number
  lng: number
  type: "urgent" | "moderate" | "resolved"
  category: string
  description: string
  photo: string
  date: string
  author: string
  address: string
  votes: number
  status: string
}

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  participants: number
  lat: number
  lng: number
}

interface InteractiveMapProps {
  reports: Report[]
  events: Event[]
  onPinClick: (report: Report | Event) => void
  onMapClick: (lat: number, lng: number) => void
}

export function InteractiveMap({ reports, events, onPinClick, onMapClick }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulation d'une carte interactive
    if (mapRef.current) {
      mapRef.current.innerHTML = ""

      // Créer le conteneur de la carte
      const mapContainer = document.createElement("div")
      mapContainer.className = "relative w-full h-full bg-green-50 dark:bg-green-950"
      mapContainer.style.backgroundImage = `
        radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
        linear-gradient(45deg, rgba(34, 197, 94, 0.05) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(34, 197, 94, 0.05) 25%, transparent 25%)
      `
      mapContainer.style.backgroundSize = "100px 100px, 100px 100px, 20px 20px, 20px 20px"

      // Ajouter les pins des signalements
      reports.forEach((report, index) => {
        const pin = document.createElement("div")
        pin.className = `absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10 transition-transform hover:scale-110`
        pin.style.left = `${30 + index * 15}%`
        pin.style.top = `${40 + index * 10}%`

        const pinColor =
          report.type === "urgent" ? "bg-red-500" : report.type === "moderate" ? "bg-yellow-500" : "bg-green-500"

        pin.innerHTML = `
          <div class="w-6 h-6 ${pinColor} rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div class="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs shadow-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
            ${report.category}
          </div>
        `

        pin.addEventListener("click", () => onPinClick(report))
        mapContainer.appendChild(pin)
      })

      // Ajouter les pins des événements
      events.forEach((event, index) => {
        const pin = document.createElement("div")
        pin.className = `absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10 transition-transform hover:scale-110`
        pin.style.left = `${60 + index * 10}%`
        pin.style.top = `${30 + index * 15}%`

        pin.innerHTML = `
          <div class="w-8 h-8 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <span class="text-white text-xs">📅</span>
          </div>
          <div class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs shadow-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
            ${event.title}
          </div>
        `

        pin.addEventListener("click", () => onPinClick(event))
        mapContainer.appendChild(pin)
      })

      // Gestionnaire de clic sur la carte
      mapContainer.addEventListener("click", (e) => {
        if (e.target === mapContainer) {
          const rect = mapContainer.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const lat = 48.8566 + (y / rect.height - 0.5) * 0.01
          const lng = 2.3522 + (x / rect.width - 0.5) * 0.01
          onMapClick(lat, lng)
        }
      })

      mapRef.current.appendChild(mapContainer)
    }
  }, [reports, events, onPinClick, onMapClick])

  return (
    <div ref={mapRef} className="w-full h-full">
      {/* Fallback content */}
      <div className="w-full h-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
        <p className="text-muted-foreground">Chargement de la carte...</p>
      </div>
    </div>
  )
}
