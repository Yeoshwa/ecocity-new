"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, BarChart3, Calendar, Star, Trophy, Download, Bell, Settings, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Utilisateur admin fictif (à remplacer par user réel si besoin)
  const user = {
    id: 999,
    name: "Administrateur",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
    points: 1000,
    level: 10,
  };

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8000/api/reports/").then(res => res.json()),
      fetch("http://localhost:8000/api/userprofiles/").then(res => res.json()),
      fetch("http://localhost:8000/api/events/").then(res => res.json()),
      fetch("http://localhost:8000/api/apilogs/?ordering=-timestamp&limit=5").then(res => res.json()).catch(() => []),
    ]).then(([reports, users, events, logs]) => {
      setStats({
        totalReports: reports.length,
        totalUsers: users.length,
        totalEvents: events.length,
        totalBadges: 7,
        progression: 82,
      });
      setRecent(logs.results || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-green-600" /></div>;
  }

  const componentName = AdminPage.name;

  const zones = [
    { zone: "Centre-ville", count: 15, urgent: 3 },
    { zone: "Quartier Nord", count: 8, urgent: 1 },
    { zone: "Zone industrielle", count: 12, urgent: 5 },
    { zone: "Périphérie", count: 6, urgent: 0 },
  ];

  return (
    <div className="flex min-h-screen" data-component={componentName}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={"dashboard"}
        onViewChange={() => {}}
        user={user}
        onShowProfile={() => {}}
        onShowLogin={() => {}}
        onLogout={() => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("jwt");
            localStorage.removeItem("refresh");
            window.location.href = "/";
          }
        }}
        translations={{
          map: "Carte",
          dashboard: "Dashboard",
          profile: "Profil",
          logout: "Déconnexion",
        }}
      />
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-green-700 mb-2">Dashboard Admin</h1>
        <p className="text-muted-foreground mb-6">Bienvenue, <span className="font-semibold text-green-700">{user.name}</span></p>
        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Signalements</CardTitle>
              <BarChart3 className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalReports ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalUsers ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Événements</CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalEvents ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Badges</CardTitle>
              <Trophy className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalBadges ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Progression</CardTitle>
              <Star className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{stats?.progression ?? 0}%</div>
              <div className="h-2 bg-green-100 rounded-full mt-2">
                <div className="h-2 bg-green-600 rounded-full" style={{ width: `${stats?.progression ?? 0}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Actions rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button variant="outline" className="h-20 flex-col"><Calendar className="h-6 w-6 mb-2" />Planifier événement</Button>
          <Button variant="outline" className="h-20 flex-col"><Download className="h-6 w-6 mb-2" />Export CSV</Button>
          <Button variant="outline" className="h-20 flex-col"><Users className="h-6 w-6 mb-2" />Gérer équipe</Button>
          <Button variant="outline" className="h-20 flex-col"><BarChart3 className="h-6 w-6 mb-2" />Rapport mensuel</Button>
        </div>
        {/* Signalements par zone */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Signalements par zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Zone</th>
                    <th className="p-2 text-left">Total</th>
                    <th className="p-2 text-left">Urgents</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((z, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{z.zone}</td>
                      <td className="p-2">{z.count}</td>
                      <td className="p-2 text-red-600 font-bold">{z.urgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        {/* Outils d'administration */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Button variant="outline" className="h-20 flex-col"><Users className="h-6 w-6 mb-2" />Gestion utilisateurs</Button>
          <Button variant="outline" className="h-20 flex-col"><Bell className="h-6 w-6 mb-2" />Notifications</Button>
          <Button variant="outline" className="h-20 flex-col"><Settings className="h-6 w-6 mb-2" />Paramètres</Button>
          <Button variant="outline" className="h-20 flex-col"><Activity className="h-6 w-6 mb-2" />Logs API</Button>
        </div>
        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recent.length === 0 && <li className="text-muted-foreground">Aucune activité récente</li>}
              {recent.map((log, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span>{log.action}</span>
                  <span className="text-muted-foreground ml-auto">{log.timestamp?.slice(0, 19).replace("T", " ")}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
