"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trophy, Users, ArrowRight, Star, LayoutDashboard, MapPin, ChevronDown, ChevronUp, Calendar, Clock, Newspaper, X, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PartidoReal {
  id: number
  grupo: string
  local: string
  visitante: string
  golesLocal: number
  golesVisitante: number
  jugado: boolean
  fecha: string
  hora: string
  estadio: string
  ciudad: string
  pais: string
  timestamp?: number
}

const BANDERAS: Record<string, string> = {
  "México": "🇲🇽", "Corea del Sur": "🇰🇷", "República Checa": "🇨🇿", "Sudáfrica": "🇿🇦",
  "Canadá": "🇨🇦", "Bosnia y H.": "🇧🇦", "Catar": "🇶🇦", "Suiza": "🇨🇭",
  "Brasil": "🇧🇷", "Marruecos": "🇲🇦", "Haití": "🇭🇹", "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Estados Unidos": "🇺🇸", "Paraguay": "🇵🇾", "Australia": "🇦🇺", "Turquía": "🇹🇷",
  "Alemania": "🇩🇪", "Curazao": "🇨🇼", "Costa de Marfil": "🇨🇮", "Ecuador": "🇪🇨",
  "Países Bajos": "🇳🇱", "Japón": "🇯🇵", "Suecia": "🇸🇪", "Túnez": "🇹🇳",
  "Bélgica": "🇧🇪", "Egipto": "🇪🇬", "Irán": "🇮🇷", "Nueva Zelanda": "🇳🇿",
  "España": "🇪🇸", "Cabo Verde": "🇨🇻", "Arabia Saudita": "🇸🇦", "Uruguay": "🇺🇾",
  "Francia": "🇫🇷", "Senegal": "🇸🇳", "Irak": "🇮🇶", "Noruega": "🇳🇴",
  "Argentina": "🇦🇷", "Argelia": "🇩🇿", "Austria": "🇦🇹", "Jordania": "🇯🇴",
  "Portugal": "🇵🇹", "RD Congo": "🇨🇩", "Uzbekistán": "🇺🇿", "Colombia": "🇨🇴",
  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croacia": "🇭🇷", "Ghana": "🇬🇭", "Panamá": "🇵🇦"
}

