"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, ArrowLeft, LayoutDashboard, Medal, RefreshCw, X, Calendar, MapPin, Clock } from "lucide-react"
import { obtenerPartidosActualizados, getTodayEST, type PartidoReal } from "@/lib/partidosMundial"

// ------------------------------------------------------------
// Banderas
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
// Bracket (slots)
// ------------------------------------------------------------
type Slot = string
type Match = { top: Slot; bot: Slot }

const R32_IZQ: Match[] = [
  { top: "1E", bot: "3ABCDF" },
  { top: "1I", bot: "3CDFGH" },
  { top: "2A", bot: "2B" },
  { top: "1F", bot: "2C" },
  { top: "2K", bot: "2L" },
  { top: "1H", bot: "2J" },
  { top: "1D", bot: "3BEFIJ" },
  { top: "1G", bot: "3AEHIJ" },
]

const R32_DER: Match[] = [
  { top: "1C", bot: "2F" },
  { top: "2E", bot: "2I" },
  { top: "1A", bot: "3CEFHI" },
  { top: "1L", bot: "3EHIJK" },
  { top: "1J", bot: "2H" },
  { top: "2D", bot: "2G" },
  { top: "1B", bot: "3EFGIJ" },
  { top: "1K", bot: "3DEIJL" },
]

// ------------------------------------------------------------
// UI Helpers - Minimalistas
// ------------------------------------------------------------
function CeldaSlot({ codigo, onClick }: { codigo: Slot; onClick?: () => void }) {
  const equipoReal = GRUPOS.flatMap(g => g.equipos).find(e => e === codigo)
  const bandera = equipoReal ? (BANDERAS[equipoReal] || "🏳️") : null

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 bg-slate-800/60 border border-slate-700 rounded px-2 py-1 min-w-[72px] cursor-pointer hover:border-yellow-500/50 hover:bg-slate-800 transition-all"
    >
      {bandera ? (
        <>
          <span className="text-sm">{bandera}</span>
          <span className="text-[10px] text-slate-200 truncate max-w-[40px]">{equipoReal}</span>
        </>
      ) : (
        <span className="text-[9px] font-mono text-slate-400">{codigo}</span>
      )}
    </div>
  )
}

