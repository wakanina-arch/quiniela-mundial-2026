import { NextResponse } from "next/server"

// Forzar que nunca se cachee
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Obtener la fecha actual
    const hoy = new Date()
    const hoyStr = hoy.toISOString().split('T')[0]
    
    // Datos actualizados con fechas relativas
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)
    const mananaStr = manana.toISOString().split('T')[0]
    
    const pasado = new Date(hoy)
    pasado.setDate(pasado.getDate() + 2)
    const pasadoStr = pasado.toISOString().split('T')[0]
    
    // Generar partidos con fechas reales (hoy, mañana, pasado)
    const PARTIDOS_DINAMICOS = [
      { id: "1", local: "México", visitante: "Corea del Sur", banderaLocal: "🇲🇽", banderaVisitante: "🇰🇷", fecha: hoyStr, hora: "18:00", estadio: "Estadio Azteca", ciudad: "CDMX", pais: "México", grupo: "A", timestamp: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 18, 0).getTime(), estado: "scheduled" },
      { id: "2", local: "Canadá", visitante: "Bosnia y H.", banderaLocal: "🇨🇦", banderaVisitante: "🇧🇦", fecha: hoyStr, hora: "15:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", grupo: "B", timestamp: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 15, 0).getTime(), estado: "scheduled" },
      { id: "3", local: "Estados Unidos", visitante: "Paraguay", banderaLocal: "🇺🇸", banderaVisitante: "🇵🇾", fecha: hoyStr, hora: "18:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU", grupo: "D", timestamp: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 18, 0).getTime(), estado: "scheduled" },
      { id: "4", local: "Brasil", visitante: "Marruecos", banderaLocal: "🇧🇷", banderaVisitante: "🇲🇦", fecha: mananaStr, hora: "16:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", grupo: "C", timestamp: new Date(manana.getFullYear(), manana.getMonth(), manana.getDate(), 16, 0).getTime(), estado: "scheduled" },
      { id: "5", local: "Alemania", visitante: "Ecuador", banderaLocal: "🇩🇪", banderaVisitante: "🇪🇨", fecha: mananaStr, hora: "12:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", grupo: "E", timestamp: new Date(manana.getFullYear(), manana.getMonth(), manana.getDate(), 12, 0).getTime(), estado: "scheduled" },
      { id: "6", local: "Países Bajos", visitante: "Japón", banderaLocal: "🇳🇱", banderaVisitante: "🇯🇵", fecha: pasadoStr, hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", grupo: "F", timestamp: new Date(pasado.getFullYear(), pasado.getMonth(), pasado.getDate(), 15, 0).getTime(), estado: "scheduled" },
    ]
    
    // Cabeceras para evitar caché
    return NextResponse.json(PARTIDOS_DINAMICOS, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json([])
  }
}
