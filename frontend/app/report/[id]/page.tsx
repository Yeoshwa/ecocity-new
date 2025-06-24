"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const ReportMap = dynamic(() => import("@/components/ReportMap"), { ssr: false });

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<string>("");
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/api/reports/${id}/`)
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setLoading(false);
        // Reverse geocoding si lat/lng présents
        if (data.latitude && data.longitude) {
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}`)
            .then(res => res.json())
            .then(addr => setAddress(addr.display_name || ""));
        }
      });
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError("");
    setCommentSuccess(false);
    try {
      const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
      const res = await fetch(`http://localhost:8000/api/reports/${id}/comment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify({ text: comment }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setCommentError(err.detail || "Erreur lors de l'envoi du commentaire");
      } else {
        setCommentSuccess(true);
        setComment("");
      }
    } catch (err) {
      setCommentError("Erreur réseau");
    }
    setCommentLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-green-600" /></div>;
  }
  if (!report) {
    return <div className="p-8 text-center">Signalement introuvable</div>;
  }
  const hasCoords = typeof report.latitude === "number" && typeof report.longitude === "number";
  return (
    <div
      className="flex flex-col items-center min-h-screen py-4 px-2 md:px-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/background.jpg)' }}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-4">
          <Link href="/">
            <Button variant="outline">← Retour à la carte</Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Bloc infos et carte */}
          <Card className="flex-1 min-w-0">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Détail du signalement #{report.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><b>Catégorie :</b> {report.category || report.categorie}</div>
              <div><b>Description :</b> {report.description}</div>
              <div><b>Latitude :</b> {report.latitude}</div>
              <div><b>Longitude :</b> {report.longitude}</div>
              {address && <div><b>Adresse :</b> {address}</div>}
              <div><b>Date :</b> {report.created_at}</div>
              {hasCoords && (
                <div className="mt-4 rounded-xl overflow-hidden border shadow-lg min-h-[180px]">
                  <ReportMap lat={report.latitude} lng={report.longitude} />
                </div>
              )}
            </CardContent>
          </Card>
          {/* Bloc image à droite */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[220px] max-w-full">
            {report.photo ? (
              <Image src={report.photo} alt="Photo du signalement" width={350} height={220} className="rounded-lg border object-cover max-w-full" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-muted-foreground/10 rounded-lg border min-h-[220px]">
                <ImageOff className="h-16 w-16 text-muted-foreground mb-2" />
                <span className="text-muted-foreground">Aucune image disponible</span>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleCommentSubmit} className="mt-8 bg-white rounded-xl shadow p-4 space-y-3 max-w-5xl mx-auto w-full">
          <label htmlFor="comment" className="font-medium">Ajouter un commentaire</label>
          <textarea
            id="comment"
            className="w-full border rounded p-2 min-h-[80px]"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Votre commentaire..."
            required
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={commentLoading || !comment.trim()}>
              {commentLoading ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
          {commentSuccess && <div className="text-green-600 text-sm">Commentaire envoyé !</div>}
          {commentError && <div className="text-red-600 text-sm">{commentError}</div>}
        </form>
      </div>
    </div>
  );
}
