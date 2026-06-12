"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, Users, ArrowRight, Star, LayoutDashboard, MapPin, Tv, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Equipo {
  n: string
  b: string
  pj: number
  pg: number
  pe: number
  pp: number
  gf: number
  gc: number
  pts: number
}

interface PartidoReal {
  id: number
  grupo: string
  local: string
  visitante: string
  golesLocal: number
  golesVisitante: number
  jugado: boolean
}

// Banderas oficiales
const BANDERAS: Record<string, string> = {
  "México": "🇲🇽", "Corea del Sur": "🇰🇷", "Chequia": "🇨🇿", "Sudáfrica": "🇿🇦",
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

const GRUPOS_EQUIPOS = [
  { id: "A", equipos: ["México", "Corea del Sur", "Chequia", "Sudáfrica"] },
  { id: "B", equipos: ["Canadá", "Bosnia y H.", "Catar", "Suiza"] },
  { id: "C", equipos: ["Brasil", "Marruecos", "Haití", "Escocia"] },
  { id: "D", equipos: ["Estados Unidos", "Paraguay", "Australia", "Turquía"] },
  { id: "E", equipos: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"] },
  { id: "F", equipos: ["Países Bajos", "Japón", "Suecia", "Túnez"] },
  { id: "G", equipos: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"] },
  { id: "H", equipos: ["España", "Cabo Verde", "Arabia Saudita", "Uruguay"] },
  { id: "I", equipos: ["Francia", "Senegal", "Irak", "Noruega"] },
  { id: "J", equipos: ["Argentina", "Argelia", "Austria", "Jordania"] },
  { id: "K", equipos: ["Portugal", "RD Congo", "Uzbekistán", "Colombia"] },
  { id: "L", equipos: ["Inglaterra", "Croacia", "Ghana", "Panamá"] }
]

// Generar TODOS los partidos de fase de grupos (72 partidos) EN CERO
const generarPartidosEnCero = (): PartidoReal[] => {
  const partidos: PartidoReal[] = []
  let id = 1

  GRUPOS_EQUIPOS.forEach(grupo => {
    const equipos = grupo.equipos
    for (let i = 0; i < equipos.length; i++) {
      for (let j = i + 1; j < equipos.length; j++) {
        partidos.push({
          id: id++,
          grupo: grupo.id,
          local: equipos[i],
          visitante: equipos[j],
          golesLocal: 0,
          golesVisitante: 0,
          jugado: false
        })
      }
    }
  })

  return partidos
}

export default function Home() {
  const [mostrarPosiciones, setMostrarPosiciones] = useState(false)
  const [grupoAbierto, setGrupoAbierto] = useState<string | null>("A")
  const [grupos, setGrupos] = useState<any[]>([])
  const [partidosReales, setPartidosReales] = useState<PartidoReal[]>([])
  const [cargando, setCargando] = useState(true)

  // Inicializar o cargar datos guardados
  useEffect(() => {
    const saved = localStorage.getItem("resultadosReales")
    if (saved) {
      const parsed = JSON.parse(saved)
      setPartidosReales(parsed)
    } else {
      const partidosIniciales = generarPartidosEnCero()
      setPartidosReales(partidosIniciales)
      localStorage.setItem("resultadosReales", JSON.stringify(partidosIniciales))
    }
    setCargando(false)
  }, [])

  // Calcular tabla de posiciones cuando cambian los resultados
  useEffect(() => {
    if (partidosReales.length > 0) {
      calcularTablas()
    }
  }, [partidosReales])

  const calcularTablas = () => {
    const stats: Record<string, Equipo> = {}
    
    GRUPOS_EQUIPOS.forEach(grupo => {
      grupo.equipos.forEach(equipo => {
        stats[equipo] = {
          n: equipo,
          b: BANDERAS[equipo] || "🏳️",
          pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0
        }
      })
    })

    partidosReales.forEach(partido => {
      if (!partido.jugado) return

      const local = stats[partido.local]
      const visitante = stats[partido.visitante]
      
      if (local && visitante) {
        local.pj++
        visitante.pj++
        local.gf += partido.golesLocal
        local.gc += partido.golesVisitante
        visitante.gf += partido.golesVisitante
        visitante.gc += partido.golesLocal

        if (partido.golesLocal > partido.golesVisitante) {
          local.pg++
          visitante.pp++
          local.pts += 3
        } else if (partido.golesLocal < partido.golesVisitante) {
          local.pp++
          visitante.pg++
          visitante.pts += 3
        } else {
          local.pe++
          visitante.pe++
          local.pts += 1
          visitante.pts += 1
        }
      }
    })

    const nuevosGrupos = GRUPOS_EQUIPOS.map(grupo => {
      const equiposConStats = grupo.equipos.map(equipo => stats[equipo])
      equiposConStats.sort((a, b) => {
        if (a.pts !== b.pts) return b.pts - a.pts
        const diffA = a.gf - a.gc
        const diffB = b.gf - b.gc
        if (diffA !== diffB) return diffB - diffA
        return b.gf - a.gf
      })
      return { id: grupo.id, equipos: equiposConStats }
    })

    setGrupos(nuevosGrupos)
  }

  const toggleGrupo = (grupo: string) => {
    setGrupoAbierto(grupoAbierto === grupo ? null : grupo)
  }

  if (cargando) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <div className="text-yellow-500 text-xl">Cargando tabla de posiciones...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2 font-bold text-xl tracking-tight" href="/">
          <Trophy className="h-6 w-6 text-yellow-500 animate-pulse" />
          <span>Quiniela Mundialista 2026</span>
        </Link>
        <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800">
            <Link href="/quiniela" className="gap-1 flex items-center">
              <LayoutDashboard className="h-4 w-4 text-yellow-500" /> Pronósticos
            </Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/leaderboard" className="gap-1 flex items-center">
              <Users className="h-4 w-4 text-sky-400" /> Clasificación
            </Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800">
            <Link href="#" className="gap-1 flex items-center">
              <Star className="h-4 w-4 text-purple-400" /> Top 4
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center">
          <div className="container px-4 mx-auto max-w-4xl">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
              Quiniela Mundialista 2026
            </h1>
            <p className="text-slate-400 text-lg mt-2">
              Demuestra cuánto sabes de fútbol
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

        {/* SECCIÓN: PARTIDOS PARA HOY */}
        <section className="w-full py-10 bg-slate-950 px-4 border-b border-slate-900">
          <div className="max-w-xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-400 flex items-center gap-2 mb-6 justify-center sm:justify-start">
              <Tv className="h-4 w-4" /> PARTIDOS PARA HOY
            </h2>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center sm:text-left">
              Próximos partidos - Fase de Grupos
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl mb-6">
              <div className="flex items-center justify-between p-5 bg-slate-950/40 border-b border-slate-800 text-center font-bold text-base sm:text-lg">
                <div className="flex-1 text-right pr-4 text-slate-100 font-extrabold flex items-center justify-end gap-2">
                  <span>🇲🇽</span>
                  <span>México</span>
                </div>
                <div className="flex items-center justify-center px-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-yellow-500 font-black text-xs uppercase tracking-widest shadow-inner">
                  VS
                </div>
                <div className="flex-1 text-left pl-4 text-slate-100 font-extrabold flex items-center justify-start gap-2">
                  <span>🇰🇷</span>
                  <span>Corea del Sur</span>
                </div>
              </div>
              <div className="px-5 py-3 bg-slate-900/50 flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <MapPin className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                <span>Estadio Azteca, México (Fase de Grupos - Grupo A)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN: TABLAS DE POSICIONES */}
        <section className="w-full py-10 bg-slate-950 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Button 
              onClick={() => setMostrarPosiciones(!mostrarPosiciones)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-wider gap-2 w-full sm:w-auto shadow-lg shadow-yellow-500/10 rounded-lg"
            >
              <LayoutDashboard className="h-4 w-4 text-black" />
              <span className="text-black">📊 Tablas de Posiciones</span>
              {mostrarPosiciones ? 
                <ChevronUp className="h-4 w-4 text-black" /> : 
                <ChevronDown className="h-4 w-4 text-black" />
              }
            </Button>

            {mostrarPosiciones && (
              <div className="mt-6 space-y-3 text-left animate-in fade-in duration-200">
                {grupos.map((grupo) => (
                  <div key={grupo.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <button 
                      onClick={() => toggleGrupo(grupo.id)}
                      className="w-full p-4 bg-slate-950/60 flex justify-between items-center text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/50 hover:bg-slate-900 transition-colors"
                    >
                      <span>Grupo {grupo.id}</span>
                      {grupoAbierto === grupo.id ? <ChevronUp className="h-4 w-4 text-sky-400" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                    </button>
                    
                    {grupoAbierto === grupo.id && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-800/50 text-slate-300 text-xs">
                            <tr>
                              <th className="p-3 text-left">#</th>
                              <th className="p-3 text-left">Equipo</th>
                              <th className="p-3 text-center">PJ</th>
                              <th className="p-3 text-center">PG</th>
                              <th className="p-3 text-center">PE</th>
                              <th className="p-3 text-center">PP</th>
                              <th className="p-3 text-center">GF</th>
                              <th className="p-3 text-center">GC</th>
                              <th className="p-3 text-center">DIF</th>
                              <th className="p-3 text-center font-bold text-yellow-400">PTS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {grupo.equipos.map((equipo: Equipo, idx: number) => (
                              <tr key={equipo.n} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                                <td className="p-3 text-left font-bold">{idx + 1}</td>
                                <td className="p-3 text-left">
                                  <span className="text-lg mr-2">{equipo.b}</span>
                                  <span className="font-medium">{equipo.n}</span>
                                </td>
                                <td className="p-3 text-center">{equipo.pj}</td>
                                <td className="p-3 text-center text-green-400">{equipo.pg}</td>
                                <td className="p-3 text-center text-yellow-400">{equipo.pe}</td>
                                <td className="p-3 text-center text-red-400">{equipo.pp}</td>
                                <td className="p-3 text-center font-semibold">{equipo.gf}</td>
                                <td className="p-3 text-center font-semibold">{equipo.gc}</td>
                                <td className="p-3 text-center font-bold">{equipo.gf - equipo.gc}</td>
                                <td className="p-3 text-center font-black text-yellow-400 text-lg">{equipo.pts}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Datos oficiales actualizados en tiempo real</p>
      </footer>
    </div>
  )
}