"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Camera, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  reports: any[]
}

export function GalleryModal({ isOpen, onClose, reports }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const beforeAfterData = reports.map((report) => ({
    id: report.id,
    location: report.address,
    category: report.category,
    before: report.photo,
    after: "/placeholder.svg?height=200&width=300", // Photo après nettoyage
    date: report.date,
    author: report.author,
  }))

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % beforeAfterData.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + beforeAfterData.length) % beforeAfterData.length)
  }

  if (beforeAfterData.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Galerie Avant / Après
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune transformation disponible pour le moment</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const currentItem = beforeAfterData[currentIndex]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            Galerie Avant / Après
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={prevImage} disabled={beforeAfterData.length <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <p className="font-medium">{currentItem.location}</p>
              <Badge variant="secondary">{currentItem.category}</Badge>
            </div>

            <Button variant="outline" size="icon" onClick={nextImage} disabled={beforeAfterData.length <= 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Images Avant/Après */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-600">Avant</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={currentItem.before || "/placeholder.svg"}
                  alt="Avant nettoyage"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-600">Après</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={currentItem.after || "/placeholder.svg"}
                  alt="Après nettoyage"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Nettoyé par {currentItem.author}</span>
            <span>{currentItem.date}</span>
          </div>

          {/* Indicateurs */}
          <div className="flex justify-center gap-2">
            {beforeAfterData.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-blue-600" : "bg-muted-foreground/30"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
