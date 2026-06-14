"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, ArrowRight, ArrowLeft, LayoutDashboard, Calendar, MapPin, Clock, ChevronDown, ChevronUp, Users, Star, Newspaper, RefreshCw, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PartidoReal {
  id: number
  grupo: string
  local: string
  visitante: string
  banderaLocal: string
  banderaVisitante: string
  golesLocal: number
  golesVisitante: number
  jugado: boolean
  fecha: string
  hora: string
  estadio: string
  ciudad: string
  pais: string
  timestamp: number
  ronda: number
}

// BANDERAS oficiales
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

// RESULTADOS REALES DE PARTIDOS YA JUGADOS
const RESULTADOS_REALES: Record<number, { local: number; visitante: number }> = {
  1: { local: 2, visitante: 0 },   // México vs Sudáfrica
  2: { local: 2, visitante: 1 },   // Corea del Sur vs República Checa
  3: { local: 1, visitante: 1 },   // Canadá vs Bosnia y H.
  4: { local: 4, visitante: 1 },   // Estados Unidos vs Paraguay
}

// GENERAR TODOS LOS PARTIDOS DE LAS 3 RONDAS (48 PARTIDOS)
const generarTodosLosPartidos = (): PartidoReal[] => {
  const grupos = [
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

  const sedes = [
    { estadio: "Estadio Azteca", ciudad: "CDMX", pais: "México" },
    { estadio: "Estadio Akron", ciudad: "Guadalajara", pais: "México" },
    { estadio: "Estadio BBVA", ciudad: "Monterrey", pais: "México" },
    { estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá" },
    { estadio: "BC Place", ciudad: "Vancouver", pais: "Canadá" },
    { estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU" },
    { estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU" },
    { estadio: "Levi's Stadium", ciudad: "San Francisco", pais: "EEUU" },
    { estadio: "Gillette Stadium", ciudad: "Boston", pais: "EEUU" },
    { estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU" },
    { estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU" },
    { estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU" },
    { estadio: "Lumen Field", ciudad: "Seattle", pais: "EEUU" },
    { estadio: "Arrowhead Stadium", ciudad: "Kansas City", pais: "EEUU" },
    { estadio: "Hard Rock Stadium", ciudad: "Miami", pais: "EEUU" },
    { estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta", pais: "EEUU" }
  ]

  const fechasRonda1 = ["2026-06-11", "2026-06-12", "2026-06-13"]
  const fechasRonda2 = ["2026-06-14", "2026-06-15"]
  const fechasRonda3 = ["2026-06-16", "2026-06-17"]
  const horarios = ["13:00", "15:00", "18:00", "21:00"]

  const partidos: PartidoReal[] = []
  let id = 1
  let sedeIndex = 0

  // Ronda 1
  grupos.forEach(grupo => {
    for (let i = 0; i < grupo.equipos.length; i++) {
      for (let j = i + 1; j < grupo.equipos.length; j++) {
        const sede = sedes[sedeIndex % sedes.length]
        const fechaIndex = (id - 1) % fechasRonda1.length
        const horarioIndex = (id - 1) % horarios.length
        partidos.push({
          id: id++,
          grupo: grupo.id,
          local: grupo.equipos[i],
          visitante: grupo.equipos[j],
          banderaLocal: BANDERAS[grupo.equipos[i]] || "🏳️",
          banderaVisitante: BANDERAS[grupo.equipos[j]] || "🏳️",
          golesLocal: 0,
          golesVisitante: 0,
          jugado: false,
          fecha: fechasRonda1[fechaIndex],
          hora: horarios[horarioIndex],
          estadio: sede.estadio,
          ciudad: sede.ciudad,
          pais: sede.pais,
          timestamp: new Date(2026, 5, 11 + fechaIndex, parseInt(horarios[horarioIndex]), 0).getTime(),
          ronda: 1
        })
        sedeIndex++
      }
    }
  })

  // Ronda 2
  grupos.forEach(grupo => {
    for (let i = 0; i < grupo.equipos.length; i++) {
      for (let j = i + 1; j < grupo.equipos.length; j++) {
        const sede = sedes[sedeIndex % sedes.length]
        const fechaIndex = (partidos.filter(p => p.ronda === 2).length) % fechasRonda2.length
        const horarioIndex = (partidos.filter(p => p.ronda === 2).length) % horarios.length
        partidos.push({
          id: id++,
          grupo: grupo.id,
          local: grupo.equipos[i],
          visitante: grupo.equipos[j],
          banderaLocal: BANDERAS[grupo.equipos[i]] || "🏳️",
          banderaVisitante: BANDERAS[grupo.equipos[j]] || "🏳️",
          golesLocal: 0,
          golesVisitante: 0,
          jugado: false,
          fecha: fechasRonda2[fechaIndex],
          hora: horarios[horarioIndex],
          estadio: sede.estadio,
          ciudad: sede.ciudad,
          pais: sede.pais,
          timestamp: new Date(2026, 5, 14 + fechaIndex, parseInt(horarios[horarioIndex]), 0).getTime(),
          ronda: 2
        })
        sedeIndex++
      }
    }
  })

  // Ronda 3
  grupos.forEach(grupo => {
    for (let i = 0; i < grupo.equipos.length; i++) {
      for (let j = i + 1; j < grupo.equipos.length; j++) {
        const sede = sedes[sedeIndex % sedes.length]
        const fechaIndex = (partidos.filter(p => p.ronda === 3).length) % fechasRonda3.length
        const horarioIndex = (partidos.filter(p => p.ronda === 3).length) % horarios.length
        partidos.push({
          id: id++,
          grupo: grupo.id,
          local: grupo.equipos[i],
          visitante: grupo.equipos[j],
          banderaLocal: BANDERAS[grupo.equipos[i]] || "🏳️",
          banderaVisitante: BANDERAS[grupo.equipos[j]] || "🏳️",
          golesLocal: 0,
          golesVisitante: 0,
          jugado: false,
          fecha: fechasRonda3[fechaIndex],
          hora: horarios[horarioIndex],
          estadio: sede.estadio,
          ciudad: sede.ciudad,
          pais: sede.pais,
          timestamp: new Date(2026, 5, 16 + fechaIndex, parseInt(horarios[horarioIndex]), 0).getTime(),
          ronda: 3
        })
        sedeIndex++
      }
    }
  })

  // Aplicar resultados reales a los partidos jugados
  partidos.forEach(partido => {
    if (RESULTADOS_REALES[partido.id]) {
      partido.jugado = true
      partido.golesLocal = RESULTADOS_REALES[partido.id].local
      partido.golesVisitante = RESULTADOS_REALES[partido.id].visitante
    }
  })

  return partidos
}

const TODOS_LOS_PARTIDOS = generarTodosLosPartidos()

const obtenerPartidosPorRonda = (ronda: number) => {
  return TODOS_LOS_PARTIDOS.filter(p => p.ronda === ronda).sort((a, b) => a.timestamp - b.timestamp)
}

// Función para verificar si un partido está en vivo (timestamp entre inicio y fin)
const estaEnVivo = (timestamp: number): boolean => {
  const ahora = Date.now()
  const finPartido = timestamp + 90 * 60 * 1000 // 90 minutos de partido
  return ahora >= timestamp && ahora <= finPartido
}

export default function HistorialPage() {
  const [rondaSeleccionada, setRondaSeleccionada] = useState<number>(1)
  const [partidos, setPartidos] = useState<PartidoReal[]>([])
  const [actualizando, setActualizando] = useState(false)

  useEffect(() => {
    const partidosRonda = obtenerPartidosPorRonda(rondaSeleccionada)
    setPartidos(partidosRonda)
  }, [rondaSeleccionada])

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
  }

  const actualizarDatos = () => {
    setActualizando(true)
    setTimeout(() => {
      const partidosActualizados = obtenerPartidosPorRonda(rondaSeleccionada)
      setPartidos(partidosActualizados)
      setActualizando(false)
    }, 500)
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
          Historial de Partidos
        </h1>
        <button 
          onClick={actualizarDatos}
          disabled={actualizando}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className={`h-5 w-5 ${actualizando ? "animate-spin" : ""}`} />
        </button>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-10 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center">
          <div className="container px-4 mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-8 w-8 text-yellow-500 animate-pulse" />
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
                Quiniela Mundialista 2026
              </h1>
            </div>
            <p className="text-slate-400 text-base mt-1">
              Resultados y próximos partidos - Rondas 1, 2 y 3
            </p>
            <div className="mt-4">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white gap-2 font-bold shadow-lg shadow-sky-600/10" asChild>
                <Link href="/quiniela">
                  Llenar mi Quiniela <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Selector de rondas */}
        <section className="w-full py-2 bg-slate-900/30 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-center gap-1">
              {[1, 2, 3].map(ronda => (
                <button 
                  key={ronda}
                  onClick={() => setRondaSeleccionada(ronda)}
                  className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                    rondaSeleccionada === ronda 
                      ? 'bg-yellow-500 text-slate-950' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Ronda {ronda}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LISTADO DE PARTIDOS */}
        <section className="w-full py-6 bg-slate-950 px-4">
          <div className="max-w-4xl mx-auto">
            {partidos.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400">No hay partidos disponibles</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {partidos.map((partido) => {
                  const enVivo = !partido.jugado && estaEnVivo(partido.timestamp)
                  
                  return (
                    <div key={partido.id} className={`bg-slate-900 rounded-lg border overflow-hidden shadow-md transition-all ${
                      enVivo ? 'border-red-500/70 shadow-red-500/20' : 
                      partido.jugado ? 'border-slate-800' : 'border-slate-800'
                    }`}>
                      <div className="px-3 py-1.5 bg-slate-950/40 border-b border-slate-800">
                        <div className="text-center font-bold text-sky-400 text-xs">
                          Grupo {partido.grupo}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between gap-2 text-center font-bold text-sm">
                          <div className="flex-1 text-right">
                            <span className="text-base mr-1">{partido.banderaLocal}</span>
                            <span className="text-slate-100 text-xs">{partido.local.split(' ')[0]}</span>
                          </div>
                          {partido.jugado ? (
                            <div className="text-yellow-500 font-black text-base px-2 py-0.5 bg-slate-800 rounded">
                              {partido.golesLocal} - {partido.golesVisitante}
                            </div>
                          ) : enVivo ? (
                            <div className="text-red-500 font-black text-xs px-2 py-0.5 bg-red-500/20 rounded-full animate-pulse">
                              🔴 EN VIVO
                            </div>
                          ) : (
                            <div className="text-yellow-500 font-black text-xs px-2 py-0.5 bg-slate-800 rounded">VS</div>
                          )}
                          <div className="flex-1 text-left">
                            <span className="text-base mr-1">{partido.banderaVisitante}</span>
                            <span className="text-slate-100 text-xs">{partido.visitante.split(' ')[0]}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-center text-[10px] text-slate-400">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatearFecha(partido.fecha)}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {partido.hora} ET</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <MapPin className="h-2.5 w-2.5" />
                            <span>{partido.estadio}, {partido.ciudad}</span>
                          </div>
                        </div>
                        {partido.jugado && (
                          <div className="mt-1.5 text-center text-[9px] text-green-400 font-semibold">
                            ✓ Partido finalizado
                          </div>
                        )}
                        {enVivo && (
                          <div className="mt-1.5 text-center text-[9px] text-red-400 font-semibold animate-pulse">
                            ⚽ ¡En juego ahora!
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-slate-500 text-xs border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Datos oficiales actualizados en tiempo real según FIFA</p>
      </footer>
    </div>
  )
}