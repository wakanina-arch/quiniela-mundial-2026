import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Quiniela Mundialista 2026",
  description: "La mejor quiniela para el Mundial 2026",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="overflow-x-hidden w-full max-w-full">{children}</body>
    </html>
  )
}