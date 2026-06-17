"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Trophy, Users, Star, LayoutDashboard, Calendar, Clock, MapPin, 
  Newspaper, ArrowRight 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { obtenerPartidosActualizados, getTodayEST, type PartidoReal } from "@/lib/partidosMundial"

const BANDERAS: Record<string, string> = {
  "México": "🇲🇽", "Corea del Sur": "🇰🇷", "República Checa": "🇨🇿", "Sudáfrica": "🇿🇦",
  "Canadá": "🇨🇦", "Bosnia y Herzegovina": "🇧🇦", "Catar": "🇶🇦", "Suiza": "🇨🇭",
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

export default function HomePage() {
  const [partidosHoy, setPartidosHoy] = useState<PartidoReal[]>([])
  const [fechaFormateada, setFechaFormateada] = useState("")
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarPartidosDelDia = () => {
      const hoy = getTodayEST()
      const fechaObj = new Date(hoy)
      setFechaFormateada(fechaObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
      const todosPartidos = obtenerPartidosActualizados()
      const partidosHoy = todosPartidos.filter(p => p.fecha === hoy)
      setPartidosHoy(partidosHoy)
      setCargando(false)
    }
    cargarPartidosDelDia()
    const interval = setInterval(cargarPartidosDelDia, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (cargando) {
    return <div className="flex min-h-screen bg-slate-950 items-center justify-center"><div className="text-yellow-500 text-xl animate-pulse">Cargando...</div></div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-800 bg-slate-900 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span className="font-bold text-white hidden sm:inline">Quiniela Mundialista 2026</span>
        </div>
        <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/ranking"><Users className="h-4 w-4 text-sky-400" /> Rankings</Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/rondas"><LayoutDashboard className="h-4 w-4 text-yellow-500" /> Rondas</Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/Tclasificacion"><Star className="h-4 w-4 text-purple-400" /> Clasificación</Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/noticias"><Newspaper className="h-4 w-4 text-green-400" /> Noticias</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center">
          <div className="container px-4 mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Trophy className="h-10 w-10 text-yellow-500 animate-pulse" />
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
                Quiniela Mundialista 2026
              </h1>
            </div>
            <p className="text-slate-400 text-lg mt-2">Demuestra cuánto sabes de fútbol y compite con amigos</p>
            <div className="mt-6">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white gap-2 font-bold shadow-lg shadow-sky-600/10" asChild>
                <Link href="/quiniela">Llenar mi Quiniela <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-10 bg-slate-950 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-green-400 flex items-center gap-2 mb-6">
              <Calendar className="h-4 w-4" /> PARTIDOS DE HOY - {fechaFormateada}
            </h2>
            {partidosHoy.length === 0 ? (
              <div className="text-center text-slate-400 py-12">
                <Trophy className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                <p>No hay encuentros oficiales programados para hoy.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {partidosHoy.map((p) => {
                  const enVivo = !p.jugado && (Date.now() >= p.timestamp && Date.now() <= p.timestamp + 90 * 60 * 1000)
                  return (
                    <div key={p.id} className={`bg-slate-900 rounded-xl border overflow-hidden shadow-lg ${enVivo ? 'border-red-500/50' : 'border-slate-800'}`}>
                      <div className="p-4 bg-slate-950/40 border-b border-slate-800">
                        <div className="text-center font-bold text-sky-400 text-sm">Grupo {p.grupo}</div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3 text-center font-bold text-base">
                          <div className="flex-1 text-right">
                            <span className="text-lg mr-1">{BANDERAS[p.local] || "🏳️"}</span>
                            <span className="text-slate-100">{p.local}</span>
                          </div>
                          {p.jugado ? (
                            <div className="text-yellow-500 font-black text-base px-2 py-1 bg-slate-800 rounded">{p.golesLocal} - {p.golesVisitante}</div>
                          ) : enVivo ? (
                            <div className="text-red-500 font-black text-xs px-2 py-1 bg-red-500/20 rounded-full animate-pulse">🔴 EN VIVO</div>
                          ) : (
                            <div className="text-yellow-500 font-black text-xs px-2 py-1 bg-slate-800 rounded">VS</div>
                          )}
                          <div className="flex-1 text-left">
                            <span className="text-lg mr-1">{BANDERAS[p.visitante] || "🏳️"}</span>
                            <span className="text-slate-100">{p.visitante}</span>
                          </div>
                        </div>
                        <div className="mt-3 text-center text-xs text-slate-400 flex flex-wrap justify-center gap-2">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.horaLocal} ET</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.estadio}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Sin dinero · Sin inscripción · Diversión asegurada</p>
      </footer>
    </div>
  )
}
