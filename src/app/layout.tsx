import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Quiniela Mundialista 2026",
  description: "La mejor quiniela para el Mundial 2026",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
