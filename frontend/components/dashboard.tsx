"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, MapPin, Trophy, Star, Calendar, Download } from "lucide-react"

interface DashboardProps {
  user: any
  reports: any[]
  events: any[]
}

export function Dashboard({ user, reports, events }: DashboardProps) {
  const stats = {
    totalReports: reports.length,
    resolvedReports: reports.filter((r) => r.status === "resolved").length,
    urgentReports: reports.filter((r) => r.type === "urgent").length,
    activeUsers: 1247,
  }

  const leaderboard = [
    { name: "Marie D.", points: 450, avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Jean M.", points: 380, avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Sophie L.", points: 340, avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Pierre K.", points: 290, avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Anna B.", points: 250, avatar: "/placeholder.svg?height=32&width=32" },
  ]

  const renderCitizenDashboard = () => (
    <div className="space-y-6">
      {/* Statistiques personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes signalements</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolus</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground">66% de taux de résolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">340</div>
            <p className="text-xs text-muted-foreground">Niveau 3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rang</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">#3</div>
            <p className="text-xs text-muted-foreground">Dans votre quartier</p>
          </CardContent>
        </Card>
      </div>

      {/* Progression vers le prochain niveau */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Niveau 3</span>
              <span>340 / 500 points</span>
            </div>
            <Progress value={68} className="h-2" />
            <p className="text-xs text-muted-foreground">Plus que 160 points pour atteindre le niveau 4 !</p>
          </div>
        </CardContent>
      </Card>

      {/* Mes derniers signalements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mes derniers signalements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.slice(0, 3).map((report) => (
              <div key={report.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div
                  className={`w-3 h-3 rounded-full ${
                    report.type === "urgent"
                      ? "bg-red-500"
                      : report.type === "moderate"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">{report.category}</p>
                  <p className="text-sm text-muted-foreground">{report.address}</p>
                </div>
                <Badge variant={report.status === "resolved" ? "default" : "secondary"}>
                  {report.status === "resolved" ? "Résolu" : "En cours"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Classement local */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Classement local
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? "bg-yellow-500 text-white"
                      : index === 1
                        ? "bg-gray-400 text-white"
                        : index === 2
                          ? "bg-amber-600 text-white"
                          : "bg-muted"
                  }`}
                >
                  {index + 1}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                </div>
                <Badge variant="secondary">{user.points} pts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOrganizationDashboard = () => (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total signalements</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">+12% ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolus</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvedReports}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.resolvedReports / stats.totalReports) * 100)}% de résolution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgents</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentReports}</div>
            <p className="text-xs text-muted-foreground">Nécessitent une attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+8% ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Planifier événement
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Export CSV
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Gérer équipe
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Rapport mensuel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Signalements par zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Signalements par zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { zone: "Centre-ville", count: 15, urgent: 3 },
              { zone: "Quartier Nord", count: 8, urgent: 1 },
              { zone: "Zone industrielle", count: 12, urgent: 5 },
              { zone: "Périphérie", count: 6, urgent: 0 },
            ].map((zone, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{zone.zone}</p>
                  <p className="text-sm text-muted-foreground">{zone.count} signalements</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{zone.count}</Badge>
                  {zone.urgent > 0 && <Badge variant="destructive">{zone.urgent} urgent(s)</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Statistiques globales admin */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signalements</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organisations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modération</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{events.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Outils d'administration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Outils d'administration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button variant="outline" className="h-16 flex-col">
              <Users className="h-5 w-5 mb-1" />
              Gestion utilisateurs
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Star className="h-5 w-5 mb-1" />
              Modération
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Download className="h-5 w-5 mb-1" />
              Export données
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <BarChart3 className="h-5 w-5 mb-1" />
              Analytics
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Calendar className="h-5 w-5 mb-1" />
              Événements
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <MapPin className="h-5 w-5 mb-1" />
              Zones
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Nouveau signalement", user: "Marie D.", time: "Il y a 5 min", type: "report" },
              { action: "Signalement résolu", user: "Jean M.", time: "Il y a 12 min", type: "resolved" },
              { action: "Nouvel utilisateur", user: "Sophie L.", time: "Il y a 1h", type: "user" },
              { action: "Événement créé", user: "Org. Verte", time: "Il y a 2h", type: "event" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "report"
                      ? "bg-blue-500"
                      : activity.type === "resolved"
                        ? "bg-green-500"
                        : activity.type === "user"
                          ? "bg-purple-500"
                          : "bg-orange-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">Par {activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Connectez-vous pour accéder au tableau de bord</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord {user.role === "Admin" ? "Administrateur" : user.role}</h1>
        <p className="text-muted-foreground">Bienvenue, {user.name}</p>
      </div>

      {user.role === "Citoyen" && renderCitizenDashboard()}
      {user.role === "Organisation" && renderOrganizationDashboard()}
      {user.role === "Admin" && renderAdminDashboard()}
    </div>
  )
}
