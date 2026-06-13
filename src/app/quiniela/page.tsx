"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trophy, Calendar, MapPin, Clock, TrendingUp, Target, Info, CheckCircle, Edit, Award, ArrowLeft, X, CreditCard, UserPlus, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Partido {
  id: string
  local: string
  visitante: string
  banderaLocal: string
  banderaVisitante: string
  fecha: string
  hora: string
  estadio: string
  ciudad: string
  pais: string
  grupo: string
  timestamp: number
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

// TODOS LOS PARTIDOS DE LA RONDA (para cargar dinámicamente)
const TODOS_LOS_PARTIDOS: Partido[] = [
  {
    id: "1", local: "Catar", visitante: "Suiza",
    banderaLocal: "🇶🇦", banderaVisitante: "🇨🇭",
    fecha: "2026-06-13", hora: "15:00", estadio: "Levi's Stadium", ciudad: "San Francisco", pais: "EEUU", grupo: "B",
    timestamp: new Date(2026, 5, 13, 15, 0).getTime()
  },
  {
    id: "2", local: "Brasil", visitante: "Marruecos",
    banderaLocal: "🇧🇷", banderaVisitante: "🇲🇦",
    fecha: "2026-06-13", hora: "18:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", grupo: "C",
    timestamp: new Date(2026, 5, 13, 18, 0).getTime()
  },
  {
    id: "3", local: "Haití", visitante: "Escocia",
    banderaLocal: "🇭🇹", banderaVisitante: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    fecha: "2026-06-13", hora: "21:00", estadio: "Gillette Stadium", ciudad: "Boston", pais: "EEUU", grupo: "C",
    timestamp: new Date(2026, 5, 13, 21, 0).getTime()
  },
  {
    id: "4", local: "Australia", visitante: "Turquía",
    banderaLocal: "🇦🇺", banderaVisitante: "🇹🇷",
    fecha: "2026-06-14", hora: "00:00", estadio: "BC Place", ciudad: "Vancouver", pais: "Canadá", grupo: "D",
    timestamp: new Date(2026, 5, 14, 0, 0).getTime()
  },
  {
    id: "5", local: "Alemania", visitante: "Ecuador",
    banderaLocal: "🇩🇪", banderaVisitante: "🇪🇨",
    fecha: "2026-06-14", hora: "12:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", grupo: "E",
    timestamp: new Date(2026, 5, 14, 12, 0).getTime()
  },
  {
    id: "6", local: "Países Bajos", visitante: "Japón",
    banderaLocal: "🇳🇱", banderaVisitante: "🇯🇵",
    fecha: "2026-06-14", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", grupo: "F",
    timestamp: new Date(2026, 5, 14, 15, 0).getTime()
  },
  {
    id: "7", local: "Costa de Marfil", visitante: "Ecuador",
    banderaLocal: "🇨🇮", banderaVisitante: "🇪🇨",
    fecha: "2026-06-14", hora: "19:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU", grupo: "E",
    timestamp: new Date(2026, 5, 14, 19, 0).getTime()
  }
]

// Partidos iniciales mostrados (los de hoy)
const PARTIDOS_INICIALES = TODOS_LOS_PARTIDOS.slice(0, 3)

const esPartidoHoy = (timestamp: number): boolean => {
  const hoy = new Date()
  const fechaPartido = new Date(timestamp)
  return hoy.toDateString() === fechaPartido.toDateString()
}

