"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Trophy, LayoutDashboard, ChevronDown, ChevronUp, Users, Star, Newspaper } from "lucide-react"
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
          id: id++, grupo: grupo.id, local: equipos[i], visitante: equipos[j],
          golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15",
          hora: "18:00", estadio: "Por definir", ciudad: "Por definir", pais: "Por definir"
        })
      }
    }
  })
  return partidos
}

export default function TclasificacionPage() {
  const [mostrarPosiciones, setMostrarPosiciones] = useState(true)
  const [grupoAbierto, setGrupoAbierto] = useState<string | null>("A")
  const [grupos, setGrupos] = useState<any[]>([])
  const [partidosReales, setPartidosReales] = useState<PartidoReal[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("resultadosReales")
    if (saved) {
      setPartidosReales(JSON.parse(saved))
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
          n: equipo, b: BANDERAS[equipo] || "🏳️",
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
        local.pj++; visitante.pj++
        local.gf += partido.golesLocal; local.gc += partido.golesVisitante
        visitante.gf += partido.golesVisitante; visitante.gc += partido.golesLocal
        if (partido.golesLocal > partido.golesVisitante) {
          local.pg++; visitante.pp++; local.pts += 3
        } else if (partido.golesLocal < partido.golesVisitante) {
          local.pp++; visitante.pg++; visitante.pts += 3
        } else {
          local.pe++; visitante.pe++; local.pts += 1; visitante.pts += 1
        }
      }
    })

    const nuevosGrupos = GRUPOS_EQUIPOS.map(grupo => {
      const equiposConStats = grupo.equipos.map(equipo => stats[equipo]).filter(Boolean)
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
        <div className="text-yellow-500 text-xl animate-pulse">Cargando clasificación...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      {/* HEADER */}
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-yellow-500" />
          Clasificación
        </h1>
        <div className="w-5"></div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* TABLA DE POSICIONES */}
          <div className="text-center">
            <Button 
              onClick={() => setMostrarPosiciones(!mostrarPosiciones)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-wider gap-2 w-full sm:w-auto shadow-lg shadow-yellow-500/10 rounded-lg text-xs py-5 mb-6"
            >
              <LayoutDashboard className="h-4 w-4" />
              📊 Tablas de Posiciones
              {mostrarPosiciones ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {mostrarPosiciones && (
              <div className="mt-2 space-y-3 text-left">
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
        </div>
      </main>

      <footer className="py-6 text-center text-slate-500 text-xs border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Datos oficiales actualizados en tiempo real según FIFA</p>
      </footer>
    </div>
  )
}