const TODOS_LOS_PARTIDOS: PartidoReal[] = [
  {
    id: 1, grupo: "A", local: "México", visitante: "Sudáfrica",
    golesLocal: 2, golesVisitante: 0, jugado: true,
    fecha: "2026-06-11", hora: "13:00", estadio: "Estadio Azteca", ciudad: "Ciudad de México", pais: "México",
    timestamp: new Date(2026, 5, 11, 13, 0).getTime()
  },
  {
    id: 2, grupo: "A", local: "Corea del Sur", visitante: "República Checa",
    golesLocal: 2, golesVisitante: 1, jugado: true,
    fecha: "2026-06-11", hora: "20:00", estadio: "Estadio Akron", ciudad: "Guadalajara", pais: "México",
    timestamp: new Date(2026, 5, 11, 20, 0).getTime()
  },
  {
    id: 3, grupo: "B", local: "Canadá", visitante: "Bosnia y H.",
    golesLocal: 1, golesVisitante: 1, jugado: true,
    fecha: "2026-06-12", hora: "15:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá",
    timestamp: new Date(2026, 5, 12, 15, 0).getTime()
  },
  {
    id: 4, grupo: "D", local: "Estados Unidos", visitante: "Paraguay",
    golesLocal: 4, golesVisitante: 1, jugado: true,
    fecha: "2026-06-12", hora: "18:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU",
    timestamp: new Date(2026, 5, 12, 18, 0).getTime()
  },
  {
    id: 5, grupo: "B", local: "Catar", visitante: "Suiza",
    golesLocal: 0, golesVisitante: 0, jugado: false,
    fecha: "2026-06-13", hora: "15:00", estadio: "Levi's Stadium", ciudad: "San Francisco", pais: "EEUU",
    timestamp: new Date(2026, 5, 13, 15, 0).getTime()
  },
  {
    id: 6, grupo: "C", local: "Brasil", visitante: "Marruecos",
    golesLocal: 0, golesVisitante: 0, jugado: false,
    fecha: "2026-06-13", hora: "18:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU",
    timestamp: new Date(2026, 5, 13, 18, 0).getTime()
  },
  {
    id: 7, grupo: "C", local: "Haití", visitante: "Escocia",
    golesLocal: 0, golesVisitante: 0, jugado: false,
    fecha: "2026-06-13", hora: "21:00", estadio: "Gillette Stadium", ciudad: "Boston", pais: "EEUU",
    timestamp: new Date(2026, 5, 13, 21, 0).getTime()
  },
  {
    id: 8, grupo: "D", local: "Australia", visitante: "Turquía",
    golesLocal: 0, golesVisitante: 0, jugado: false,
    fecha: "2026-06-14", hora: "00:00", estadio: "BC Place", ciudad: "Vancouver", pais: "Canadá",
    timestamp: new Date(2026, 5, 14, 0, 0).getTime()
  },
  {
    id: 9, grupo: "E", local: "Alemania", visitante: "Curazao",
    golesLocal: 0, golesVisitante: 0, jugado: false,
    fecha: "2026-06-14", hora: "12:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU",
    timestamp: new Date(2026, 5, 14, 12, 0).getTime()
  },
  {
    id: 10, grupo: "F", local: "Países Bajos", visitante: "Japón",
    golesLocal: 0, golesVisitante: 0, jugado: false,
    fecha: "2026-06-14", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU",
    timestamp: new Date(2026, 5, 14, 15, 0).getTime()
  },
  {
    id: 11, grupo: "E", local: "Costa de Marfil", visitante: "Ecuador",
    golesLocal: 0, golesVisitante: 0, jugado: false,
    fecha: "2026-06-14", hora: "19:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU",
    timestamp: new Date(2026, 5, 14, 19, 0).getTime()
  },
  {
    id: 12, grupo: "F", local: "Suecia", visitante: "Túnez",
    golesLocal: 0, golesVisitante: 0, jugado: false,
    fecha: "2026-06-14", hora: "20:00", estadio: "Estadio BBVA", ciudad: "Monterrey", pais: "México",
    timestamp: new Date(2026, 5, 14, 20, 0).getTime()
  }
]