export default function QuinielaPage() {
  const router = useRouter()
  const [apuestas, setApuestas] = useState<Record<string, Apuesta>>({})
  const [apuestaFinalista, setApuestaFinalista] = useState<ApuestaFinalista>({ primero: "", segundo: "", aceptada: false })
  const [mostrarReglas, setMostrarReglas] = useState(false)
  const [mostrarModalResumen, setMostrarModalResumen] = useState(false)
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false)
  const [nombreRegistro, setNombreRegistro] = useState("")
  const [emailRegistro, setEmailRegistro] = useState("")
  const [errorRegistro, setErrorRegistro] = useState("")
  const [actualizando, setActualizando] = useState(false)
  const [partidosVisibles, setPartidosVisibles] = useState<Partido[]>(PARTIDOS_INICIALES)
  const [cargandoMas, setCargandoMas] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("quiniela_apuestas_v2")
    if (saved) {
      const data = JSON.parse(saved)
      setApuestas(data.resultado || {})
      setApuestaFinalista(data.finalista || { primero: "", segundo: "", aceptada: false })
    } else {
      const inicial: Record<string, Apuesta> = {}
      TODOS_LOS_PARTIDOS.forEach(p => { 
        inicial[p.id] = { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
      })
      setApuestas(inicial)
    }
  }, [])

  const guardarLocal = () => {
    const data = {
      resultado: apuestas,
      finalista: apuestaFinalista,
      fecha: new Date().toISOString()
    }
    localStorage.setItem("quiniela_apuestas_v2", JSON.stringify(data))
  }

  const actualizarDatos = () => {
    setActualizando(true)
    setTimeout(() => {
      guardarLocal()
      setActualizando(false)
    }, 500)
  }

  const cargarMasPartidos = () => {
    setCargandoMas(true)
    setTimeout(() => {
      setPartidosVisibles(TODOS_LOS_PARTIDOS)
      setCargandoMas(false)
    }, 500)
  }

  const estamparSello = (partidoId: string, tipo: "L" | "E" | "V") => {
    const apuesta = apuestas[partidoId]
    const partido = TODOS_LOS_PARTIDOS.find(p => p.id === partidoId)!
    const minutosRestantes = (partido.timestamp - Date.now()) / (1000 * 60)
    const bloqueado = minutosRestantes <= 20
    
    if (apuesta?.aceptada || bloqueado) {
      if (bloqueado) alert("⏰ Partido cerrado, no se pueden hacer cambios")
      return
    }

    setApuestas(prev => {
      const actual = prev[partidoId] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
      const nueva = { ...actual, [tipo]: !actual[tipo] }
      
      const seleccionadas = [nueva.L, nueva.E, nueva.V].filter(Boolean).length
      if (seleccionadas > 3) {
        alert("❌ Máximo 3 opciones por partido")
        return prev
      }
      
      guardarLocal()
      return { ...prev, [partidoId]: nueva }
    })
  }

  const getTipoApuesta = (apuesta: Apuesta) => {
    const count = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
    if (count === 0) return { texto: "", icono: "", costo: 0 }
    if (count === 1) return { texto: "Simple", icono: "🔴", costo: 0.50 }
    if (count === 2) return { texto: "Doble", icono: "🟡", costo: 1.00 }
    return { texto: "Triple", icono: "🔴", costo: 1.50 }
  }

  const handleGoles = (partidoId: string, campo: "golesLocal" | "golesVisita", valor: string) => {
    const apuesta = apuestas[partidoId]
    const partido = TODOS_LOS_PARTIDOS.find(p => p.id === partidoId)!
    const minutosRestantes = (partido.timestamp - Date.now()) / (1000 * 60)
    const bloqueado = minutosRestantes <= 20
    
    if (apuesta?.aceptada || bloqueado) return
    
    const limpio = valor.replace(/[^0-9]/g, "")
    setApuestas(prev => ({ 
      ...prev, 
      [partidoId]: { ...prev[partidoId], [campo]: limpio } 
    }))
    guardarLocal()
  }

  const aceptarApuestaResultado = (partidoId: string) => {
    const apuesta = apuestas[partidoId]
    const seleccionadas = [apuesta?.L, apuesta?.E, apuesta?.V].filter(Boolean).length
    const partido = TODOS_LOS_PARTIDOS.find(p => p.id === partidoId)!
    const minutosRestantes = (partido.timestamp - Date.now()) / (1000 * 60)
    const bloqueado = minutosRestantes <= 20
    
    if (bloqueado) {
      alert("⏰ No se puede aceptar: partido cerrado")
      return
    }
    
    if (seleccionadas === 0) {
      alert("⚠️ Debes seleccionar al menos una opción")
      return
    }

    setApuestas(prev => ({ 
      ...prev, 
      [partidoId]: { ...prev[partidoId], aceptada: true } 
    }))
    guardarLocal()
  }

  const aceptarApuestaMarcador = (partidoId: string) => {
    const apuesta = apuestas[partidoId]
    const tieneGoles = apuesta?.golesLocal !== "" || apuesta?.golesVisita !== ""
    const partido = TODOS_LOS_PARTIDOS.find(p => p.id === partidoId)!
    const minutosRestantes = (partido.timestamp - Date.now()) / (1000 * 60)
    const bloqueado = minutosRestantes <= 20
    
    if (bloqueado) {
      alert("⏰ No se puede aceptar: partido cerrado")
      return
    }
    
    if (!tieneGoles) {
      alert("⚠️ Debes ingresar un marcador")
      return
    }

    setApuestas(prev => ({ 
      ...prev, 
      [partidoId]: { ...prev[partidoId], aceptada: true } 
    }))
    guardarLocal()
  }

  const editarApuesta = (partidoId: string) => {
    const partido = TODOS_LOS_PARTIDOS.find(p => p.id === partidoId)!
    const minutosRestantes = (partido.timestamp - Date.now()) / (1000 * 60)
    const bloqueado = minutosRestantes <= 20
    
    if (bloqueado) {
      alert("❌ No se puede editar: partido cerrado")
      return
    }
    setApuestas(prev => ({ 
      ...prev, 
      [partidoId]: { ...prev[partidoId], aceptada: false } 
    }))
    guardarLocal()
  }

  const getTiempoEstado = (timestamp: number) => {
    const ahora = Date.now()
    const minutosRestantes = (timestamp - ahora) / (1000 * 60)
    
    if (minutosRestantes <= 0) return { color: "bg-red-500 animate-pulse", mensaje: "🔴 Partido comenzado", bloqueado: true }
    if (minutosRestantes <= 20) return { color: "bg-red-500 animate-pulse", mensaje: "⏰ Edición cerrada", bloqueado: true }
    if (minutosRestantes <= 30) return { color: "bg-yellow-500", mensaje: "⚠️ Cierre próximo", bloqueado: false }
    return { color: "bg-blue-500", mensaje: "✅ Apuesta abierta", bloqueado: false }
  }

  const TiempoIndicator = ({ timestamp }: { timestamp: number }) => {
    const estado = getTiempoEstado(timestamp)
    return (
      <div className="flex items-center justify-start gap-1 text-slate-400 text-[0.55rem]">
        <div className={`w-2 h-2 rounded-full ${estado.color}`}></div>
        {estado.mensaje}
      </div>
    )
  }

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
  }

  const calcularTotalApuestas = () => {
    let total = 0
    Object.values(apuestas).forEach(apuesta => {
      if (apuesta.aceptada) {
        const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
        total += seleccionadas * 0.50
        if (apuesta.golesLocal !== "" || apuesta.golesVisita !== "") total += 0.50
      }
    })
    if (apuestaFinalista.aceptada) total += 1.00
    return total
  }

  const generarNumeroJugador = () => {
    return Math.floor(Math.random() * 900000) + 100000
  }

  const handleRegistro = () => {
    if (!nombreRegistro.trim()) {
      setErrorRegistro("Ingresa tu nombre")
      return
    }
    if (!emailRegistro.trim() || !emailRegistro.includes("@")) {
      setErrorRegistro("Ingresa un email válido")
      return
    }
    
    const numeroJugador = generarNumeroJugador()
    const usuario = {
      id: Date.now(),
      nombre: nombreRegistro.trim(),
      email: emailRegistro.trim(),
      numeroJugador: numeroJugador,
      fechaRegistro: new Date().toISOString()
    }
    
    localStorage.setItem("quiniela_usuario", JSON.stringify(usuario))
    localStorage.setItem(`jugador_${numeroJugador}`, JSON.stringify(usuario))
    
    setMostrarModalRegistro(false)
    setMostrarModalResumen(true)
  }

  const handleValidarApuestas = () => {
    const total = calcularTotalApuestas()
    if (total === 0) {
      alert("⚠️ No hay apuestas aceptadas para validar")
      return
    }
    
    const usuarioExistente = localStorage.getItem("quiniela_usuario")
    if (usuarioExistente) {
      setMostrarModalResumen(true)
    } else {
      setMostrarModalRegistro(true)
    }
  }

  const handlePagar = () => {
    const total = calcularTotalApuestas()
    alert(`🚀 Preparando pago de ${total.toFixed(2)}€ con PayPal...`)
  }

  const totalApuestas = calcularTotalApuestas()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* HEADER */}
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Quiniela de Apuestas
        </h1>
        <button onClick={actualizarDatos} disabled={actualizando} className="text-slate-400 hover:text-white transition-colors">
          <RefreshCw className={`h-5 w-5 ${actualizando ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Botón Reglas */}
      <div className="flex justify-center w-full px-4 lg:px-6 py-1">
        <Button onClick={() => setMostrarReglas(true)} className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold px-4 py-1.5 text-xs rounded-md gap-1.5 shadow-lg">
          <span className="text-sm">📋</span> Ver Reglamento
        </Button>
      </div>

      {/* Modal Reglas */}
      {mostrarReglas && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-xl p-6 shadow-2xl max-w-2xl w-full space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-black text-amber-500 uppercase flex items-center gap-1.5">
                <Trophy className="h-4 w-4" /> REGLAMENTO OFICIAL
              </h2>
              <button onClick={() => setMostrarReglas(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                <h4 className="text-amber-400 font-extrabold text-xs uppercase">💰 ESTRUCTURA DE COSTOS</h4>
                <div className="text-[11px] text-slate-300 space-y-1 mt-2">
                  <p>• Simple (1 Opción): 0.50€</p>
                  <p>• Doble (2 Opciones): 1.00€</p>
                  <p>• Triple (3 Opciones): 1.50€</p>
                  <p>• Marcador Exacto: 0.50€</p>
                  <p>• Podio Finalistas: 1.00€</p>
                </div>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                <h4 className="text-emerald-400 font-extrabold text-xs uppercase">🏆 REPARTO DEL POZO (33% c/u)</h4>
                <div className="text-[11px] text-slate-300 space-y-1 mt-2">
                  <p>• 1er: Mayor puntuación acumulada</p>
                  <p>• 2do: Mayor cantidad de goles exactos</p>
                  <p>• 3er: Campeón y Subcampeón exactos</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setMostrarReglas(false)} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black">
              Cerrar
            </Button>
          </div>
        </div>
      )}

      {/* Modal Resumen - Maradona #10 */}
      {mostrarModalResumen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl max-w-md w-full border border-yellow-500/30">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Maradona # 10
              </h2>
              <button onClick={() => setMostrarModalResumen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Object.entries(apuestas).map(([id, apuesta]) => {
                  if (!apuesta.aceptada) return null
                  const partido = TODOS_LOS_PARTIDOS.find(p => p.id === id)
                  if (!partido) return null
                  const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
                  const costo = seleccionadas * 0.50 + (apuesta.golesLocal !== "" || apuesta.golesVisita !== "" ? 0.50 : 0)
                  return (
                    <div key={id} className="bg-slate-800/50 rounded-lg p-2 text-sm">
                      <p className="text-slate-300">{partido.local} vs {partido.visitante}</p>
                      <p className="text-xs text-yellow-400">{costo.toFixed(2)}€</p>
                    </div>
                  )
                })}
                {apuestaFinalista.aceptada && (
                  <div className="bg-slate-800/50 rounded-lg p-2 text-sm">
                    <p className="text-slate-300">Finalistas: {apuestaFinalista.primero} vs {apuestaFinalista.segundo}</p>
                    <p className="text-xs text-yellow-400">1.00€</p>
                  </div>
                )}
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">Total a pagar</p>
                <p className="text-3xl font-black text-yellow-500">{totalApuestas.toFixed(2)}€</p>
              </div>
              <Button onClick={handlePagar} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">
                <CreditCard className="h-4 w-4 mr-2" />
                Pagar con PayPal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registro */}
      {mostrarModalRegistro && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl max-w-md w-full border border-yellow-500/30">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-yellow-500" />
                Registro de Participante
              </h2>
              <button onClick={() => setMostrarModalRegistro(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Nombre completo</label>
                <Input type="text" placeholder="Ej. Edgar Jara" value={nombreRegistro} onChange={(e) => setNombreRegistro(e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Correo electrónico</label>
                <Input type="email" placeholder="ejemplo@correo.com" value={emailRegistro} onChange={(e) => setEmailRegistro(e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              {errorRegistro && <p className="text-red-400 text-sm">{errorRegistro}</p>}
              <Button onClick={handleRegistro} className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold">
                Registrarse y Continuar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-[0.75rem] md:p-[1.5rem] pb-28">
        <div className="max-w-4xl mx-auto space-y-[0.75rem]">

          {/* ========== 1ra APUESTA: FINALISTAS DE COPA ========== */}
          <div className="relative">
            <div className="bg-slate-800/30 rounded-r-lg rounded-l-none overflow-hidden">
              <div className="pt-2 px-3">
                <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                  <Award className="h-3 w-3" /> 1ra. Apuesta: Finalistas de Copa (1.00€)
                </span>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full opacity-70"></div>
              <div className="pl-3">
                <div className="p-3">
                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    <div className="text-center">
                      <span className="text-[0.55rem] font-bold text-green-400 uppercase block mb-2">🏆 CAMPEÓN</span>
                      <Input type="text" placeholder="Ej. Brasil" value={apuestaFinalista.primero} onChange={(e) => setApuestaFinalista(prev => ({ ...prev, primero: e.target.value }))} disabled={apuestaFinalista.aceptada} className="w-36 text-center bg-slate-950 border-slate-800 text-white h-[2.2rem] rounded-[0.5rem] text-sm disabled:opacity-50" />
                    </div>
                    <div className="text-center">
                      <span className="text-[0.55rem] font-bold text-blue-400 uppercase block mb-2">🥈 SUBCAMPEÓN</span>
                      <Input type="text" placeholder="Ej. Argentina" value={apuestaFinalista.segundo} onChange={(e) => setApuestaFinalista(prev => ({ ...prev, segundo: e.target.value }))} disabled={apuestaFinalista.aceptada} className="w-36 text-center bg-slate-950 border-slate-800 text-white h-[2.2rem] rounded-[0.5rem] text-sm disabled:opacity-50" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700/50 bg-slate-800/40 p-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center justify-start gap-1 text-slate-400 text-[0.55rem]">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        ✅ Apuesta abierta (válida hasta el inicio del Mundial)
                      </div>
                      {apuestaFinalista.aceptada && (
                        <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-md w-fit mt-1">
                          <span className="text-base">🏆</span>
                          <span className="text-[0.65rem] font-bold text-white">Finalistas</span>
                          <span className="text-[0.7rem] font-black text-yellow-400">1.00€</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        if (!apuestaFinalista.primero || !apuestaFinalista.segundo) {
                          alert("⚠️ Debes escribir un CAMPEÓN y un SUBCAMPEÓN")
                          return
                        }
                        setApuestaFinalista(prev => ({ ...prev, aceptada: true }))
                        guardarLocal()
                      }} disabled={apuestaFinalista.aceptada || !apuestaFinalista.primero || !apuestaFinalista.segundo} className={`h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${apuestaFinalista.aceptada ? "bg-emerald-800 text-emerald-200 cursor-not-allowed opacity-70" : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"} disabled:opacity-50`}>
                        <CheckCircle className="h-3 w-3" /> Aceptar
                      </button>
                      <button onClick={() => setApuestaFinalista(prev => ({ ...prev, aceptada: false }))} disabled={!apuestaFinalista.aceptada} className="h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white transition-all disabled:opacity-50">
                        <Edit className="h-3 w-3" /> Editar
                      </button>
                    </div>
                  </div>
                  {apuestaFinalista.aceptada && (
                    <div className="text-center text-emerald-400 text-[0.55rem] mt-1">
                      ✓ Apuesta registrada: {apuestaFinalista.primero} vs {apuestaFinalista.segundo}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========== LISTA DE PARTIDOS ========== */}
          <div className="space-y-4">
            {partidosVisibles.map((partido) => {
              const apuesta = apuestas[partido.id] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
              const tipo = getTipoApuesta(apuesta)
              const aceptada = apuesta.aceptada
              const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
              const estadoTiempo = getTiempoEstado(partido.timestamp)
              const esHoy = esPartidoHoy(partido.timestamp)
              
              return (
                <div key={partido.id} className={`bg-slate-900 rounded-xl border overflow-hidden shadow-xl transition-all ${esHoy ? 'border-yellow-500/50 scale-[1.01]' : 'border-slate-800'}`}>
                  
                  {/* Cabecera del partido */}
                  <div className="p-3 bg-slate-950/40 border-b border-slate-800">
                    <div className="text-center font-black text-sky-400 text-sm">
                      {partido.banderaLocal} {partido.local} <span className="text-yellow-600 mx-2">VS</span> {partido.visitante} {partido.banderaVisitante}
                    </div>
                    {esHoy && (
                      <div className="text-center text-[9px] text-yellow-500 mt-0.5 font-bold">
                        ⭐ PARTIDO ESTELAR DEL DÍA
                      </div>
                    )}
                  </div>

                  {/* Info del partido */}
                  <div className="px-3 pt-2">
                    <div className="flex flex-wrap justify-center gap-3 text-[0.55rem] text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatearFecha(partido.fecha)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {partido.hora} ET</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {partido.estadio}</span>
                      <span className="text-slate-600">•</span>
                      <span>{partido.ciudad}</span>
                      <span className="text-slate-600">•</span>
                      <span>{partido.pais}</span>
                      <span className="text-slate-600">•</span>
                      <span>Grupo {partido.grupo}</span>
                    </div>
                  </div>

                  {/* ========== 2da APUESTA: RESULTADO (3 opciones) ========== */}
                  <div className="relative mt-2">
                    <div className="bg-slate-800/30 rounded-r-lg rounded-l-none overflow-hidden mx-3">
                      <div className="pt-2 px-3">
                        <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                          <TrendingUp className="h-3 w-3" /> 2da. Apuesta: Resultado
                        </span>
                      </div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full opacity-70"></div>
                      <div className="pl-3">
                        <div className="p-3">
                          <div className="grid grid-cols-3 gap-4 text-center max-w-sm mx-auto">
                            <div className="flex flex-col items-center">
                              <span className="text-[0.55rem] font-bold text-green-400 uppercase mb-1">LOCAL</span>
                              <button onClick={() => estamparSello(partido.id, "L")} disabled={aceptada || estadoTiempo.bloqueado} className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-[1.8rem] transition-all hover:scale-110 disabled:opacity-50 bg-slate-950">
                                {apuesta.L ? "🌍" : "🌐"}
                              </button>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[0.55rem] font-bold text-yellow-400 uppercase mb-1">EMPATE</span>
                              <button onClick={() => estamparSello(partido.id, "E")} disabled={aceptada || estadoTiempo.bloqueado} className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-[1.8rem] transition-all hover:scale-110 disabled:opacity-50 bg-slate-950">
                                {apuesta.E ? "🌍" : "🌐"}
                              </button>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[0.55rem] font-bold text-blue-400 uppercase mb-1">VISITA</span>
                              <button onClick={() => estamparSello(partido.id, "V")} disabled={aceptada || estadoTiempo.bloqueado} className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-[1.8rem] transition-all hover:scale-110 disabled:opacity-50 bg-slate-950">
                                {apuesta.V ? "🌍" : "🌐"}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-slate-700/50 bg-slate-800/40 p-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex-1">
                              <TiempoIndicator timestamp={partido.timestamp} />
                              {seleccionadas > 0 && !estadoTiempo.bloqueado && !aceptada && (
                                <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-md w-fit mt-1">
                                  <span className="text-base">{tipo.icono}</span>
                                  <span className="text-[0.65rem] font-bold text-white">{tipo.texto}</span>
                                  <span className="text-[0.7rem] font-black text-yellow-400">{tipo.costo.toFixed(2)}€</span>
                                </div>
                              )}
                              {aceptada && (
                                <div className="flex items-center gap-2 bg-emerald-900/50 px-2 py-1 rounded-md w-fit mt-1">
                                  <span className="text-base">✓</span>
                                  <span className="text-[0.65rem] font-bold text-emerald-400">Apuesta registrada</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => aceptarApuestaResultado(partido.id)} disabled={aceptada || estadoTiempo.bloqueado || seleccionadas === 0} className={`h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${aceptada ? "bg-emerald-800 text-emerald-200 cursor-not-allowed opacity-70" : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"} disabled:opacity-50`}>
                                <CheckCircle className="h-3 w-3" /> Aceptar
                              </button>
                              <button onClick={() => editarApuesta(partido.id)} disabled={!aceptada || estadoTiempo.bloqueado} className="h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white transition-all disabled:opacity-50">
                                <Edit className="h-3 w-3" /> Editar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========== 3ra APUESTA: MARCADOR (con botones Aceptar/Editar) ========== */}
                  <div className="bg-slate-950/50 rounded-[0.6rem] border border-slate-800 mx-3 mt-2 mb-3">
                    <div className="border-b border-slate-800/80 p-2 text-center">
                      <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                        <Target className="h-3 w-3" /> 3ra. Apuesta: Marcador (0.50€)
                      </span>
                    </div>
                    
                    <div className="p-3">
                      <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
                        <div className="text-center">
                          <label className="text-[0.55rem] font-bold text-green-400 uppercase block">{partido.local.split(' ')[0]}</label>
                          <Input type="text" inputMode="numeric" maxLength={2} placeholder="0" value={apuesta.golesLocal} onChange={(e) => handleGoles(partido.id, "golesLocal", e.target.value)} disabled={aceptada || estadoTiempo.bloqueado} className="bg-slate-950 border-slate-800 text-center text-[0.9rem] font-black text-white h-[2.2rem] rounded-[0.5rem] p-0 w-14 mx-auto disabled:opacity-50" />
                        </div>
                        <div className="text-slate-600 font-bold text-[0.8rem]">X</div>
                        <div className="text-center">
                          <label className="text-[0.55rem] font-bold text-blue-400 uppercase block">{partido.visitante.split(' ')[0]}</label>
                          <Input type="text" inputMode="numeric" maxLength={2} placeholder="0" value={apuesta.golesVisita} onChange={(e) => handleGoles(partido.id, "golesVisita", e.target.value)} disabled={aceptada || estadoTiempo.bloqueado} className="bg-slate-950 border-slate-800 text-center text-[0.9rem] font-black text-white h-[2.2rem] rounded-[0.5rem] p-0 w-14 mx-auto disabled:opacity-50" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-700/50 bg-slate-800/40 p-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex-1">
                          <TiempoIndicator timestamp={partido.timestamp} />
                          {(apuesta.golesLocal !== "" || apuesta.golesVisita !== "") && !estadoTiempo.bloqueado && !aceptada && (
                            <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-md w-fit mt-1">
                              <span className="text-base">⚽</span>
                              <span className="text-[0.65rem] font-bold text-white">Marcador</span>
                              <span className="text-[0.7rem] font-black text-yellow-400">0.50€</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => aceptarApuestaMarcador(partido.id)} disabled={aceptada || estadoTiempo.bloqueado || (apuesta.golesLocal === "" && apuesta.golesVisita === "")} className={`h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${aceptada ? "bg-emerald-800 text-emerald-200 cursor-not-allowed opacity-70" : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"} disabled:opacity-50`}>
                            <CheckCircle className="h-3 w-3" /> Aceptar
                          </button>
                          <button onClick={() => editarApuesta(partido.id)} disabled={!aceptada || estadoTiempo.bloqueado} className="h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white transition-all disabled:opacity-50">
                            <Edit className="h-3 w-3" /> Editar
                          </button>
                        </div>
                      </div>
                      {aceptada && (apuesta.golesLocal !== "" || apuesta.golesVisita !== "") && (
                        <div className="text-center text-emerald-400 text-[0.55rem] mt-1">
                          ✓ Marcador registrado: {apuesta.golesLocal || "0"} - {apuesta.golesVisita || "0"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Botón para cargar más partidos */}
          {partidosVisibles.length < TODOS_LOS_PARTIDOS.length && (
            <div className="flex justify-center mt-4">
              <Button onClick={cargarMasPartidos} disabled={cargandoMas} className="bg-slate-800 hover:bg-slate-700 text-white gap-2">
                {cargandoMas ? "Cargando..." : "Cargar más partidos"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* BOTÓN FLOTANTE */}
      {totalApuestas > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button onClick={handleValidarApuestas} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold gap-3 px-8 py-4 text-lg shadow-2xl rounded-full border border-green-500/30">
            <CheckCircle className="h-5 w-5" />
            Validar Apuestas ({totalApuestas.toFixed(2)}€)
          </Button>
        </div>
      )}
    </div>
  )
}
