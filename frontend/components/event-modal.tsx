"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, MapPin, Users } from "lucide-react"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event: any
}

export function EventModal({ isOpen, onClose, event }: EventModalProps) {
  if (!event) return null

  const handleParticipate = () => {
    // Logique de participation
    alert("Merci pour votre participation ! 🌱")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Action citoyenne
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge variant="secondary" className="w-fit">
              Action communautaire
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.date} à {event.time}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{event.participants} participants inscrits</span>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                Rejoignez-nous pour une action de nettoyage collective ! Apportez vos gants et votre bonne humeur.
                Matériel de nettoyage fourni sur place.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
              <h4 className="font-medium mb-2 text-green-700 dark:text-green-300">Récompenses</h4>
              <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                <li>• +50 points de participation</li>
                <li>• Badge "Éco-volontaire"</li>
                <li>• Collation offerte</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Fermer
              </Button>
              <Button onClick={handleParticipate} className="flex-1 bg-purple-600 hover:bg-purple-700">
                Je participe !
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