export default function Home() {
  const router = useRouter()
  const [activarSplash, setActivarSplash] = useState(false)
  const [partidosHoy, setPartidosHoy] = useState<PartidoReal[]>([])
  const [fechaFormateada, setFechaFormateada] = useState("")

  useEffect(() => {
    const hoy = new Date()
    setFechaFormateada(hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }))
    
    const fechaISO = hoy.getFullYear() + "-" + String(hoy.getMonth() + 1).padStart(2, '0') + "-" + String(hoy.getDate()).padStart(2, '0')
    setPartidosHoy(TODOS_LOS_PARTIDOS.filter(p => p.fecha === fechaISO))
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      {/* HEADER NAVBAR */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-800 bg-slate-900 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span className="font-bold text-white hidden sm:inline">Quiniela Mundialista 2026</span>
        </div>
        <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
          
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/ranking" className="gap-1 flex items-center"><Users className="h-4 w-4 text-sky-400" /> Ranking</Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/rondas" className="gap-1 flex items-center"><LayoutDashboard className="h-4 w-4 text-yellow-500" />Rondas</Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/Tclasificacion" className="gap-1 flex items-center"><Star className="h-4 w-4 text-purple-400" /> Tclasificación</Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/noticias" className="gap-1 flex items-center"><Newspaper className="h-4 w-4 text-green-400" /> Noticias</Link>
          </Button>
        </nav>
      </header>

      {/* CONTENIDO HOME PRINCIPAL */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center">
          <div className="container px-4 mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Trophy className="h-10 w-10 text-yellow-500 animate-pulse" />
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
                Quiniela Mundialista 2026
              </h1>
            </div>
            <p className="text-slate-400 text-lg mt-2">
              Demuestra cuánto sabes de fútbol y compite con amigos
            </p>
            <div className="mt-6">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white gap-2 font-bold shadow-lg shadow-sky-600/10" asChild>
                <Link href="/quiniela">
                  Llenar mi Quiniela <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* PARTIDOS DEL DÍA */}
        <section className="w-full py-10 bg-slate-950 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-green-400 flex items-center gap-2 mb-6">
              <Calendar className="h-4 w-4" /> PARTIDOS DE HOY - {fechaFormateada}
            </h2>
            {partidosHoy.length === 0 ? (
              <div className="text-center text-slate-400 py-12">
                <Trophy className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                <p>No hay encuentros oficiales programados para hoy.</p>
                <p className="text-sm mt-2">¡Aprovecha para repasar tus tácticas!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {partidosHoy.map((partido) => (
                  <div key={partido.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                    <div className="p-4 bg-slate-950/40 border-b border-slate-800">
                      <div className="text-center font-bold text-sky-400 text-sm">
                        Grupo {partido.grupo}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3 text-center font-bold text-base">
                        <div className="flex-1 text-right">
                          <span className="text-lg mr-1">{BANDERAS[partido.local] || "🏳️"}</span>
                          <span className="text-slate-100">{partido.local}</span>
                        </div>
                        {partido.jugado ? (
                          <div className="text-yellow-500 font-black text-lg px-2 py-1 bg-slate-800 rounded">
                            {partido.golesLocal} - {partido.golesVisitante}
                          </div>
                        ) : (
                          <div className="text-yellow-500 font-black text-xs px-2 py-1 bg-slate-800 rounded">VS</div>
                        )}
                        <div className="flex-1 text-left">
                          <span className="text-lg mr-1">{BANDERAS[partido.visitante] || "🏳️"}</span>
                          <span className="text-slate-100">{partido.visitante}</span>
                        </div>
                      </div>
                      <div className="mt-3 text-center text-xs text-slate-400 flex flex-wrap justify-center gap-2">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {partido.hora} ET</span>
                      </div>
                      <div className="mt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {partido.estadio}, {partido.ciudad} ({partido.pais})
                      </div>
                      {partido.jugado && (
                        <div className="mt-2 text-center text-[10px] text-green-400">
                          ✓ Partido finalizado
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Datos oficiales actualizados en tiempo real según parámetros FIFA</p>
      </footer>

      {/* BOTÓN FLOTANTE: Participa / Vive la aventura */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setActivarSplash(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm px-5 py-3 rounded-full shadow-2xl shadow-orange-500/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 border border-amber-400/20 animate-pulse"
        >
          <PartyPopper className="h-5 w-5" />
          Participa / Vive la aventura
        </button>
      </div>

      {/* MODAL SPLASH - Overlay de inscripción */}
      {activarSplash && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl max-w-md w-full text-center p-8 border border-yellow-500/30 shadow-2xl relative">
            <button
              onClick={() => setActivarSplash(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 p-2 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="animate-bounce mb-6">
              <Trophy className="h-20 w-20 text-yellow-500 mx-auto" />
            </div>
            
            <h2 className="text-3xl font-black text-white mb-2">QUINIELA MUNDIAL 2026</h2>
            <p className="text-slate-300 text-sm mb-6">JUEGO 100% GRATUITO DE ESTRATEGIA</p>
            
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center justify-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-2 rounded-lg">
                <span className="text-2xl">⚽️</span> 10 balones gratis
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-2 rounded-lg">
                <span className="text-2xl">🏉</span> Comodín
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-2 rounded-lg">
                <span className="text-2xl">🏆</span> Tickets Mundial
              </div>
            </div>
            
            <Button 
              onClick={() => { setActivarSplash(false); router.push("/registro"); }} 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black py-6 text-lg gap-2"
            >
              Comenzar Aventura <PartyPopper className="h-5 w-5" />
            </Button>
            
            <p className="text-[10px] text-slate-600 mt-6">
              Juego gratuito. Sin dinero real. +13 años.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}