function CeldaVacia({ etiqueta, onClick }: { etiqueta?: string; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-center bg-slate-900/40 border border-slate-700 border-dashed rounded h-8 min-w-[72px] cursor-pointer hover:border-yellow-500/50 hover:bg-slate-900/60 transition-all"
    >
      <span className="text-[9px] text-slate-500 uppercase tracking-wider">{etiqueta ?? "—"}</span>
    </div>
  )
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------
export default function RondasPage() {
  const [partidos, setPartidos] = useState<PartidoReal[]>([])
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(false)
  const [fechaActual, setFechaActual] = useState("")
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [panelContenido, setPanelContenido] = useState<{ titulo: string; partidos: PartidoReal[] } | null>(null)

  useEffect(() => {
    const cargarDatos = () => {
      const hoy = getTodayEST()
      setFechaActual(hoy)
      const todos = obtenerPartidosActualizados()
      setPartidos(todos)
      setCargando(false)
    }
    cargarDatos()
    const interval = setInterval(cargarDatos, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const actualizarDatos = () => {
    setActualizando(true)
    const todos = obtenerPartidosActualizados()
    setPartidos(todos)
    setTimeout(() => setActualizando(false), 500)
  }

  const abrirPanelGrupo = (grupoId: string) => {
    const partidosGrupo = partidos.filter(p => p.grupo === grupoId)
    const grupo = GRUPOS.find(g => g.id === grupoId)
    setPanelContenido({
      titulo: `Grupo ${grupoId} - ${grupo?.equipos.join(' · ') || ''}`,
      partidos: partidosGrupo
    })
    setPanelAbierto(true)
  }

  const abrirPanelRonda = (titulo: string) => {
    // Mostrar algunos partidos de ejemplo para la ronda
    const partidosRonda = partidos.filter(p => p.jugado).slice(0, 4)
    setPanelContenido({
      titulo: titulo,
      partidos: partidosRonda.length > 0 ? partidosRonda : partidos.slice(0, 4)
    })
    setPanelAbierto(true)
  }

  const gruposIzq = GRUPOS.slice(0, 6)
  const gruposDer = GRUPOS.slice(6, 12)

  if (cargando) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-yellow-500 text-xl animate-pulse">Cargando mapa del torneo...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> Mapa del Torneo
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 hidden sm:inline">{fechaActual}</span>
            <button onClick={actualizarDatos} disabled={actualizando} className="text-slate-400 hover:text-white transition-colors">
              <RefreshCw className={`w-4 h-4 ${actualizando ? "animate-spin" : ""}`} />
            </button>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
              <LayoutDashboard className="w-4 h-4" /> Inicio
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-3 py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">WORLD CHAMPIONS</h2>
          <p className="text-xs text-slate-400 mt-1">FIFA World Cup 2026 — 48 equipos · 12 grupos · Eliminación directa</p>
        </div>

        {/* BRACKET PIRAMIDAL - CENTRADO */}
        <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center justify-center">
          {/* GRUPOS IZQUIERDA */}
          <div className="flex flex-col gap-2 w-[110px]">
            {gruposIzq.map((g) => (
              <div key={g.id} onClick={() => abrirPanelGrupo(g.id)} className="cursor-pointer">
                <TarjetaGrupoMinimal g={g} />
              </div>
            ))}
          </div>

          {/* BRACKET PIRAMIDAL */}
          <div className="flex items-center justify-center gap-2">
            {/* R32 Izquierda */}
            <ColumnaPartidos matches={R32_IZQ} onRondaClick={() => abrirPanelRonda("Ronda de 32 (Izquierda)")} />

            {/* R16 */}
            <ColumnaRondaMinimal cantidad={4} etiqueta="R16" onClick={() => abrirPanelRonda("Ronda de 16")} />

            {/* QF */}
            <ColumnaRondaMinimal cantidad={2} etiqueta="QF" onClick={() => abrirPanelRonda("Cuartos de Final")} />

            {/* CENTRO: Semifinal + Final + Bronce */}
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              <CeldaVacia etiqueta="SF" onClick={() => abrirPanelRonda("Semifinales")} />
              <div className="flex flex-col items-center gap-1 my-1">
                <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]" />
                <CeldaVacia etiqueta="CAMPEÓN" onClick={() => abrirPanelRonda("Final")} />
                <span className="text-[8px] text-slate-400 tracking-widest">FINAL</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Medal className="w-5 h-5 text-amber-600" />
                <CeldaVacia etiqueta="3er" onClick={() => abrirPanelRonda("Tercer Puesto")} />
                <span className="text-[8px] text-slate-400 tracking-widest">BRONCE</span>
              </div>
              <CeldaVacia etiqueta="SF" onClick={() => abrirPanelRonda("Semifinales")} />
            </div>

            {/* QF */}
            <ColumnaRondaMinimal cantidad={2} etiqueta="QF" onClick={() => abrirPanelRonda("Cuartos de Final")} />

            {/* R16 */}
            <ColumnaRondaMinimal cantidad={4} etiqueta="R16" onClick={() => abrirPanelRonda("Ronda de 16")} />

            {/* R32 Derecha */}
            <ColumnaPartidos matches={R32_DER} onRondaClick={() => abrirPanelRonda("Ronda de 32 (Derecha)")} />
          </div>

          {/* GRUPOS DERECHA */}
          <div className="flex flex-col gap-2 w-[110px]">
            {gruposDer.map((g) => (
              <div key={g.id} onClick={() => abrirPanelGrupo(g.id)} className="cursor-pointer">
                <TarjetaGrupoMinimal g={g} />
              </div>
            ))}
          </div>
        </div>

        {/* LEYENDA */}
        <section className="mt-10 grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Cómo leer el mapa</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              <span className="font-mono text-slate-200">1A</span> = ganador del Grupo A · 
              <span className="font-mono text-slate-200 ml-1">2B</span> = segundo del Grupo B · 
              <span className="font-mono text-slate-200 ml-1">3ABCDF</span> = mejor tercero.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Datos en tiempo real</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Actualización automática cada 5 minutos. Haz clic en cualquier elemento para ver detalles.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Interactividad</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Clic en grupo → partidos del grupo. Clic en ronda → partidos de esa fase.
            </p>
          </div>
        </section>
      </main>

      {/* MODAL CENTRADO CON MARCADORES */}
      {panelAbierto && panelContenido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white truncate">{panelContenido.titulo}</h3>
              <button onClick={() => setPanelAbierto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {panelContenido.partidos.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <p>No hay partidos disponibles</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {panelContenido.partidos.map((p) => (
                    <div key={p.id} className="bg-slate-800/50 rounded-lg border border-slate-700 p-3">
                      {/* MARCADORES CENTRADOS */}
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2 min-w-[80px] justify-end">
                          <span className="text-lg">{BANDERAS[p.local] || "🏳️"}</span>
                          <span className="font-medium text-slate-200 text-sm">{p.local}</span>
                        </div>
                        <div className="text-yellow-500 font-black text-base min-w-[50px] text-center">
                          {p.jugado ? `${p.golesLocal} - ${p.golesVisitante}` : "VS"}
                        </div>
                        <div className="flex items-center gap-2 min-w-[80px] justify-start">
                          <span className="font-medium text-slate-200 text-sm">{p.visitante}</span>
                          <span className="text-lg">{BANDERAS[p.visitante] || "🏳️"}</span>
                        </div>
                      </div>
                      {/* Info adicional */}
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.fecha}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.horaLocal} ET</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.estadio}</span>
                      </div>
                      {p.jugado && (
                        <div className="mt-1 text-center text-[9px] text-green-400">✓ Finalizado</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-800 mt-10 py-4 text-center text-xs text-slate-500">
        © 2026 Quiniela Mundialista — Mapa basado en el formato FIFA 2026
      </footer>
    </div>
  )
}

// ------------------------------------------------------------
// COMPONENTES MINIMALISTAS
// ------------------------------------------------------------
function TarjetaGrupoMinimal({ g }: { g: Grupo }) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-sm hover:shadow-md transition-all hover:border-yellow-500/50">
      <div className={`bg-gradient-to-r ${g.color} px-2 py-0.5 text-center text-white font-bold text-[9px] tracking-widest`}>
        {g.id}
      </div>
      <div className="grid grid-cols-2 gap-0.5 p-1">
        {g.equipos.map((eq) => (
          <div key={eq} title={eq} className="flex items-center justify-center text-lg bg-slate-800 rounded p-0.5">
            {BANDERAS[eq] ?? "🏳️"}
          </div>
        ))}
      </div>
    </div>
  )
}

function ColumnaPartidos({ matches, onRondaClick }: { matches: Match[]; onRondaClick: () => void }) {
  return (
    <div className="flex flex-col justify-between gap-2 py-1">
      {matches.map((m, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <CeldaSlot codigo={m.top} onClick={onRondaClick} />
          <CeldaSlot codigo={m.bot} onClick={onRondaClick} />
        </div>
      ))}
    </div>
  )
}

function ColumnaRondaMinimal({ cantidad, etiqueta, onClick }: { cantidad: number; etiqueta: string; onClick: () => void }) {
  return (
    <div className="flex flex-col justify-around gap-3 py-1">
      {Array.from({ length: cantidad }).map((_, i) => (
        <CeldaVacia key={i} etiqueta={etiqueta} onClick={onClick} />
      ))}
    </div>
  )
}