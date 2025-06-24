"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Upload, Camera } from "lucide-react"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (report: any) => void
}

export function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    photo: null as File | null,
    location: "Position actuelle",
    latitude: -4.312, // Kinshasa par défaut
    longitude: 15.284,
  });

  // Met à jour la position utilisateur à l'ouverture du modal
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            location: "Position actuelle",
          }));
        },
        () => {
          setFormData((prev) => ({
            ...prev,
            latitude: -4.312,
            longitude: 15.284,
            location: "Kinshasa/Gombe (défaut)",
          }));
        }
      );
    }
  }, [isOpen]);

  console.log("formData envoyé:", formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/reports/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.category, // adapte si l'API attend 'type'
          description: formData.description,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error("Erreur: " + (errorData.detail || JSON.stringify(errorData) || response.status));
        return;
      }
      toast.success("Merci pour votre signalement 💚");
      setFormData({
        category: "",
        description: "",
        photo: null,
        location: "Position actuelle",
        latitude: -4.312,
        longitude: 15.284,
      });
      onClose();
    } catch (err) {
      toast.error("Erreur lors de l'envoi du signalement");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, photo: file })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="w-full max-w-[420px] mx-auto px-4 md:px-0">
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
                {isMobile && (
                  <Button type="button" variant="outline" className="flex-1" onClick={() => document.getElementById('camera-upload')?.click()}>
                    <Camera className="mr-2 h-4 w-4" />
                    Prendre une photo
                  </Button>
                )}
              </div>
              <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              {isMobile && (
                <input id="camera-upload" type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
              )}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}