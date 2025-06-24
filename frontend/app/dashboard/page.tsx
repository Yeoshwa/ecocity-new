"use client";

import { useEffect, useState } from "react";
import { Dashboard } from "@/components/dashboard";
import { Sidebar } from "@/components/sidebar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";

function useScreenType() {
  const [screen, setScreen] = useState<'mobile' | 'tablet' | 'desktop'>(
    typeof window !== 'undefined' && window.innerWidth < 768
      ? 'mobile'
      : typeof window !== 'undefined' && window.innerWidth < 1024
        ? 'tablet'
        : 'desktop'
  );
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setScreen('mobile');
      else if (window.innerWidth < 1024) setScreen('tablet');
      else setScreen('desktop');
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return screen;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<"dashboard" | "map">("dashboard");
  const router = useRouter();
  const isMobile = useIsMobile();
  const screenType = useScreenType();
  const componentName = DashboardPage.name;

  useEffect(() => {
    // Simuler récupération user depuis localStorage ou API
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setUser(null);
      setLoading(false);
      return;
    }
    // Pour la démo, on suppose un user Citoyen
    setUser({
      id: 1,
      name: "Utilisateur Démo",
      phone: "+243991746157",
      role: "Citoyen",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 340,
      level: 3,
    });
    // Récupérer les signalements
    fetch("http://localhost:8000/api/reports/")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch(() => toast.info("Signalements : Fonctionnalité en cours de développement"));
    // Récupérer les événements
    fetch("http://localhost:8000/api/events/")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => toast.info("Événements : Fonctionnalité en cours de développement"));
    setLoading(false);
  }, []);

  useEffect(() => {
    // Sidebar visible par défaut sur desktop, masqué sinon
    if (screenType === 'desktop') setSidebarOpen(true);
    else setSidebarOpen(false);
  }, [screenType]);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!user) return <div className="p-8 text-center">Connectez-vous pour accéder au tableau de bord</div>;

  return (
    <div className="flex min-h-screen" data-component={componentName}>
      {/* Bouton burger mobile/tablette */}
      {(screenType === 'mobile' || screenType === 'tablet') && (
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6 text-green-700" />
        </button>
      )}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onShowProfile={() => toast.info("Profil : Fonctionnalité en cours de développement")}
        onShowLogin={() => toast.info("Connexion : Fonctionnalité en cours de développement")}
        onLogout={() => {
          localStorage.removeItem("jwt");
          localStorage.removeItem("refresh");
          setUser(null);
          toast.success("Déconnexion réussie");
          router.push("/");
        }}
        translations={{
          map: "Carte",
          dashboard: "Tableau de bord",
          profile: "Profil",
          logout: "Déconnexion",
        }}
      />
      <main className="flex-1 p-2 md:p-6">
        <Dashboard user={user} reports={reports} events={events} />
      </main>
    </div>
  );
}
