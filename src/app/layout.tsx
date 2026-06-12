import type { Metadata } from "next";
import "./globals.css"; // Única importación correcta de estilos globales
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Quiniela Mundialista 2026",
  description: "Plataforma escalable de pronósticos para el mundial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
