"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, LayoutDashboard, ChevronDown, ChevronUp, Trophy, ArrowUp, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { obtenerPartidosActualizados, BANDERAS, type PartidoReal } from "@/lib/partidosMundial"
import { obtenerRankingCompleto, obtenerDiasParaProxima, obtenerInfoCache, type PaisRanking } from "@/lib/rankingFIFA"

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// GRUPOS DE EQUIPOS
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// MAPA DE BANDERAS PARA RANKING FIFA
// ------------------------------------------------------------
const BANDERAS_FIFA: Record<string, string> = {
  "Argentina": "🇦🇷", "Francia": "🇫🇷", "España": "🇪🇸", "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Portugal": "🇵🇹", "Brasil": "🇧🇷", "Marruecos": "🇲🇦", "Países Bajos": "🇳🇱",
  "Alemania": "🇩🇪", "Bélgica": "🇧🇪", "Croacia": "🇭🇷", "Italia": "🇮🇹",
  "México": "🇲🇽", "Colombia": "🇨🇴", "EE. UU.": "🇺🇸", "Senegal": "🇸🇳",
  "Japón": "🇯🇵", "Uruguay": "🇺🇾", "Suiza": "🇨🇭", "Dinamarca": "🇩🇰",
  "Corea del Sur": "🇰🇷", "Australia": "🇦🇺", "Irán": "🇮🇷", "Austria": "🇦🇹",
  "Nigeria": "🇳🇬", "Turquía": "🇹🇷", "Argelia": "🇩🇿", "Ecuador": "🇪🇨",
  "Egipto": "🇪🇬", "Costa de Marfil": "🇨🇮", "Noruega": "🇳🇴", "Canadá": "🇨🇦",
  "Ucrania": "🇺🇦", "Panamá": "🇵🇦", "Suecia": "🇸🇪", "Rusia": "🇷🇺",
  "Polonia": "🇵🇱", "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Gales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Hungría": "🇭🇺",
  "Serbia": "🇷🇸", "Paraguay": "🇵🇾", "República Checa": "🇨🇿", "Camerún": "🇨🇲",
  "RD Congo": "🇨🇩", "Eslovaquia": "🇸🇰", "Grecia": "🇬🇷", "Venezuela": "🇻🇪",
  "Catar": "🇶🇦", "Uzbekistán": "🇺🇿", "Chile": "🇨🇱", "Perú": "🇵🇪",
  "Costa Rica": "🇨🇷", "Rumanía": "🇷🇴", "Mali": "🇲🇱", "Túnez": "🇹🇳",
  "Irak": "🇮🇶", "República de Irlanda": "🇮🇪", "Eslovenia": "🇸🇮", "Arabia Saudita": "🇸🇦",
  "Sudáfrica": "🇿🇦", "Burkina Faso": "🇧🇫", "Bosnia y Herzegovina": "🇧🇦", "Cabo Verde": "🇨🇻",
  "Jordania": "🇯🇴", "Honduras": "🇭🇳", "Albania": "🇦🇱", "Emiratos Árabes Unidos": "🇦🇪",
  "Macedonia del Norte": "🇲🇰", "Irlanda del Norte": "🇬🇧", "Jamaica": "🇯🇲",
  "Georgia": "🇬🇪", "Ghana": "🇬🇭", "Islandia": "🇮🇸", "Finlandia": "🇫🇮",
  "Israel": "🇮🇱", "Bolivia": "🇧🇴", "Kosovo": "🇽🇰", "Omán": "🇴🇲",
  "Montenegro": "🇲🇪", "Guinea": "🇬🇳", "Nueva Zelanda": "🇳🇿", "Curazao": "🇨🇼",
  "Siria": "🇸🇾", "Haití": "🇭🇹", "Gabón": "🇬🇦", "Bulgaria": "🇧🇬",
  "Angola": "🇦🇴", "Uganda": "🇺🇬", "Zambia": "🇿🇲", "RP China": "🇨🇳",
  "Baréin": "🇧🇭", "Benín": "🇧🇯", "Tailandia": "🇹🇭", "Palestina": "🇵🇸",
  "Bielorrusia": "🇧🇾", "Guatemala": "🇬🇹", "Luxemburgo": "🇱🇺", "Vietnam": "🇻🇳",
  "El Salvador": "🇸🇻", "Tayikistán": "🇹🇯", "Trinidad y Tobago": "🇹🇹", "Mozambique": "🇲🇿",
  "Madagascar": "🇲🇬", "Guinea Ecuatorial": "🇬🇶", "Kirguizistán": "🇰🇬", "Armenia": "🇦🇲",
  "Comoras": "🇰🇲", "Kenia": "🇰🇪", "Libia": "🇱🇾", "Kazajistán": "🇰🇿",
  "Tanzania": "🇹🇿", "Mauritania": "🇲🇷", "Níger": "🇳🇪", "Líbano": "🇱🇧",
  "Gambia": "🇬🇲", "Sudán": "🇸🇩", "Indonesia": "🇮🇩", "Togo": "🇹🇬",
  "RPD de Corea": "🇰🇵", "Namibia": "🇳🇦", "Sierra Leona": "🇸🇱", "Islas Feroe": "🇫🇴",
  "Chipre": "🇨🇾", "Surinam": "🇸🇷", "Azerbaiyán": "🇦🇿", "Estonia": "🇪🇪",
  "Ruanda": "🇷🇼", "Malaui": "🇲🇼", "Zimbabue": "🇿🇼", "Nicaragua": "🇳🇮",
  "Guinea-Bisáu": "🇬🇼", "Kuwait": "🇰🇼", "Congo": "🇨🇬", "Filipinas": "🇵🇭",
  "Malasia": "🇲🇾", "Letonia": "🇱🇻", "India": "🇮🇳", "República Centroafricana": "🇨🇫",
  "Liberia": "🇱🇷", "Turkmenistán": "🇹🇲", "Burundi": "🇧🇮", "Etiopía": "🇪🇹",
  "República Dominicana": "🇩🇴", "Yemen": "🇾🇪", "Lesoto": "🇱🇸", "Botsuana": "🇧🇼",
  "Singapur": "🇸🇬", "Lituania": "🇱🇹", "Guyana": "🇬🇾", "Nueva Caledonia": "🇳🇨",
  "San Cristóbal y Nieves": "🇰🇳", "Islas Salomón": "🇸🇧", "Puerto Rico": "🇵🇷",
  "Fiyi": "🇫🇯", "Hong Kong": "🇭🇰", "Tahití": "🇵🇫", "Myanmar": "🇲🇲",
  "Moldavia": "🇲🇩", "Vanuatu": "🇻🇺", "Malta": "🇲🇹", "Antigua y Barbuda": "🇦🇬",
  "Granada": "🇬🇩", "Cuba": "🇨🇺", "Suazilandia": "🇸🇿", "Santa Lucía": "🇱🇨",
  "Bermuda": "🇧🇲", "Papúa Nueva Guinea": "🇵🇬", "Sudán del Sur": "🇸🇸", "San Vicente y las Granadinas": "🇻🇨",
  "Afganistán": "🇦🇫", "Andorra": "🇦🇩", "Maldivas": "🇲🇻", "China Taipéi": "🇹🇼",
  "Camboya": "🇰🇭", "Montserrat": "🇲🇸", "Nepal": "🇳🇵", "Mauricio": "🇲🇺",
  "Barbados": "🇧🇧", "Belice": "🇧🇿", "Bangladés": "🇧🇩", "Dominica": "🇩🇲",
  "Chad": "🇹🇩", "Eritrea": "🇪🇷", "Laos": "🇱🇦", "Islas Cook": "🇨🇰",
  "Sri Lanka": "🇱🇰", "Samoa": "🇼🇸", "Aruba": "🇦🇼", "Mongolia": "🇲🇳",
  "Samoa Estadounidense": "🇦🇸", "Bután": "🇧🇹", "Macao": "🇲🇴", "Brunéi Darusalam": "🇧🇳",
  "Santo Tomé y Príncipe": "🇸🇹", "Yibuti": "🇩🇯", "Islas Caimán": "🇰🇾", "Pakistán": "🇵🇰",
  "Somalia": "🇸🇴", "Tonga": "🇹🇴", "Timor Oriental": "🇹🇱", "Gibraltar": "🇬🇮",
  "Guam": "🇬🇺", "Seychelles": "🇸🇨", "Islas Turcas y Caicos": "🇹🇨", "Liechtenstein": "🇱🇮",
  "Bahamas": "🇧🇸", "Islas Vírgenes Estadounidenses": "🇻🇮", "Islas Vírgenes Británicas": "🇻🇬",
  "Anguilla": "🇦🇮", "San Marino": "🇸🇲"
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------
export default function TclasificacionPage() {
  const [tab, setTab] = useState<'grupos' | 'ranking'>('grupos')
  const [mostrarPosiciones, setMostrarPosiciones] = useState(true)
  const [grupoAbierto, setGrupoAbierto] = useState<string | null>("A")
  const [grupos, setGrupos] = useState<any[]>([])
  const [ranking, setRanking] = useState<PaisRanking[]>([])
  const [diasParaProxima, setDiasParaProxima] = useState(0)
  const [infoCache, setInfoCache] = useState<any>({})
  const [cargando, setCargando] = useState(true)
  const [mostrarTodos, setMostrarTodos] = useState(false)
  const [mostrarBotonArriba, setMostrarBotonArriba] = useState(false)

  // ============================================================
  // CALCULAR TABLA DE POSICIONES
  // ============================================================
  const calcularTablas = () => {
    const partidos = obtenerPartidosActualizados()

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

    const partidosOrdenados = [...partidos].sort((a, b) => a.timestamp - b.timestamp)
    
    partidosOrdenados.forEach(partido => {
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

  // ============================================================
  // CARGAR RANKING FIFA
  // ============================================================
  const cargarRanking = async () => {
    try {
      const data = await obtenerRankingCompleto()
      setRanking(data)
      setDiasParaProxima(obtenerDiasParaProxima())
      setInfoCache(obtenerInfoCache())
    } catch (error) {
      console.error('Error al cargar ranking:', error)
    }
  }

  // ============================================================
  // EFECTOS
  // ============================================================
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true)
      calcularTablas()
      await cargarRanking()
      setCargando(false)
    }
    cargarDatos()
    
    const interval = setInterval(() => {
      calcularTablas()
      cargarRanking()
    }, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  // ============================================================
  // SCROLL DETECTION
  // ============================================================
  useEffect(() => {
    const handleScroll = () => {
      setMostrarBotonArriba(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ============================================================
  // FUNCIONES UI
  // ============================================================
  const toggleGrupo = (grupo: string) => {
    setGrupoAbierto(grupoAbierto === grupo ? null : grupo)
  }

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const scrollArriba = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const rankingMostrar = mostrarTodos ? ranking : ranking.slice(0, 50)

  // ============================================================
  // RENDER
  // ============================================================
  if (cargando) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <div className="text-yellow-500 text-xl animate-pulse">Cargando...</div>
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
        <div className="max-w-6xl mx-auto">
          {/* TABS */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('grupos')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                tab === 'grupos' 
                  ? 'bg-yellow-500 text-slate-950' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              📊 Grupos
            </button>
            <button
              onClick={() => setTab('ranking')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                tab === 'ranking' 
                  ? 'bg-yellow-500 text-slate-950' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌍 Ranking FIFA
            </button>
          </div>

          {/* ============================================================
              TAB: GRUPOS
              ============================================================ */}
          {tab === 'grupos' && (
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
                        <span className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          Grupo {grupo.id}
                        </span>
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
          )}

          {/* ============================================================
              TAB: RANKING FIFA - VERSIÓN CORREGIDA
              ============================================================ */}
          {tab === 'ranking' && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 bg-slate-950/60 border-b border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-bold text-yellow-400">🌍 Clasificación Mundial FIFA</h2>
                  <div className="text-[10px] text-slate-400">
                    <span>Actualizado: {formatearFecha(infoCache.ultimaActualizacion || new Date().toISOString())}</span>
                    <span className="ml-3">Próxima: {diasParaProxima} días</span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/50 text-slate-300 text-xs sticky top-0">
                    <tr>
                      <th className="p-3 text-left">Pos</th>
                      <th className="p-3 text-left">Equipo</th>
                      <th className="p-3 text-center">Puntos</th>
                      <th className="p-3 text-center">Cambio</th>
                      <th className="p-3 text-center" title="Goles por partido (FIFA)">
                        <span className="flex items-center justify-center gap-1">
                          GPP
                          <Info className="h-3 w-3 text-slate-500" />
                        </span>
                      </th>
                      <th className="p-3 text-center" title="Goles recibidos por partido (FIFA)">
                        <span className="flex items-center justify-center gap-1">
                          GRPP
                          <Info className="h-3 w-3 text-slate-500" />
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingMostrar.map((pais) => {
                      const bandera = BANDERAS_FIFA[pais.nombre] || "🏳️"
                      return (
                        <tr key={pais.posicion} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                          <td className="p-3 text-left font-bold text-yellow-400">{pais.posicion}</td>
                          <td className="p-3 text-left">
                            <span className="text-lg mr-2">{bandera}</span>
                            <span className="font-medium">{pais.nombre}</span>
                          </td>
                          <td className="p-3 text-center font-semibold">{pais.puntos.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            {pais.cambio > 0 && <span className="text-green-400">↑{pais.cambio}</span>}
                            {pais.cambio < 0 && <span className="text-red-400">↓{Math.abs(pais.cambio)}</span>}
                            {pais.cambio === 0 && <span className="text-slate-500">—</span>}
                          </td>
                          <td className="p-3 text-center text-xs text-slate-400">—</td>
                          <td className="p-3 text-center text-xs text-slate-400">—</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                
                {/* Botón "Ver más" - SIEMPRE visible si hay más de 10 equipos (para pruebas) */}
                {ranking.length > 10 && (
                  <div className="p-4 text-center border-t border-slate-800 bg-slate-900/50">
                    <button
                      onClick={() => setMostrarTodos(!mostrarTodos)}
                      className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                      {mostrarTodos ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Mostrar menos
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Ver todos ({ranking.length} equipos)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-slate-500 text-xs border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Datos oficiales actualizados según FIFA</p>
      </footer>

      {/* BOTÓN FLOTANTE "VOLVER ARRIBA" CON LUCIDE REACT */}
      {mostrarBotonArriba && (
        <button
          onClick={scrollArriba}
          className="fixed bottom-6 right-6 z-50 bg-yellow-500 hover:bg-yellow-600 text-slate-950 p-3 rounded-full shadow-2xl transition-all hover:scale-110"
          aria-label="Volver arriba"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}