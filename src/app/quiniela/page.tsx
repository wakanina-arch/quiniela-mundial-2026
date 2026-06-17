"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trophy, Calendar, MapPin, Clock, TrendingUp, Award, ArrowLeft, X, CheckCircle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { obtenerPartidosActualizados, getTodayEST, type PartidoReal } from "@/lib/partidosMundial"

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------
interface Apuesta {
  L: boolean
  E: boolean
  V: boolean
  golesLocal: string
  golesVisita: string
  aceptada: boolean
}

interface ApuestaFinalista {
  primero: string
  segundo: string
  aceptada: boolean
}

interface Jugador {
  id: string
  nombre: string
  balones: number
  medallas: number
  copas: number
}

// ------------------------------------------------------------
// FUNCIONES AUXILIARES
// ------------------------------------------------------------
const mostrarBalones = (cantidad: number): string => {
  if (cantidad === 0) return "⚽️0"
  let resultado = ""
  for (let i = 0; i < Math.min(cantidad, 10); i++) resultado += "⚽️"
  if (cantidad > 10) resultado += ` +${cantidad - 10}`
  return resultado
}

const getTipoApuesta = (apuesta: Apuesta) => {
  const count = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
  if (count === 0) return { texto: "", icono: "", costo: 0 }
  if (count === 1) return { texto: "Simple", icono: "🔴", costo: 1 }
  if (count === 2) return { texto: "Doble", icono: "🟡", costo: 2 }
  return { texto: "Triple", icono: "🔴", costo: 3 }
}

const obtenerEstadoPartido = (partido: PartidoReal & { autoMarcado?: boolean }) => {
  const ahora = Date.now()
  const inicio = partido.timestamp
  const finPartido = inicio + 90 * 60 * 1000
  const finMargen = finPartido + 30 * 60 * 1000

  if (partido.jugado) {
    if (partido.autoMarcado) return { color: "bg-yellow-500/30", mensaje: "⏳ Pendiente", bloqueado: true }
    return { color: "bg-green-500/30", mensaje: "✅ Finalizado", bloqueado: true }
  }

  if (ahora < inicio) {
    const minutosFaltan = Math.floor((inicio - ahora) / (1000 * 60))
    if (minutosFaltan <= 20) {
      return { color: "bg-yellow-500/30", mensaje: "⏰ Apuesta cerrada", bloqueado: true }
    }
    return { color: "bg-blue-500/30", mensaje: "✅ Apuesta abierta", bloqueado: false }
  }

  if (ahora >= inicio && ahora < finPartido) {
    return { color: "bg-red-500/30 animate-pulse", mensaje: "🔴 EN VIVO", bloqueado: true }
  }

  if (ahora >= finPartido && ahora < finMargen) {
    return { color: "bg-yellow-500/30", mensaje: "⏳ Finalizado (sin resultado)", bloqueado: true }
  }

  return { color: "bg-yellow-500/30", mensaje: "⏳ Pendiente", bloqueado: true }
}

// ------------------------------------------------------------
// MODALES
// ------------------------------------------------------------
const ModalReglas = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-black text-amber-500">REGLAMENTO</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button>
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          <p>• ⚽️ = 1 apuesta (Resultado o Marcador)</p>
          <p>• Máximo 10 ⚽️ por jugador</p>
          <p>• Cada acierto = +1 ⚽️</p>
          <p>• 5 🏵 = 1 🏆 (Apuesta Mundialista)</p>
        </div>
        <Button onClick={onClose} className="w-full mt-4 bg-amber-500 text-slate-950 font-black">Cerrar</Button>
      </div>
    </div>
  )
}

