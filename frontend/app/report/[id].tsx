import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";

interface ReportDetailPageProps {
  params: { id: string }
}

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
  const componentName = 'ReportDetailPage';
  const { id } = params;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/reports/${id}/`)
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-green-600" /></div>;
  }
  if (!report) {
    return <div className="p-8 text-center">Signalement introuvable</div>;
  }
  return (
    <div className="flex flex-col items-center min-h-screen bg-muted py-4 px-2" data-component={componentName}>
      <div className="w-full max-w-lg mx-auto">
        <div className="mb-4">
          <Link href="/">
            <Button
              className="!bg-green-700 !hover:bg-green-800 !text-white !shadow-[0_0_32px_0_#16a34a99] !px-12 !py-6 !rounded-2xl !font-extrabold !text-3xl !w-full !uppercase !tracking-widest !flex !items-center !justify-center !gap-4 animate-report-attract"
              style={{
                backgroundColor: '#15803d',
                color: '#fff',
                boxShadow: '0 0 48px 0 #16a34a99',
                fontWeight: 900,
                fontSize: '2.2rem',
                borderRadius: '1.25rem',
                padding: '1.5rem 3rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                animation: 'report-attract 1.3s cubic-bezier(.4,0,.2,1) infinite',
              }}
            >
              <MapPin className="w-10 h-10 mr-2 -ml-2" />
              Signaler ici !
            </Button>
          </Link>
        </div>
        <Card className="max-w-lg w-full mx-auto mt-0">
          <CardHeader>
            <CardTitle>Détail du signalement #{report.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><b>Catégorie :</b> {report.category || report.categorie}</div>
            <div><b>Description :</b> {report.description}</div>
            <div><b>Latitude :</b> {report.latitude}</div>
            <div><b>Longitude :</b> {report.longitude}</div>
            <div><b>Date :</b> {report.created_at}</div>
            {report.photo && (
              <div>
                <b>Photo :</b>
                <div className="mt-2">
                  <Image src={report.photo} alt="Photo du signalement" width={400} height={300} className="rounded-lg border" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
