import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quiniela Mundialista 2026',
  description: 'Juego de estrategia del mundial de fútbol',
  applicationName: 'Quiniela Mundialista',
  authors: [{ name: 'Quiniela Mundialista' }],
  keywords: ['quiniela', 'mundial', 'fútbol', 'estrategia', 'apuestas'],
  creator: 'Quiniela Mundialista',
  publisher: 'Quiniela Mundialista',
  icons: {
    icon: '/favicon.ico',
  },
}

// ✅ VIEWPORT CORREGIDO - separado de metadata
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
