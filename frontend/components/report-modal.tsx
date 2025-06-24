"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Upload, Camera } from "lucide-react"
import { toast } from "sonner"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (report: any) => void
}

export function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    photo: null as File | null,
    location: "Position actuelle",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    const report = {
      ...formData,
      lat: 48.8566 + Math.random() * 0.01,
      lng: 2.3522 + Math.random() * 0.01,
      photo: "/placeholder.svg?height=200&width=300",
      address: `${Math.floor(Math.random() * 100)} Rue de la République, Paris`,
    }

    onSubmit(report)
    toast.success("Merci pour votre signalement 💚")

    // Reset form
    setFormData({
      category: "",
      description: "",
      photo: null,
      location: "Position actuelle",
    })

    onClose()
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, photo: file })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Signaler un dépôt sauvage
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Localisation */}
          <div className="space-y-2">
            <Label>Localisation</Label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-sm">{formData.location}</span>
            </div>
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Poubelle pleine">🗑️ Poubelle pleine</SelectItem>
                <SelectItem value="Décharge sauvage">🏗️ Décharge sauvage</SelectItem>
                <SelectItem value="Dangereux">⚠️ Déchets dangereux</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez brièvement le problème..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                <Camera className="mr-2 h-4 w-4" />
                Prendre une photo
              </Button>
            </div>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            {formData.photo && <p className="text-sm text-green-600">✓ Photo sélectionnée: {formData.photo.name}</p>}
          </div>

          {/* Boutons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
              Envoyer le signalement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
