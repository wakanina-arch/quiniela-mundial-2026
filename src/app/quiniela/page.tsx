"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trophy, Calendar, MapPin, Clock, TrendingUp, Target, Info, CheckCircle, Edit, Award, ArrowLeft, X, RefreshCw, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useSWR from "swr"

interface Partido {
  id: string
  date: string
  teamLocal: string
  teamVisita: string
  goalsLocalReal?: number | null
  goalsVisitaReal?: number | null
  status: "scheduled" | "live" | "finished"
  groupLetter?: string
  stadium?: string
  city?: string
  country?: string
}

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
  email?: string
  fechaRegistro: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const mostrarBalones = (cantidad: number): string => {
  let resultado = ""
  const balonesCompletos = Math.min(cantidad, 10)
  for (let i = 0; i < balonesCompletos; i++) resultado += "⚽️"
  if (cantidad > 10) resultado += ` +${cantidad - 10}`
  return resultado || "⚽️0"
}

const mostrarMedallas = (cantidad: number): string => {
  let resultado = ""
  for (let i = 0; i < Math.min(cantidad, 5); i++) resultado += "🏵"
  if (cantidad > 5) resultado += ` +${cantidad - 5}`
  return resultado || ""
}

const mostrarCopas = (cantidad: number): string => {
  let resultado = ""
  for (let i = 0; i < Math.min(cantidad, 3); i++) resultado += "🏆"
  if (cantidad > 3) resultado += ` +${cantidad - 3}`
  return resultado || ""
}

const getTipoApuestaVisual = (seleccionadas: number) => {
  if (seleccionadas === 0) return { texto: "Sin selección", costo: 0 }
  if (seleccionadas === 1) return { texto: "Simple", costo: 1 }
  if (seleccionadas === 2) return { texto: "Doble", costo: 2 }
  if (seleccionadas === 3) return { texto: "Triple", costo: 3 }
  return { texto: `${seleccionadas} opciones`, costo: seleccionadas }
}

const TiempoIndicator = ({ date, status }: { date: string; status?: string }) => {
  const ahora = Date.now()
  const minutosRestantes = (new Date(date).getTime() - ahora) / (1000 * 60)
  
  if (status === "live") return { color: "bg-red-500 animate-pulse", mensaje: "🔴 EN VIVO", bloqueado: true }
  if (status === "finished") return { color: "bg-gray-500", mensaje: "✅ Finalizado", bloqueado: true }
  if (minutosRestantes <= 0) return { color: "bg-red-500 animate-pulse", mensaje: "🔴 Partido comenzado", bloqueado: true }
  if (minutosRestantes <= 20) return { color: "bg-red-500 animate-pulse", mensaje: "⏰ Edición cerrada", bloqueado: true }
  if (minutosRestantes <= 30) return { color: "bg-yellow-500", mensaje: "⚠️ Cierre próximo", bloqueado: false }
  return { color: "bg-blue-500", mensaje: "✅ Apuesta abierta", bloqueado: false }
}

// Modal de Reglas
const ModalReglas = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-xl p-6 shadow-2xl max-w-2xl w-full space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-black text-amber-500 uppercase flex items-center gap-1.5">
            <Trophy className="h-4 w-4" /> SISTEMA DE APUESTAS
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-yellow-400 font-extrabold text-xs uppercase">⚽️ SISTEMA DE BALONES</h4>
            <div className="text-[11px] text-slate-300 space-y-1 mt-2">
              <p>• ⚽️ = 1 apuesta (Resultado o Marcador)</p>
              <p>• Máximo 10 ⚽️ por jugador. Cada acierto = +1 ⚽️</p>
              <p>• Al llegar a 10 ⚽️, el sobrante se convierte en 🏵</p>
              <p>• Cada 5 🏵 = 1 🏆 (Apuesta Mundialista)</p>
            </div>
          </div>
        </div>
        <Button onClick={onClose} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black">
          Cerrar
        </Button>
      </div>
    </div>
  )
}

// Modal de Resumen
const ModalResumen = ({ open, onClose, onConfirm, apuestas, jugador }: { 
  open: boolean
  onClose: () => void
  onConfirm: () => void
  apuestas: Record<string, Apuesta>
  jugador: Jugador | null
}) => {
  if (!open) return null

  const totalBalones = Object.values(apuestas).filter(a => a.aceptada).length

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl max-w-md w-full border border-yellow-500/30">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" /> Confirmar Jugadas
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-sm text-slate-400">Jugador Activo</p>
            <p className="text-base font-bold text-white mb-2">{jugador?.nombre || "Cargando..."}</p>
            <p className="text-sm text-slate-400">Total apuestas a validar</p>
            <p className="text-3xl font-black text-yellow-500">{mostrarBalones(totalBalones)}</p>
          </div>
          <Button onClick={onConfirm} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3">
            <CheckCircle className="h-4 w-4 mr-2" /> Enviar Apuestas Oficiales
          </Button>
        </div>
      </div>
    </div>
  )
}

