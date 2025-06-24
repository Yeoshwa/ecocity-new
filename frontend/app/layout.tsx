import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import "leaflet/dist/leaflet.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EcoWatch - Gestion Participative des Déchets",
  description: "Application de signalement et gestion participative des déchets urbains",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
