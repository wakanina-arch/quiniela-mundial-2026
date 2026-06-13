"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, Users, ArrowRight, Star, LayoutDashboard, MapPin, Tv, ChevronDown, ChevronUp, Calendar, Clock, Newspaper } from "lucide-react"
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

// TODOS LOS PARTIDOS DEL MUNDIAL (para referencia)
const TODOS_LOS_PARTIDOS: PartidoReal[] = [
  // Partidos ya jugados (resultados reales)
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
  // Partidos de hoy - 13 de junio
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
  // Partidos de mañana - 14 de junio
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

// Función para obtener la fecha actual en formato YYYY-MM-DD
const obtenerFechaHoy = (): string => {
  const hoy = new Date()
  return hoy.toISOString().split('T')[0]
}

// Filtrar partidos del día actual
const obtenerPartidosDelDia = (): PartidoReal[] => {
  const fechaHoy = obtenerFechaHoy()
  return TODOS_LOS_PARTIDOS.filter(p => p.fecha === fechaHoy)
}

const GRUPOS_EQUIPOS = [
  { id: "A", equipos: ["México", "Corea del Sur", "República Checa", "Sudáfrica"] },
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

const generarPartidosEnCero = (): PartidoReal[] => {
  const partidos: PartidoReal[] = []
  let id = 100

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
          jugado: false,
          fecha: "Por definir",
          hora: "--:--",
          estadio: "Por definir",
          ciudad: "Por definir",
          pais: "Por definir"
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
  const [partidosHoy, setPartidosHoy] = useState<PartidoReal[]>([])

  useEffect(() => {
    // Cargar partidos del día
    setPartidosHoy(obtenerPartidosDelDia())
    
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

    const partidosConResultados = [...TODOS_LOS_PARTIDOS.filter(p => p.jugado), ...partidosReales]
    
    partidosConResultados.forEach(partido => {
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

  // Formatear fecha para mostrar
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (cargando) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <div className="text-yellow-500 text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-center border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <nav className="flex gap-2 sm:gap-4 items-center">
  <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800">
    <Link href="/historial" className="gap-1 flex items-center">
      <LayoutDashboard className="h-4 w-4 text-yellow-500" /> Historial
    </Link>
  </Button>
  <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
    <Link href="/rankings" className="gap-1 flex items-center">
      <Users className="h-4 w-4 text-sky-400" /> Rankings
    </Link>
  </Button>
  <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800">
    <Link href="/top4" className="gap-1 flex items-center">
      <Star className="h-4 w-4 text-purple-400" /> Top 4
    </Link>
  </Button>
  <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800">
    <Link href="/noticias" className="gap-1 flex items-center">
      <Newspaper className="h-4 w-4 text-green-400" /> Noticias
    </Link>
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

        {/* SOLO PARTIDOS DEL DÍA */}
        <section className="w-full py-10 bg-slate-950 px-4 border-b border-slate-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-green-400 flex items-center gap-2 mb-6">
              <Calendar className="h-4 w-4" /> PARTIDOS DE HOY - {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            
            {partidosHoy.length === 0 ? (
              <div className="text-center text-slate-400 py-12">
                <Trophy className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                <p>No hay partidos programados para hoy</p>
                <p className="text-sm mt-2">¡Disfruta del descanso!</p>
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
              <div className="mt-6 space-y-3 text-left">
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
        <p>© 2026 Quiniela Mundialista — Datos oficiales actualizados en tiempo real según FIFA</p>
      </footer>
    </div>
  )
}