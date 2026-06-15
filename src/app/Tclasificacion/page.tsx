"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, LayoutDashboard, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { obtenerPartidosActualizados, BANDERAS, type PartidoReal } from "@/lib/partidosMundial"

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

const GRUPOS_EQUIPOS = [
  { id: "A", equipos: ["México", "Corea del Sur", "República Checa", "Sudáfrica"] },
  { id: "B", equipos: ["Canadá", "Bosnia y Herzegovina", "Catar", "Suiza"] },
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

export default function TclasificacionPage() {
  const [mostrarPosiciones, setMostrarPosiciones] = useState(true)
  const [grupoAbierto, setGrupoAbierto] = useState<string | null>("A")
  const [grupos, setGrupos] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  const calcularTablas = () => {
    const partidos = obtenerPartidosActualizados() // fuente única y actualizada

    // Inicializar estadísticas
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

    // Procesar solo partidos jugados
    partidos.forEach(partido => {
      if (!partido.jugado) return
      const local = stats[partido.local]
      const visitante = stats[partido.visitante]
      if (!local || !visitante) return

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
    })

    // Construir grupos ordenados
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
    setCargando(false)
  }

  useEffect(() => {
    calcularTablas()
    const interval = setInterval(calcularTablas, 5 * 60 * 1000) // refresco cada 5 min
    return () => clearInterval(interval)
  }, [])

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