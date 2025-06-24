"use client"

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import L from "leaflet"

interface Report {
  id: number
  lat: number
  lng: number
  type: "urgent" | "moderate" | "resolved"
  category: string
  description: string
  photo: string
  date: string
  author: string
  address: string
  votes: number
  status: string
}

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  participants: number
  lat: number
  lng: number
}

interface InteractiveMapProps {
  reports: Report[]
  events: Event[]
  onPinClick: (report: Report | Event) => void
  onMapClick: (lat: number, lng: number) => void
}

const defaultPosition: [number, number] = [-4.312, 15.284]; // Kinshasa, Gombe

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function InteractiveMap({ reports, events, onPinClick, onMapClick }: InteractiveMapProps) {
  const reportIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  })


  console.log("reports", reports);
  console.log("events", events);
  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />
      {reports
  .filter(report => typeof report.lat === "number" && typeof report.lng === "number")
  .map((report) => (
    <Marker
      key={"report-" + report.id}
      position={[report.lat, report.lng]}
      icon={reportIcon}
      eventHandlers={{ click: () => onPinClick(report) }}
    >
      <Popup>
        <div>
          <strong>{report.category}</strong>
          <br />
          {report.description}
          <br />
          <span style={{ fontSize: "0.85em", color: "#888" }}>{report.date}</span>
          <br />
          <a href={`/report/${report.id}`} style={{ color: "blue", textDecoration: "underline" }}>Voir le signalement</a>
        </div>
      </Popup>
    </Marker>
))}

{events
  .filter(event =>
    typeof event.lat === "number" &&
    typeof event.lng === "number" &&
    !isNaN(event.lat) &&
    !isNaN(event.lng)
  )
  .map((event) => (
    <Marker
      key={"event-" + event.id}
      position={[event.lat, event.lng]}
      icon={reportIcon}
      eventHandlers={{ click: () => onPinClick(event) }}
    >
      <Popup>
        <div>
          <strong>{event.title}</strong>
          <br />
          {event.location}
          <br />
          <span style={{ fontSize: "0.85em", color: "#888" }}>{event.date}</span>
          <br />
          <a href={`/event/${event.id}`} style={{ color: "blue", textDecoration: "underline" }}>Voir l'événement</a>
        </div>
      </Popup>
    </Marker>
))}
    </MapContainer>
  )
}