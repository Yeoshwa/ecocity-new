"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
//import { InteractiveMap } from "../components/interactive-map";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Camera, Bell, Globe, ArrowRight, User as UserIcon } from "lucide-react";
import { ReportModal } from "@/components/report-modal";
import { LoginModal } from "@/components/login-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const InteractiveMap = dynamic(() => import("../components/interactive-map").then(mod => mod.InteractiveMap), {
  ssr: false,
});

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: -4.441931, lng: 15.266293 }); // Default to Kinshasa
  const [zoom, setZoom] = useState(13);
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const alertTimeout = useRef<NodeJS.Timeout | null>(null);
  const alertCycleTimeout = useRef<NodeJS.Timeout | null>(null);
  const componentName = HomePage.name;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setZoom(15);
        },
        (error) => {
          setUserLocation({ lat: -4.441931, lng: 15.266293 });
          setZoom(13);
        }
      );
    } else {
      setUserLocation({ lat: -4.441931, lng: 15.266293 });
      setZoom(13);
    }
    // Appel API reports
    fetch("http://localhost:8000/api/reports/")
      .then(res => res.json())
      .then(data => setReports(
        data.map(r => ({
          ...r,
          lat: Number(r.latitude),
          lng: Number(r.longitude),
          category: r.category || "Report",
          date: r.date || "",
          description: r.description || "",
        }))
      ))
      .catch(err => console.error("Erreur chargement reports", err));

    // Appel API events (adapte si besoin)
    fetch("http://localhost:8000/api/events/")
      .then(res => res.json())
      .then(data => setEvents(
        data.map(e => ({
          ...e,
          lat: Number(e.latitude),
          lng: Number(e.longitude),
          title: e.title || "Event",
          date: e.date || "",
          location: e.location || "",
        }))
      ))
      .catch(err => console.error("Erreur chargement events", err));
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    if (showAlert) {
      alertTimeout.current = setTimeout(() => setShowAlert(false), 5000);
    } else {
      alertCycleTimeout.current = setTimeout(() => setShowAlert(true), 30000);
    }
    return () => {
      if (alertTimeout.current) clearTimeout(alertTimeout.current);
      if (alertCycleTimeout.current) clearTimeout(alertCycleTimeout.current);
    };
  }, [showAlert, isMobile]);

  if (!isClient) {
    return <div />;
  }

  const handlePinClick = (item) => {
    window.location.href = item.category ? `/report/${item.id}` : `/event/${item.id}`;
  };

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === "Admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  // Fonction pour gérer le clic sur la carte
  const handleMapClick = () => {
    // Désactivé sur tous les écrans : ne rien faire
  };

  // Fonction de validation recherche
  const handleSearch = () => {
    // Suppression de l'import react-toastify qui cause l'erreur de build (non utilisé, on utilise sonner).
  };

  // Fonction de soumission du report
  const handleReportSubmit = async (reportData) => {
    // Vérifie la présence de la géolocalisation
    const latitude = reportData.latitude ?? userLocation.lat;
    const longitude = reportData.longitude ?? userLocation.lng;
    if (typeof latitude !== "number" || typeof longitude !== "number" || isNaN(latitude) || isNaN(longitude)) {
      toast.error("Impossible d'envoyer le signalement sans géolocalisation.");
      return;
    }
    try {
      // Préparation des données strictement attendues par l'API
      const dataToSend = {
        category: reportData.category,
        description: reportData.description,
        latitude,
        longitude,
      };
      // Si photo existe et est un File, on envoie en multipart, sinon en JSON sans le champ photo
      let res;
      if (reportData.photo && reportData.photo instanceof File) {
        const formData = new FormData();
        Object.entries(dataToSend).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append('photo', reportData.photo);
        res = await fetch("http://localhost:8000/api/reports/", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("http://localhost:8000/api/reports/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
      }
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Réponse API:", errorText);
        throw new Error("Erreur lors de l'envoi du report");
      }
      toast.success("Signalement envoyé avec succès !");
      setShowReportModal(false);
    } catch (err) {
      toast.error("Erreur lors de l'envoi du signalement");
    }
  };

  // Responsive: padding et taille des boutons adaptés
  return (
    <div className={`relative h-screen w-screen overflow-hidden ${isMobile ? 'p-2' : 'p-0'}`} data-component={componentName}>
      {/* Carte interactive en fond */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <InteractiveMap
          reports={reports}
          events={events}
          onPinClick={handlePinClick}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Boutons flottants - alignés verticalement à droite */}
      <div className={`absolute bottom-6 right-6 z-20 flex flex-col gap-4 ${isMobile ? 'right-2 bottom-2' : ''}`}>
        <Button
          onClick={() => setShowReportModal(true)}
          className={`rounded-full ${isMobile ? 'h-12 w-12' : 'h-16 w-16'} bg-green-600 hover:bg-green-700 shadow-2xl transition-all hover:scale-105`}
          size="icon"
        >
          <Plus className={isMobile ? 'h-5 w-5 text-white' : 'h-7 w-7 text-white'} />
        </Button>
      </div>

      {/* Bouton galerie - aligné à gauche */}
      {isMobile && (
        <div className="absolute bottom-6 left-6 z-20 left-2 bottom-2">
          <Button
            onClick={() => toast.info("Fonctionnalité à venir")}
            className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 shadow-2xl transition-all hover:scale-105"
            size="icon"
          >
            <Camera className="h-5 w-5 text-white" />
          </Button>
        </div>
      )}

      {/* Top bar */}
      <div className={`absolute top-4 right-4 flex items-center gap-2 z-50 ${isMobile ? 'right-2 top-2 w-full left-0 justify-center pt-[env(safe-area-inset-top,16px)]' : ''}`} style={isMobile ? {paddingTop: 'env(safe-area-inset-top,16px)'} : {}}>
        {/* Barre de recherche responsive */}
        <div className={`relative ${isMobile ? 'flex-1' : ''}`} style={isMobile ? {maxWidth: '100vw', minWidth: 0} : {}}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            placeholder="Rechercher..."
            className={`px-4 py-2 rounded-full border bg-white/90 backdrop-blur-sm shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 ${isMobile ? `w-full pr-12 ${searchFocus ? 'ring-2' : ''}` : 'w-64 pr-12'}`}
            style={isMobile ? {maxWidth: '100vw', minWidth: 0} : {}}
          />
          {/* Bouton validation recherche visible sur tous les écrans */}
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {/* Boutons Globe et Bell masqués sur mobile */}
        {!isMobile && (
          <>
            <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white">
              <Globe className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </>
        )}
        <Button
          onClick={() => setShowLoginModal(true)}
          size={isMobile ? "icon" : "sm"}
          className={`bg-green-600 hover:bg-green-700 text-white shadow-lg ${isMobile ? 'px-2 py-1 rounded-full' : 'px-4 py-2'}`}
        >
          {isMobile ? <UserIcon className="h-5 w-5" /> : "Connexion"}
        </Button>
      </div>

      {/* Alerte mobile animée */}
      {isMobile && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 bottom-24 z-50 w-[95vw] max-w-md px-4 py-3 rounded-xl bg-green-600 text-white text-center font-bold shadow-2xl animate-fade-in transition-all duration-500 ${showAlert ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
          style={{ boxShadow: '0 8px 32px 0 rgba(34,197,94,0.25)' }}
        >
          <span className="inline-flex items-center gap-2">
            <Plus className="h-5 w-5 animate-bounce" />
            Signalez un dépôt sauvage autour de vous
          </span>
        </div>
      )}

      {/* Modals */}
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} onSubmit={handleReportSubmit} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  );
}