"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Trophy, Medal, Calendar, Clock, MapPin, Users, Star, 
  LayoutDashboard, Newspaper, ArrowRight 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { obtenerPartidosActualizados, getTodayEST, type PartidoReal } from "@/lib/partidosMundial"

// ------------------------------------------------------------
// Banderas (solo las necesarias para el bracket)
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// Grupos
// ------------------------------------------------------------
type Grupo = { id: string; color: string; equipos: string[] }
const GRUPOS: Grupo[] = [
  { id: "A", color: "from-emerald-500 to-emerald-700", equipos: ["México", "Corea del Sur", "República Checa", "Sudáfrica"] },
  { id: "B", color: "from-rose-500 to-rose-700", equipos: ["Canadá", "Bosnia y Herzegovina", "Catar", "Suiza"] },
  { id: "C", color: "from-orange-500 to-orange-700", equipos: ["Brasil", "Marruecos", "Haití", "Escocia"] },
  { id: "D", color: "from-blue-500 to-blue-700", equipos: ["Estados Unidos", "Paraguay", "Australia", "Turquía"] },
  { id: "E", color: "from-violet-500 to-violet-700", equipos: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"] },
  { id: "F", color: "from-lime-500 to-lime-700", equipos: ["Países Bajos", "Japón", "Suecia", "Túnez"] },
  { id: "G", color: "from-pink-500 to-pink-700", equipos: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"] },
  { id: "H", color: "from-teal-500 to-teal-700", equipos: ["España", "Cabo Verde", "Arabia Saudita", "Uruguay"] },
  { id: "I", color: "from-purple-500 to-purple-700", equipos: ["Francia", "Senegal", "Irak", "Noruega"] },
  { id: "J", color: "from-sky-500 to-sky-700", equipos: ["Argentina", "Argelia", "Austria", "Jordania"] },
  { id: "K", color: "from-amber-500 to-amber-700", equipos: ["Portugal", "RD Congo", "Uzbekistán", "Colombia"] },
  { id: "L", color: "from-indigo-500 to-indigo-700", equipos: ["Inglaterra", "Croacia", "Ghana", "Panamá"] }
]

// ------------------------------------------------------------
// SPLASH BRACKET
// ------------------------------------------------------------
function SplashBracket({ onTrophyClick }: { onTrophyClick: () => void }) {
  const gruposIzq = GRUPOS.slice(0, 6)
  const gruposDer = GRUPOS.slice(6, 12)

  return (
    <div className="w-full max-w-5xl mx-auto px-2 py-4">
      {/* HERO SUPERIOR */}
      <div className="text-center mb-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          WORLD CHAMPIONS
        </h1>
        <p className="text-[10px] sm:text-xs text-slate-400 tracking-wider">
          FIFA World Cup Sistem — 48 equipos · 12 grupos · 
        </p>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center justify-center">
        {/* GRUPOS IZQUIERDA */}
        <div className="flex flex-col gap-1.5 w-[80px]">
          {gruposIzq.map((g) => (
            <div key={g.id} className="rounded overflow-hidden border border-slate-700/50 bg-slate-900/50">
              <div className={`bg-gradient-to-r ${g.color} px-1.5 py-0.5 text-center text-white font-bold text-[8px] tracking-widest`}>
                {g.id}
              </div>
              <div className="grid grid-cols-2 gap-0.5 p-1">
                {g.equipos.map((eq) => (
                  <div key={eq} className="flex items-center justify-center text-sm bg-slate-800/50 rounded p-0.5">
                    {BANDERAS[eq] ?? "🏳️"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

       {/* BRACKET PIRAMIDAL - CON CENTRO ALINEADO */}
<div className="flex items-center justify-center gap-3">
  {/* R32 - cuadrados (8 columnas) */}
  <ColumnaSlots cantidad={8} etiqueta="R32" tamaño="sm" />
  
  {/* R16 - cuadrados (4 columnas) */}
  <ColumnaSlots cantidad={4} etiqueta="R16" tamaño="md" />
  
  {/* QF - cuadrados (2 columnas) */}
  <ColumnaSlots cantidad={2} etiqueta="QF" tamaño="lg" />

  {/* CENTRO: PLATA + TROPHY + BRONCE + CONSUELO - BAJADO UN POCO MÁS */}
  <div className="flex flex-col items-center justify-center gap-2 min-w-[80px] translate-y-6">
    {/* PLATA (2do lugar) */}
    <div className="flex items-center justify-center w-[44px] h-[44px]">
      <Medal className="w-5 h-5 text-sky-400" />
    </div>
    
    {/* TROPHY - BLOQUE CENTRAL */}
    <div className="flex items-center justify-center w-[52px] h-[52px]">
      <button 
        onClick={onTrophyClick}
        className="cursor-pointer group transition-transform hover:scale-110 duration-300"
        aria-label="Entrar al juego"
      >
        <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_40px_rgba(234,179,8,0.6)] animate-pulse group-hover:drop-shadow-[0_0_60px_rgba(234,179,8,0.9)] transition-all" />
      </button>
    </div>

    {/* BRONCE (3er lugar) */}
    <div className="flex items-center justify-center w-[44px] h-[44px]">
      <Medal className="w-5 h-5 text-amber-600" />
    </div>

    {/* CONSUELO (4to lugar) */}
    <div className="flex items-center justify-center w-[44px] h-[44px]">
      <Medal className="w-5 h-5 text-white/40" />
    </div>
  </div>

  {/* QF - cuadrados (2 columnas) */}
  <ColumnaSlots cantidad={2} etiqueta="QF" tamaño="lg" />
  
  {/* R16 - cuadrados (4 columnas) */}
  <ColumnaSlots cantidad={4} etiqueta="R16" tamaño="md" />
  
  {/* R32 - cuadrados (8 columnas) */}
  <ColumnaSlots cantidad={8} etiqueta="R32" tamaño="sm" />
</div>

        {/* GRUPOS DERECHA */}
        <div className="flex flex-col gap-1.5 w-[80px]">
          {gruposDer.map((g) => (
            <div key={g.id} className="rounded overflow-hidden border border-slate-700/50 bg-slate-900/50">
              <div className={`bg-gradient-to-r ${g.color} px-1.5 py-0.5 text-center text-white font-bold text-[8px] tracking-widest`}>
                {g.id}
              </div>
              <div className="grid grid-cols-2 gap-0.5 p-1">
                {g.equipos.map((eq) => (
                  <div key={eq} className="flex items-center justify-center text-sm bg-slate-800/50 rounded p-0.5">
                    {BANDERAS[eq] ?? "🏳️"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HERO INFERIOR */}
      <div className="text-center mt-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          Quiniela Mundialista
        </h2>
        <p className="text-[10px] sm:text-xs text-slate-400">
          ¡Divertite con el juego de estrategia del mundial de fútbol!
        </p>
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// COMPONENTES BRACKET
// ------------------------------------------------------------
function ColumnaSlots({ 
  cantidad, 
  etiqueta, 
  tamaño = "md" 
}: { 
  cantidad: number; 
  etiqueta: string;
  tamaño?: "sm" | "md" | "lg";
}) {
  const tamaños = {
    sm: { tamaño: "w-[52px] h-[52px]", texto: "text-[10px]", gap: "gap-2.5" },   // R32 - cuadrados medianos
    md: { tamaño: "w-[44px] h-[44px]", texto: "text-[9px]", gap: "gap-2" },      // R16 - cuadrados intermedios
    lg: { tamaño: "w-[36px] h-[36px]", texto: "text-[8px]", gap: "gap-1.5" },    // QF - cuadrados pequeños
  }

  const estilo = tamaños[tamaño]

  return (
    <div className={`flex flex-col justify-around ${estilo.gap} py-1`}>
      {Array.from({ length: cantidad }).map((_, i) => (
        <div 
          key={i} 
          className={`flex items-center justify-center bg-slate-900/30 border border-slate-700/30 border-dashed rounded ${estilo.tamaño}`}
        >
          <span className={`${estilo.texto} text-slate-500 uppercase tracking-wider font-medium`}>{etiqueta}</span>
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------
// HOME (partidos del día)
// ------------------------------------------------------------
function HomeContent() {
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
        <section className="w-full py-10 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center">
          <div className="container px-4 mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Trophy className="h-10 w-10 text-yellow-500 animate-pulse" />
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
                Quiniela Mundialista 2026
              </h1>
            </div>
            <p className="text-slate-400 text-lg mt-2">Demuestra cuánto sabes de fútbol y compite con amigos</p>
            <div className="mt-6">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white gap-2 font-bold" asChild>
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
// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------
export default function Home() {
  const [mostrarHome, setMostrarHome] = useState(false)

  const handleTrophyClick = () => {
    setMostrarHome(true)
  }

  if (mostrarHome) {
    return <HomeContent />
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <SplashBracket onTrophyClick={handleTrophyClick} />
    </div>
  )
}