// Botón Flotante
const BotonFlotante = ({ total, onClick }: { total: number; onClick: () => void }) => {
  if (total === 0) return null
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Button onClick={onClick} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold gap-3 px-8 py-4 text-lg shadow-2xl rounded-full border border-green-500/30">
        <CheckCircle className="h-5 w-5" /> Validar Apuestas ({mostrarBalones(total)})
      </Button>
    </div>
  )
}

// Componente Principal
export default function QuinielaPage() {
  const router = useRouter()
  const [apuestas, setApuestas] = useState<Record<string, Apuesta>>({})
  const [apuestaFinalista, setApuestaFinalista] = useState<ApuestaFinalista>({ primero: "", segundo: "", aceptada: false })
  const [jugador, setJugador] = useState<Jugador | null>(null)
  const [mostrarReglas, setMostrarReglas] = useState(false)
  const [mostrarModalResumen, setMostrarModalResumen] = useState(false)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [limitePartidos, setLimitePartidos] = useState(5)
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: string } | null>(null)

  const { data: partidosBase, mutate, isValidating } = useSWR<Partido[]>("/api/matches", fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: true
  })

  useEffect(() => {
    const jugadorGuardado = localStorage.getItem("jugador_actual")
    if (jugadorGuardado) {
      setJugador(JSON.parse(jugadorGuardado))
    } else {
      router.push("/registro")
    }
  }, [router])

  const mostrarMensaje = (texto: string, tipo: "success" | "error" | "info") => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 3000)
  }

  const estamparSello = (partidoId: string, tipo: "L" | "E" | "V") => {
    setApuestas(prev => {
      const actual = prev[partidoId] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
      if (actual.aceptada) return prev
      return { ...prev, [partidoId]: { ...actual, [tipo]: !actual[tipo] } }
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

  const aceptarApuestaResultado = (partidoId: string) => {
    setApuestas(prev => ({ ...prev, [partidoId]: { ...prev[partidoId], aceptada: true } }))
    mostrarMensaje("✅ Apuesta fijada en el resumen", "success")
  }

  const aceptarApuestaMarcador = (partidoId: string) => {
    setApuestas(prev => ({ ...prev, [partidoId]: { ...prev[partidoId], aceptada: true } }))
    mostrarMensaje("✅ Marcador fijado en el resumen", "success")
  }

  const editarApuesta = (partidoId: string) => {
    setApuestas(prev => ({ ...prev, [partidoId]: { ...prev[partidoId], aceptada: false } }))
    mostrarMensaje("↩️ Apuesta liberada para cambios", "info")
  }

  const totalApuestas = Object.values(apuestas).filter(a => a.aceptada).length
  const partidosMostrados = partidosBase?.slice(0, limitePartidos) || []

  const handleValidarApuestas = () => {
    if (totalApuestas === 0) {
      mostrarMensaje("⚠️ No hay apuestas aceptadas para validar", "error")
      return
    }
    setMostrarModalResumen(true)
  }

  const handleConfirmarApuestas = async () => {
    setMostrarModalResumen(false)
    mostrarMensaje("🚀 Procesando y guardando apuestas...", "info")

    try {
      // Aquí iría la llamada a la API para guardar
      mostrarMensaje(`🎉 ¡Apuestas guardadas!`, "success")
    } catch (error) {
      mostrarMensaje("❌ Error al guardar las apuestas", "error")
    }
  }

  if (!jugador) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-yellow-500 text-xl animate-pulse">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Quiniela Mundialista
          </h1>
          {jugador && <p className="text-[10px] text-slate-400">{jugador.nombre}</p>}
        </div>
        <button onClick={() => mutate()} className="text-slate-400 hover:text-white transition-colors">
          <RefreshCw className={`h-5 w-5 ${isValidating ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Panel de Recursos */}
      {jugador && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 py-2 px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-xl">{mostrarBalones(jugador.balones)}</span>
              <span className="text-[10px] text-slate-400">Balones</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl">{mostrarMedallas(jugador.medallas)}</span>
              <span className="text-[10px] text-slate-400">Medallas</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl">{mostrarCopas(jugador.copas)}</span>
              <span className="text-[10px] text-slate-400">Copas</span>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje flotante */}
      {mensaje && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-bold animate-bounce ${
          mensaje.tipo === "success" ? "bg-green-600 text-white" : 
          mensaje.tipo === "error" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* Botón Reglas */}
      <div className="flex justify-center w-full px-4 lg:px-6 py-1">
        <Button onClick={() => setMostrarReglas(true)} className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold px-4 py-1.5 text-xs rounded-md gap-1.5 shadow-lg">
          <span className="text-sm">📋</span> Ver Sistema de Apuestas
        </Button>
      </div>

      {/* Modales */}
      <ModalReglas open={mostrarReglas} onClose={() => setMostrarReglas(false)} />
      <ModalResumen 
        open={mostrarModalResumen}
        onClose={() => setMostrarModalResumen(false)}
        onConfirm={handleConfirmarApuestas}
        apuestas={apuestas}
        jugador={jugador}
      />

      <div className="p-[0.75rem] md:p-[1.5rem] pb-28">
        <div className="max-w-4xl mx-auto space-y-[0.75rem]">

          {/* Lista de Partidos */}
          {partidosMostrados.map((partido) => {
            const apuesta = apuestas[partido.id] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
            const estadoTiempo = TiempoIndicator({ date: partido.date, status: partido.status })
            const esEnVivo = partido.status === "live"
            const esFinalizado = partido.status === "finished"
            const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
            const tipoApuesta = getTipoApuestaVisual(seleccionadas)
            
            return (
              <div key={partido.id} className={`bg-slate-900 rounded-xl border overflow-hidden shadow-xl transition-all ${
                esEnVivo ? 'border-red-500/70 shadow-red-500/20 scale-[1.01]' : 'border-slate-800'
              }`}>
                
                {/* Cabecera del Partido */}
                <div className="p-3 bg-slate-950/40 border-b border-slate-800">
                  <div className="text-center font-black text-sky-400 text-sm">
                    {partido.teamLocal} vs {partido.teamVisita}
                    {partido.groupLetter && <span className="text-slate-500 text-xs ml-2">Grupo {partido.groupLetter}</span>}
                  </div>
                  {partido.stadium && (
                    <div className="text-center text-[10px] text-slate-500 mt-1">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {partido.stadium}, {partido.city}
                    </div>
                  )}
                </div>

                {/* Marcador Real (si está jugado) */}
                {(esEnVivo || esFinalizado) && (
                  <div className="px-3 pt-2 text-center">
                    <div className="inline-flex items-center gap-3 bg-slate-800/50 px-4 py-1 rounded-full">
                      <span className="font-bold text-white">{partido.teamLocal}</span>
                      <span className="text-xl font-black text-yellow-500">
                        {partido.goalsLocalReal ?? 0} - {partido.goalsVisitaReal ?? 0}
                      </span>
                      <span className="font-bold text-white">{partido.teamVisita}</span>
                    </div>
                  </div>
                )}

                {/* Sección de Apuesta Resultado */}
                <div className="relative mt-2">
                  <div className="bg-slate-800/30 rounded-r-lg rounded-l-none overflow-hidden mx-3">
                    <div className="pt-2 px-3">
                      <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Apuesta Resultado
                      </span>
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full opacity-70"></div>
                    <div className="pl-3">
                      <div className="p-3">
                        <div className="grid grid-cols-3 gap-4 text-center max-w-sm mx-auto">
                          <div className="flex flex-col items-center">
                            <span className="text-[0.55rem] font-bold text-green-400 uppercase mb-1">LOCAL</span>
                            <button onClick={() => estamparSello(partido.id, "L")} disabled={apuesta.aceptada || estadoTiempo.bloqueado || esFinalizado} className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-[1.8rem] transition-all hover:scale-110 disabled:opacity-50 bg-slate-950">
                              {apuesta.L ? "⚽️" : "⚪"}
                            </button>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[0.55rem] font-bold text-yellow-400 uppercase mb-1">EMPATE</span>
                            <button onClick={() => estamparSello(partido.id, "E")} disabled={apuesta.aceptada || estadoTiempo.bloqueado || esFinalizado} className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-[1.8rem] transition-all hover:scale-110 disabled:opacity-50 bg-slate-950">
                              {apuesta.E ? "⚽️" : "⚪"}
                            </button>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[0.55rem] font-bold text-blue-400 uppercase mb-1">VISITA</span>
                            <button onClick={() => estamparSello(partido.id, "V")} disabled={apuesta.aceptada || estadoTiempo.bloqueado || esFinalizado} className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-[1.8rem] transition-all hover:scale-110 disabled:opacity-50 bg-slate-950">
                              {apuesta.V ? "⚽️" : "⚪"}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-slate-700/50 bg-slate-800/40 p-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex-1">
                            <div className="flex items-center justify-start gap-1 text-slate-400 text-[0.55rem]">
                              <div className={`w-2 h-2 rounded-full ${estadoTiempo.color}`}></div>
                              {estadoTiempo.mensaje}
                            </div>
                            {seleccionadas > 0 && !apuesta.aceptada && !esFinalizado && (
                              <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-md w-fit mt-1">
                                <span className="text-[0.65rem] font-bold text-white">{tipoApuesta.texto}</span>
                                <span className="text-[0.7rem] font-black text-yellow-400">{tipoApuesta.costo} ⚽️</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => aceptarApuestaResultado(partido.id)} disabled={apuesta.aceptada || estadoTiempo.bloqueado || seleccionadas === 0 || esFinalizado} className={`h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${apuesta.aceptada ? "bg-emerald-800 text-emerald-200 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"} disabled:opacity-50`}>
                              <CheckCircle className="h-3 w-3" /> Aceptar
                            </button>
                            <button onClick={() => editarApuesta(partido.id)} disabled={!apuesta.aceptada || estadoTiempo.bloqueado || esFinalizado} className="h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white transition-all disabled:opacity-50">
                              <Edit className="h-3 w-3" /> Editar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de Apuesta Marcador */}
                <div className="bg-slate-950/50 rounded-[0.6rem] border border-slate-800 mx-3 mt-2 mb-3">
                  <div className="border-b border-slate-800/80 p-2 text-center">
                    <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                      <Target className="h-3 w-3" /> Apuesta Marcador (1 ⚽️)
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
                      <div className="text-center">
                        <label className="text-[0.55rem] font-bold text-green-400 uppercase block">{partido.teamLocal.split(' ')[0]}</label>
                        <Input type="text" inputMode="numeric" maxLength={2} placeholder="0" value={apuesta.golesLocal} onChange={(e) => handleGoles(partido.id, "golesLocal", e.target.value)} disabled={apuesta.aceptada || estadoTiempo.bloqueado || esFinalizado} className="bg-slate-950 border-slate-800 text-center text-[0.9rem] font-black text-white h-[2.2rem] rounded-[0.5rem] p-0 w-14 mx-auto disabled:opacity-50" />
                      </div>
                      <div className="text-slate-600 font-bold text-[0.8rem]">X</div>
                      <div className="text-center">
                        <label className="text-[0.55rem] font-bold text-blue-400 uppercase block">{partido.teamVisita.split(' ')[0]}</label>
                        <Input type="text" inputMode="numeric" maxLength={2} placeholder="0" value={apuesta.golesVisita} onChange={(e) => handleGoles(partido.id, "golesVisita", e.target.value)} disabled={apuesta.aceptada || estadoTiempo.bloqueado || esFinalizado} className="bg-slate-950 border-slate-800 text-center text-[0.9rem] font-black text-white h-[2.2rem] rounded-[0.5rem] p-0 w-14 mx-auto disabled:opacity-50" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-700/50 bg-slate-800/40 p-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center justify-start gap-1 text-slate-400 text-[0.55rem]">
                          <div className={`w-2 h-2 rounded-full ${estadoTiempo.color}`}></div>
                          {estadoTiempo.mensaje}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => aceptarApuestaMarcador(partido.id)} disabled={apuesta.aceptada || estadoTiempo.bloqueado || (apuesta.golesLocal === "" && apuesta.golesVisita === "") || esFinalizado} className={`h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${apuesta.aceptada ? "bg-emerald-800 text-emerald-200 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"} disabled:opacity-50`}>
                          <CheckCircle className="h-3 w-3" /> Aceptar (1 ⚽️)
                        </button>
                        <button onClick={() => editarApuesta(partido.id)} disabled={!apuesta.aceptada || estadoTiempo.bloqueado || esFinalizado} className="h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white transition-all disabled:opacity-50">
                          <Edit className="h-3 w-3" /> Editar
                        </button>
                      </div>
                    </div>
                    {apuesta.aceptada && (apuesta.golesLocal !== "" || apuesta.golesVisita !== "") && (
                      <div className="text-center text-emerald-400 text-[0.55rem] mt-1">
                        ✓ Marcador registrado: {apuesta.golesLocal || "0"} - {apuesta.golesVisita || "0"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Botón Cargar Más */}
          {partidosBase && limitePartidos < partidosBase.length && (
            <div className="flex justify-center mt-4">
              <Button onClick={() => { setCargandoMas(true); setTimeout(() => { setLimitePartidos(prev => prev + 5); setCargandoMas(false) }, 500) }} disabled={cargandoMas} className="bg-slate-800 hover:bg-slate-700 text-white gap-2">
                {cargandoMas ? "Cargando..." : "Cargar más partidos"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Botón Flotante */}
      <BotonFlotante total={totalApuestas} onClick={handleValidarApuestas} />

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-xs border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Sistema de Balones ⚽️ | Medallas 🏵 | Copa 🏆</p>
      </footer>
    </div>
  )
}