const ModalResumen = ({ open, onClose, total }: { open: boolean; onClose: () => void; total: number }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl max-w-md w-full border border-yellow-500/30 p-6">
        <h2 className="text-lg font-bold text-white text-center mb-4">Confirmar Apuestas</h2>
        <p className="text-3xl font-black text-yellow-500 text-center mb-4">{mostrarBalones(total)}</p>
        <Button onClick={onClose} className="w-full bg-green-600 text-white font-bold">Confirmar</Button>
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------
export default function QuinielaPage() {
  const router = useRouter()
  const [partidos, setPartidos] = useState<(PartidoReal & { autoMarcado?: boolean })[]>([])
  const [apuestas, setApuestas] = useState<Record<string, Apuesta>>({})
  const [apuestaFinalista, setApuestaFinalista] = useState<ApuestaFinalista>({ primero: "", segundo: "", aceptada: false })
  const [jugador, setJugador] = useState<Jugador | null>(null)
  const [mostrarReglas, setMostrarReglas] = useState(false)
  const [mostrarModalResumen, setMostrarModalResumen] = useState(false)
  const [cargando, setCargando] = useState(true)

  // ============================================================
  // useEffect para cargar partidos, jugador y apuestas
  // ============================================================
  useEffect(() => {
    const cargarPartidos = () => {
      const hoy = getTodayEST()
      if (!hoy) return
      
      const todos = obtenerPartidosActualizados()
      const partidosHoy = todos.filter(p => p.fecha === hoy)
      setPartidos(partidosHoy)
      setCargando(false)
    }

    cargarPartidos()
    
    // Actualizar cada 5 minutos
    const interval = setInterval(cargarPartidos, 5 * 60 * 1000)

    // Cargar jugador
    const jugadorGuardado = localStorage.getItem("jugador_actual")
    if (jugadorGuardado) {
      try {
        setJugador(JSON.parse(jugadorGuardado))
      } catch {
        router.push("/registro")
      }
    } else {
      router.push("/registro")
    }

    // Cargar apuestas
    const apis = localStorage.getItem("apuestas_quiniela")
    if (apis) {
      try {
        setApuestas(JSON.parse(apis))
      } catch {
        console.warn("Error al cargar apuestas")
      }
    }
    
    // Cargar apuesta de finalistas
    const final = localStorage.getItem("apuesta_finalista")
    if (final) {
      try {
        setApuestaFinalista(JSON.parse(final))
      } catch {
        console.warn("Error al cargar apuesta finalista")
      }
    }

    return () => clearInterval(interval)
  }, [router])

  // ============================================================
  // useEffect para persistir apuestas
  // ============================================================
  useEffect(() => {
    localStorage.setItem("apuestas_quiniela", JSON.stringify(apuestas))
  }, [apuestas])

  useEffect(() => {
    localStorage.setItem("apuesta_finalista", JSON.stringify(apuestaFinalista))
  }, [apuestaFinalista])

  // ============================================================
  // FUNCIONES DE APUESTAS
  // ============================================================
  const estamparSello = (partidoId: string, tipo: "L" | "E" | "V") => {
    setApuestas(prev => {
      const actual = prev[partidoId] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
      if (actual.aceptada) return prev
      const nueva = { ...actual, [tipo]: !actual[tipo] }
      const seleccionadas = [nueva.L, nueva.E, nueva.V].filter(Boolean).length
      if (seleccionadas > 3) return prev
      return { ...prev, [partidoId]: nueva }
    })
  }

  const handleGoles = (partidoId: string, campo: "golesLocal" | "golesVisita", valor: string) => {
    const limpio = valor.replace(/[^0-9]/g, "")
    setApuestas(prev => {
      const actual = prev[partidoId] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
      if (actual.aceptada) return prev
      return { ...prev, [partidoId]: { ...actual, [campo]: limpio } }
    })
  }

  const aceptarApuesta = (partidoId: string) => {
    setApuestas(prev => ({ ...prev, [partidoId]: { ...prev[partidoId], aceptada: true } }))
  }

  const editarApuesta = (partidoId: string) => {
    setApuestas(prev => ({ ...prev, [partidoId]: { ...prev[partidoId], aceptada: false } }))
  }

  const totalApuestas = Object.values(apuestas).filter((a: any) => a.aceptada).length

  // ============================================================
  // RENDER
  // ============================================================
  if (cargando) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-yellow-500">Cargando...</div></div>
  }

  if (!jugador) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-yellow-500">Cargando...</div></div>
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* HEADER */}
      <header className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link href="/home" className="text-slate-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="flex flex-col items-center">
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" /> Quiniela</h1>
          <p className="text-[10px] text-slate-400">{jugador.nombre}</p>
        </div>
        <div className="w-5" />
      </header>

      {/* Panel de recursos */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 py-2 px-4">
        <div className="max-w-4xl mx-auto flex justify-center gap-6 text-center">
          <div><div className="text-xl">{mostrarBalones(jugador.balones)}</div><div className="text-[9px] text-slate-400">Balones</div></div>
          <div><div className="text-xl">{jugador.medallas > 0 ? "🏵️".repeat(Math.min(jugador.medallas, 3)) : "0"}</div><div className="text-[9px] text-slate-400">Medallas</div></div>
          <div><div className="text-xl">{jugador.copas > 0 ? "🏆".repeat(Math.min(jugador.copas, 2)) : "0"}</div><div className="text-[9px] text-slate-400">Copas</div></div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-3 px-4 border-b border-slate-700">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">¡Pronostica y Gana!</h2>
            <p className="text-xs text-slate-400">Usa tus balones sabiamente</p>
          </div>
          <Button onClick={() => setMostrarReglas(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm px-4 py-2">
            📋 Reglas
          </Button>
        </div>
      </div>

      {/* Lista de partidos */}
      <div className="p-2 md:p-3 pb-28">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Apuesta de finalistas */}
          <div className="relative">
            <div className="bg-slate-800/30 rounded-r-lg rounded-l-none overflow-hidden">
              <div className="pt-1 px-2">
                <span className="text-[0.6rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                  <Award className="h-2.5 w-2.5" /> 1ra. Apuesta: Finalistas (1 🏆)
                </span>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full opacity-70"></div>
              <div className="pl-2">
                <div className="p-2">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="text-center"><span className="text-[0.5rem] font-bold text-green-400 block mb-1">🏆 CAMPEÓN</span><Input type="text" placeholder="Ej. Brasil" value={apuestaFinalista.primero} onChange={(e) => setApuestaFinalista(prev => ({ ...prev, primero: e.target.value }))} disabled={apuestaFinalista.aceptada} className="w-28 text-center bg-slate-950 border-slate-800 text-white h-7 text-xs" /></div>
                    <div className="text-center"><span className="text-[0.5rem] font-bold text-blue-400 block mb-1">🥈 SUBCAMPEÓN</span><Input type="text" placeholder="Ej. Argentina" value={apuestaFinalista.segundo} onChange={(e) => setApuestaFinalista(prev => ({ ...prev, segundo: e.target.value }))} disabled={apuestaFinalista.aceptada} className="w-28 text-center bg-slate-950 border-slate-800 text-white h-7 text-xs" /></div>
                  </div>
                </div>
                <div className="border-t border-slate-700/50 bg-slate-800/40 p-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">{apuestaFinalista.aceptada && <div className="flex items-center gap-1 bg-slate-900/50 px-1.5 py-0.5 rounded-md"><span>🏆</span><span className="text-[10px] text-white">Finalistas</span><span className="text-[10px] text-yellow-400">1 🏆</span></div>}</div>
                    <div className="flex gap-1.5">
                      <button onClick={() => { if (!apuestaFinalista.primero || !apuestaFinalista.segundo) return; setApuestaFinalista(prev => ({ ...prev, aceptada: true })); }} disabled={apuestaFinalista.aceptada || !apuestaFinalista.primero || !apuestaFinalista.segundo} className="h-6 px-2 text-[0.55rem] font-bold rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"><CheckCircle className="h-2.5 w-2.5 inline mr-0.5" /> Aceptar</button>
                      <button onClick={() => setApuestaFinalista(prev => ({ ...prev, aceptada: false }))} disabled={!apuestaFinalista.aceptada} className="h-6 px-2 text-[0.55rem] font-bold rounded-md bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><Edit className="h-2.5 w-2.5 inline mr-0.5" /> Editar</button>
                    </div>
                  </div>
                  {apuestaFinalista.aceptada && <div className="text-center text-emerald-400 text-[0.5rem] mt-0.5">✓ Apuesta registrada: {apuestaFinalista.primero} vs {apuestaFinalista.segundo}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Partidos */}
          {partidos.map((partido) => {
            const apuesta = apuestas[partido.id] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
            const tipo = getTipoApuesta(apuesta)
            const estado = obtenerEstadoPartido(partido)
            const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
            const bloqueada = estado.bloqueado || apuesta.aceptada

            return (
              <div key={partido.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-md">
                {/* Cabecera */}
                <div className="p-1.5 bg-slate-950/40 border-b border-slate-800">
                  <div className="text-center font-black text-sky-400 text-[11px]">
                    {partido.banderaLocal} {partido.local} <span className="text-yellow-600 mx-1">VS</span> {partido.visitante} {partido.banderaVisitante}
                  </div>
                  <div className="text-center text-[9px] text-slate-500">Grupo {partido.grupo}</div>
                </div>

                {/* Info */}
                <div className="px-2 pt-1">
                  <div className="flex flex-wrap justify-center gap-2 text-[0.5rem] text-slate-400">
                    <span><Calendar className="h-2.5 w-2.5 inline" /> {partido.fecha}</span>
                    <span><Clock className="h-2.5 w-2.5 inline" /> {partido.horaLocal} ET</span>
                    <span><MapPin className="h-2.5 w-2.5 inline" /> {partido.estadio}</span>
                  </div>
                </div>

                {/* Resultado real si existe */}
                {(partido.jugado && !partido.autoMarcado) && (
                  <div className="text-center mt-1">
                    <span className="text-sm font-black text-yellow-500">{partido.golesLocal} - {partido.golesVisitante}</span>
                  </div>
                )}

                {/* 2da Apuesta: Resultado */}
                <div className="relative mt-1">
                  <div className="bg-slate-800/30 rounded-r-lg rounded-l-none overflow-hidden mx-2">
                    <div className="pt-1 px-2">
                      <span className="text-[0.55rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                        <TrendingUp className="h-2.5 w-2.5" /> 2da. Apuesta: Resultado
                      </span>
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full opacity-70"></div>
                    <div className="pl-2">
                      <div className="p-2">
                        <div className="grid grid-cols-3 gap-2 text-center max-w-xs mx-auto">
                          <div className="flex flex-col items-center">
                            <span className="text-[0.45rem] font-bold text-green-400 uppercase mb-0.5">LOCAL</span>
                            <button onClick={() => estamparSello(partido.id, "L")} disabled={bloqueada} className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all hover:scale-105 disabled:opacity-50 bg-slate-950">
                              {apuesta.L ? "🌍" : "🌐"}
                            </button>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[0.45rem] font-bold text-yellow-400 uppercase mb-0.5">EMPATE</span>
                            <button onClick={() => estamparSello(partido.id, "E")} disabled={bloqueada} className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all hover:scale-105 disabled:opacity-50 bg-slate-950">
                              {apuesta.E ? "🌍" : "🌐"}
                            </button>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[0.45rem] font-bold text-blue-400 uppercase mb-0.5">VISITA</span>
                            <button onClick={() => estamparSello(partido.id, "V")} disabled={bloqueada} className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all hover:scale-105 disabled:opacity-50 bg-slate-950">
                              {apuesta.V ? "🌍" : "🌐"}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-slate-700/50 bg-slate-800/40 p-1.5">
                        <div className="flex justify-between items-center flex-wrap gap-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-0.5 text-slate-400 text-[0.5rem]"><div className={`w-1.5 h-1.5 rounded-full ${estado.color}`}></div>{estado.mensaje}</div>
                            {seleccionadas > 0 && !apuesta.aceptada && !bloqueada && <div className="flex items-center gap-1 bg-slate-900/50 px-1.5 py-0.5 rounded-md mt-0.5"><span className="text-[0.6rem]">{tipo.icono}</span><span className="text-[10px] text-white">{tipo.texto}</span><span className="text-[10px] text-yellow-400">{tipo.costo} ⚽️</span></div>}
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => aceptarApuesta(partido.id)} disabled={bloqueada || seleccionadas === 0} className="h-6 px-2 text-[0.55rem] font-bold rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"><CheckCircle className="h-2.5 w-2.5 inline mr-0.5" /> Aceptar</button>
                            <button onClick={() => editarApuesta(partido.id)} disabled={!apuesta.aceptada || bloqueada} className="h-6 px-2 text-[0.55rem] font-bold rounded-md bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><Edit className="h-2.5 w-2.5 inline mr-0.5" /> Editar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3ra Apuesta: Marcador */}
                <div className="bg-slate-950/50 rounded-md border border-slate-800 mx-2 mt-1 mb-2">
                  <div className="border-b border-slate-800/80 p-1 text-center">
                    <span className="text-[0.55rem] font-black tracking-widest uppercase text-yellow-500">🎯 3ra. Apuesta: Marcador (1 ⚽️)</span>
                  </div>
                  <div className="p-2">
                    <div className="flex justify-center gap-2 max-w-xs mx-auto">
                      <div className="text-center"><label className="text-[0.45rem] font-bold text-green-400 block">{partido.local.split(' ')[0]}</label><Input type="text" maxLength={2} placeholder="0" value={apuesta.golesLocal} onChange={(e) => handleGoles(partido.id, "golesLocal", e.target.value)} disabled={bloqueada} className="w-10 h-7 text-center bg-slate-950 border-slate-800 text-white text-xs disabled:opacity-50" /></div>
                      <div className="text-slate-600 font-bold text-[0.65rem]">X</div>
                      <div className="text-center"><label className="text-[0.45rem] font-bold text-blue-400 block">{partido.visitante.split(' ')[0]}</label><Input type="text" maxLength={2} placeholder="0" value={apuesta.golesVisita} onChange={(e) => handleGoles(partido.id, "golesVisita", e.target.value)} disabled={bloqueada} className="w-10 h-7 text-center bg-slate-950 border-slate-800 text-white text-xs disabled:opacity-50" /></div>
                    </div>
                  </div>
                  <div className="border-t border-slate-700/50 bg-slate-800/40 p-1.5">
                    <div className="flex justify-between items-center gap-1 flex-wrap">
                      <div className="flex-1"><div className="flex items-center gap-0.5 text-slate-400 text-[0.5rem]"><div className={`w-1.5 h-1.5 rounded-full ${estado.color}`}></div>{estado.mensaje}</div></div>
                      <div className="flex gap-1">
                        <button onClick={() => aceptarApuesta(partido.id)} disabled={bloqueada || (apuesta.golesLocal === "" && apuesta.golesVisita === "")} className="h-6 px-2 text-[0.55rem] font-bold rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"><CheckCircle className="h-2.5 w-2.5 inline mr-0.5" /> Aceptar</button>
                        <button onClick={() => editarApuesta(partido.id)} disabled={!apuesta.aceptada || bloqueada} className="h-6 px-2 text-[0.55rem] font-bold rounded-md bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><Edit className="h-2.5 w-2.5 inline mr-0.5" /> Editar</button>
                      </div>
                    </div>
                    {apuesta.aceptada && (apuesta.golesLocal !== "" || apuesta.golesVisita !== "") && <div className="text-center text-emerald-400 text-[0.45rem] mt-0.5">✓ Marcador registrado: {apuesta.golesLocal || "0"} - {apuesta.golesVisita || "0"}</div>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Botón flotante de resumen */}
      {totalApuestas > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button onClick={() => setMostrarModalResumen(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold gap-2 px-4 py-2 text-sm shadow-2xl rounded-full">
            <CheckCircle className="h-4 w-4" /> Validar Apuestas ({mostrarBalones(totalApuestas)})
          </Button>
        </div>
      )}

      <ModalResumen open={mostrarModalResumen} onClose={() => setMostrarModalResumen(false)} total={totalApuestas} />
      <ModalReglas open={mostrarReglas} onClose={() => setMostrarReglas(false)} />

      <footer className="py-4 text-center text-slate-500 text-[10px] border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Sistema de Balones ⚽️ | Medallas 🏵 | Copa 🏆</p>
      </footer>
    </div>
  )
}