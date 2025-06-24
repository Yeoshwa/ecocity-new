"use client";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

const markerIconUrl = "/marker-icon.png";
const markerIcon2xUrl = "/marker-icon-2x.png";
const markerShadowUrl = "/marker-shadow.png";

export default function ReportMap({ lat, lng }: { lat: number; lng: number }) {
  useEffect(() => {
    // Correction du bug d'icône de marqueur Leaflet sur Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2xUrl,
      iconUrl: markerIconUrl,
      shadowUrl: markerShadowUrl,
    });
  }, []);

  const [map, setMap] = useState<any>(null);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      style={{ height: 220, width: "100%" }}
      scrollWheelZoom={true}
      zoomControl={true}
      whenCreated={setMap}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Carte OpenStreetMap">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Vue Satellite (Esri)">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.BaseLayer>
      </LayersControl>
      <Marker position={[lat, lng]}>
        <Popup>Signalement ici</Popup>
      </Marker>
    </MapContainer>
  );
}
