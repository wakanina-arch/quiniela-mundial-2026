"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trophy, Calendar, MapPin, Clock, TrendingUp, Target, Info, CheckCircle, Edit, Award, ArrowLeft, X, UserPlus, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useSWR from "swr"

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
  golesLocalReal?: number
  golesVisitanteReal?: number
  estado?: "scheduled" | "live" | "finished"
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

// Zonas horarias por ciudad
const getTimeZone = (ciudad: string): string => {
  const zonas: Record<string, string> = {
    "Los Ángeles": "America/Los_Angeles",
    "San Francisco": "America/Los_Angeles",
    "Seattle": "America/Los_Angeles",
    "Denver": "America/Denver",
    "Dallas": "America/Chicago",
    "Houston": "America/Chicago",
    "Chicago": "America/Chicago",
    "New Jersey": "America/New_York",
    "Boston": "America/New_York",
    "Philadelphia": "America/New_York",
    "Atlanta": "America/New_York",
    "Miami": "America/New_York",
    "East Rutherford": "America/New_York",
    "Toronto": "America/Toronto",
    "Vancouver": "America/Vancouver",
    "CDMX": "America/Mexico_City",
    "Ciudad de México": "America/Mexico_City",
    "Guadalajara": "America/Mexico_City",
    "Monterrey": "America/Mexico_City"
  }
  return zonas[ciudad] || "America/New_York"
}

const formatearHoraConZona = (timestamp: number, ciudad: string): string => {
  const fechaUTC = new Date(timestamp)
  const zonaEstadio = getTimeZone(ciudad)
  const zonaUsuario = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  const horaEstadio = new Intl.DateTimeFormat('es-ES', {
    timeZone: zonaEstadio,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(fechaUTC)
  
  const abrevZonaEstadio = zonaEstadio.split('/').pop() || "ET"
  const abrevMap: Record<string, string> = {
    "Los_Angeles": "PT", "Denver": "MT", "Chicago": "CT",
    "New_York": "ET", "Toronto": "ET", "Vancouver": "PT",
    "Mexico_City": "CT"
  }
  const abreviatura = abrevMap[abrevZonaEstadio] || "ET"
  
  if (zonaUsuario === zonaEstadio) {
    return `${horaEstadio} ${abreviatura}`
  }
  
  const horaUsuario = new Intl.DateTimeFormat('es-ES', {
    timeZone: zonaUsuario,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(fechaUTC)
  
  const zonaUsuarioAbrev = zonaUsuario.includes("Madrid") ? "CET" : 
                           zonaUsuario.includes("London") ? "GMT" :
                           zonaUsuario.includes("Berlin") ? "CET" : "Local"
  
  return `${horaUsuario} ${zonaUsuarioAbrev} (${horaEstadio} ${abreviatura})`
}

// TODOS LOS PARTIDOS
const TODOS_LOS_PARTIDOS: Partido[] = [
  {
    id: "1", local: "Catar", visitante: "Suiza",
    banderaLocal: "🇶🇦", banderaVisitante: "🇨🇭",
    fecha: "2026-06-13", hora: "15:00", estadio: "Levi's Stadium", ciudad: "San Francisco", pais: "EEUU", grupo: "B",
    timestamp: new Date(Date.UTC(2026, 5, 13, 22, 0)).getTime(),
    estado: "finished"
  },
  {
    id: "2", local: "Brasil", visitante: "Marruecos",
    banderaLocal: "🇧🇷", banderaVisitante: "🇲🇦",
    fecha: "2026-06-13", hora: "18:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", grupo: "C",
    timestamp: new Date(Date.UTC(2026, 5, 13, 22, 0)).getTime(),
    estado: "finished"
  },
  {
    id: "3", local: "Alemania", visitante: "Ecuador",
    banderaLocal: "🇩🇪", banderaVisitante: "🇪🇨",
    fecha: "2026-06-14", hora: "12:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", grupo: "E",
    timestamp: new Date(2026, 5, 14, 12, 0).getTime(),
    estado: "live"
  },
  {
    id: "4", local: "Países Bajos", visitante: "Japón",
    banderaLocal: "🇳🇱", banderaVisitante: "🇯🇵",
    fecha: "2026-06-14", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", grupo: "F",
    timestamp: new Date(2026, 5, 14, 15, 0).getTime(),
    estado: "scheduled"
  },
  {
    id: "5", local: "México", visitante: "Corea del Sur",
    banderaLocal: "🇲🇽", banderaVisitante: "🇰🇷",
    fecha: "2026-06-15", hora: "18:00", estadio: "Estadio Azteca", ciudad: "CDMX", pais: "México", grupo: "A",
    timestamp: new Date(2026, 5, 15, 18, 0).getTime(),
    estado: "scheduled"
  },
  {
    id: "6", local: "Argentina", visitante: "Francia",
    banderaLocal: "🇦🇷", banderaVisitante: "🇫🇷",
    fecha: "2026-06-16", hora: "20:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", grupo: "J",
    timestamp: new Date(2026, 5, 16, 20, 0).getTime(),
    estado: "scheduled"
  }
]

const PARTIDOS_INICIALES = [...TODOS_LOS_PARTIDOS].sort((a, b) => a.timestamp - b.timestamp)

// Función para mostrar balones visualmente
const mostrarBalones = (cantidad: number): string => {
  let resultado = ""
  const balonesCompletos = Math.min(cantidad, 10)
  for (let i = 0; i < balonesCompletos; i++) {
    resultado += "⚽️"
  }
  if (cantidad > 10) {
    resultado += ` +${cantidad - 10}`
  }
  return resultado || "⚽️0"
}

const mostrarMedallas = (cantidad: number): string => {
  let resultado = ""
  for (let i = 0; i < Math.min(cantidad, 5); i++) {
    resultado += "🏵"
  }
  if (cantidad > 5) {
    resultado += ` +${cantidad - 5}`
  }
  return resultado || ""
}

const mostrarCopas = (cantidad: number): string => {
  let resultado = ""
  for (let i = 0; i < Math.min(cantidad, 3); i++) {
    resultado += "🏆"
  }
  if (cantidad > 3) {
    resultado += ` +${cantidad - 3}`
  }
  return resultado || ""
}

// Función para obtener el tipo de apuesta visual
const getTipoApuestaVisual = (seleccionadas: number) => {
  if (seleccionadas === 0) return { texto: "Sin selección", costo: 0 }
  if (seleccionadas === 1) return { texto: "Simple", costo: 1 }
  if (seleccionadas === 2) return { texto: "Doble", costo: 2 }
  if (seleccionadas === 3) return { texto: "Triple", costo: 3 }
  return { texto: `${seleccionadas} opciones`, costo: seleccionadas }
}

// Función para filtrar partidos futuros y de hoy
const filtrarPartidosFuturosYHoy = (partidos: Partido[]): Partido[] => {
  const ahora = new Date()
  return partidos.filter(partido => {
    const fechaPartido = new Date(partido.timestamp)
    return fechaPartido >= ahora && partido.estado !== "finished"
  })
}

const esPartidoHoy = (timestamp: number): boolean => {
  const hoy = new Date()
  const fechaPartido = new Date(timestamp)
  return hoy.toDateString() === fechaPartido.toDateString()
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const TiempoIndicator = ({ timestamp, estado }: { timestamp: number; estado?: string }) => {
  const ahora = Date.now()
  const minutosRestantes = (timestamp - ahora) / (1000 * 60)
  
  if (estado === "live") return { color: "bg-red-500 animate-pulse", mensaje: "🔴 EN VIVO", bloqueado: true }
  if (estado === "finished") return { color: "bg-gray-500", mensaje: "✅ Finalizado", bloqueado: true }
  if (minutosRestantes <= 0) return { color: "bg-red-500 animate-pulse", mensaje: "🔴 Partido comenzado", bloqueado: true }
  if (minutosRestantes <= 20) return { color: "bg-red-500 animate-pulse", mensaje: "⏰ Edición cerrada", bloqueado: true }
  if (minutosRestantes <= 30) return { color: "bg-yellow-500", mensaje: "⚠️ Cierre próximo", bloqueado: false }
  return { color: "bg-blue-500", mensaje: "✅ Apuesta abierta", bloqueado: false }
}

// Componente Modal de Registro
const ModalRegistro = ({ open, onClose, onRegister }: { open: boolean; onClose: () => void; onRegister: (nombre: string, email: string) => void }) => {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  if (!open) return null

  const handleSubmit = () => {
    if (!nombre.trim()) {
      setError("Ingresa tu nombre")
      return
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Ingresa un email válido")
      return
    }
    onRegister(nombre, email)
    setNombre("")
    setEmail("")
    setError("")
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl max-w-md w-full border border-yellow-500/30">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-yellow-500" />
            Registro de Participante
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1">Nombre completo</label>
            <Input type="text" placeholder="Ej. Edgar Jara" value={nombre} onChange={(e) => setNombre(e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Correo electrónico</label>
            <Input type="email" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button onClick={handleSubmit} className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold">
            Registrarse y Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}

// Componente Modal de Resumen de Apuestas
const ModalResumen = ({ open, onClose, onConfirm, apuestas, apuestaFinalista, jugador }: { 
  open: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  apuestas: Record<string, Apuesta>;
  apuestaFinalista: ApuestaFinalista;
  jugador: Jugador | null;
}) => {
  const [partidosMap] = useState(() => {
    const map: Record<string, Partido> = {}
    TODOS_LOS_PARTIDOS.forEach(p => { map[p.id] = p })
    return map
  })

  if (!open) return null

  const calcularTotalBalones = () => {
    let total = 0
    Object.values(apuestas).forEach(apuesta => {
      if (apuesta.aceptada) {
        const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
        total += seleccionadas
        if (apuesta.golesLocal !== "" || apuesta.golesVisita !== "") total += 1
      }
    })
    if (apuestaFinalista.aceptada) total += 1
    return total
  }

  const totalBalones = calcularTotalBalones()

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl max-w-md w-full border border-yellow-500/30">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Resumen de Apuestas
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(apuestas).map(([id, apuesta]) => {
              if (!apuesta.aceptada) return null
              const partido = partidosMap[id]
              if (!partido) return null
              const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
              const balones = seleccionadas + (apuesta.golesLocal !== "" || apuesta.golesVisita !== "" ? 1 : 0)
              return (
                <div key={id} className="bg-slate-800/50 rounded-lg p-2 text-sm">
                  <p className="text-slate-300">{partido.local} vs {partido.visitante}</p>
                  <p className="text-xs text-yellow-400">{mostrarBalones(balones)}</p>
                </div>
              )
            })}
            {apuestaFinalista.aceptada && (
              <div className="bg-slate-800/50 rounded-lg p-2 text-sm">
                <p className="text-slate-300">Finalistas: {apuestaFinalista.primero} vs {apuestaFinalista.segundo}</p>
                <p className="text-xs text-yellow-400">⚽️</p>
              </div>
            )}
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-sm text-slate-400">Total a gastar</p>
            <p className="text-3xl font-black text-yellow-500">{mostrarBalones(totalBalones)}</p>
            <p className="text-xs text-slate-500 mt-1">Balones disponibles: {mostrarBalones(jugador?.balones || 0)}</p>
          </div>
          <Button onClick={onConfirm} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3">
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmar Apuestas
          </Button>
        </div>
      </div>
    </div>
  )
}

// Componente Botón Flotante
const BotonFlotante = ({ total, onClick }: { total: number; onClick: () => void }) => {
  if (total === 0) return null
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Button onClick={onClick} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold gap-3 px-8 py-4 text-lg shadow-2xl rounded-full border border-green-500/30">
        <CheckCircle className="h-5 w-5" />
        Validar Apuestas ({mostrarBalones(total)})
      </Button>
    </div>
  )
}

// Componente Modal de Reglas
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
              <p>• ⚽️⚽️ = 2 apuestas (Doble)</p>
              <p>• ⚽️⚽️⚽️ = 3 apuestas (Triple)</p>
              <p>• Máximo 10 ⚽️ por jugador</p>
              <p>• Cada acierto = +1 ⚽️</p>
            </div>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-emerald-400 font-extrabold text-xs uppercase">🏵 SISTEMA DE MEDALLAS</h4>
            <div className="text-[11px] text-slate-300 space-y-1 mt-2">
              <p>• Al llegar a 10 ⚽️, el sobrante se convierte en 🏵</p>
              <p>• 10 ⚽️ + 1 = 1 🏵</p>
              <p>• Cada 5 🏵 = 1 🏆</p>
            </div>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-amber-400 font-extrabold text-xs uppercase">🏆 SISTEMA DE COPA</h4>
            <div className="text-[11px] text-slate-300 space-y-1 mt-2">
              <p>• 1 🏆 = 1 Apuesta Mundialista</p>
              <p>• Pronostica el CAMPEÓN de la Copa del Mundo</p>
              <p>• ¡Acierta y gana premios especiales!</p>
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

// ========== COMPONENTE PRINCIPAL ==========

export default function QuinielaPage() {
  const router = useRouter()
  const [apuestas, setApuestas] = useState<Record<string, Apuesta>>({})
  const [apuestaFinalista, setApuestaFinalista] = useState<ApuestaFinalista>({ primero: "", segundo: "", aceptada: false })
  const [jugador, setJugador] = useState<Jugador | null>(null)
  const [mostrarReglas, setMostrarReglas] = useState(false)
  const [mostrarModalResumen, setMostrarModalResumen] = useState(false)
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false)
  const [actualizando, setActualizando] = useState(false)
  const [partidosVisibles, setPartidosVisibles] = useState<Partido[]>(PARTIDOS_INICIALES)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: string } | null>(null)

  const { data: partidosActualizados } = useSWR(
    "/api/partidos/actualizados",
    fetcher,
    { refreshInterval: 30000, fallbackData: partidosVisibles }
  )

  useEffect(() => {
    if (partidosActualizados && partidosActualizados.length > 0) {
      setPartidosVisibles(partidosActualizados)
    }
  }, [partidosActualizados])

  // Cargar o crear jugador
  useEffect(() => {
    const jugadorGuardado = localStorage.getItem("jugador_actual")
    if (jugadorGuardado) {
      setJugador(JSON.parse(jugadorGuardado))
    } else {
      const nuevoJugador: Jugador = {
        id: Date.now().toString(),
        nombre: "Invitado",
        balones: 10,
        medallas: 0,
        copas: 0,
        fechaRegistro: new Date().toISOString()
      }
      localStorage.setItem("jugador_actual", JSON.stringify(nuevoJugador))
      setJugador(nuevoJugador)
    }
  }, [])

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

  const mostrarMensaje = (texto: string, tipo: "success" | "error" | "info") => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 3000)
  }

  const guardarLocal = () => {
    const data = {
      resultado: apuestas,
      finalista: apuestaFinalista,
      fecha: new Date().toISOString()
    }
    localStorage.setItem("quiniela_apuestas_v2", JSON.stringify(data))
  }

  const actualizarJugador = (nuevoJugador: Jugador) => {
    setJugador(nuevoJugador)
    localStorage.setItem("jugador_actual", JSON.stringify(nuevoJugador))
  }

  // Función para convertir balones sobrantes en medallas y copas
  const convertirBalones = (jugadorActual: Jugador): Jugador => {
    let { balones, medallas, copas } = jugadorActual
    
    if (balones >= 10) {
      const sobrante = balones - 10
      if (sobrante > 0) {
        balones = 10
        medallas += sobrante
        mostrarMensaje(`✨ ¡+${sobrante} 🏵 Medallas!`, "success")
      }
    }
    
    if (medallas >= 5) {
      const nuevasCopas = Math.floor(medallas / 5)
      medallas = medallas % 5
      copas += nuevasCopas
      mostrarMensaje(`🏆 ¡+${nuevasCopas} Copa(s) Mundialista(s)!`, "success")
    }
    
    return { ...jugadorActual, balones, medallas, copas }
  }

  const estamparSello = (partidoId: string, tipo: "L" | "E" | "V") => {
    if (!jugador) return
    const apuesta = apuestas[partidoId]
    const partido = partidosVisibles.find(p => p.id === partidoId)!
    const estadoTiempo = TiempoIndicator({ timestamp: partido.timestamp, estado: partido.estado })
    
    if (apuesta?.aceptada || estadoTiempo.bloqueado) {
      if (estadoTiempo.bloqueado) mostrarMensaje("⏰ Partido cerrado, no se pueden hacer cambios", "error")
      return
    }

    setApuestas(prev => {
      const actual = prev[partidoId] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
      const nueva = { ...actual, [tipo]: !actual[tipo] }
      
      const seleccionadas = [nueva.L, nueva.E, nueva.V].filter(Boolean).length
      if (seleccionadas > 3) {
        mostrarMensaje("❌ Máximo 3 opciones por partido", "error")
        return prev
      }
      
      guardarLocal()
      return { ...prev, [partidoId]: nueva }
    })
  }

  const getTipoApuesta = (apuesta: Apuesta) => {
  const count = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
  const visual = getTipoApuestaVisual(count)
  return { texto: visual.texto, costo: visual.costo }
}

  const handleGoles = (partidoId: string, campo: "golesLocal" | "golesVisita", valor: string) => {
    if (!jugador) return
    const apuesta = apuestas[partidoId]
    const partido = partidosVisibles.find(p => p.id === partidoId)!
    const estadoTiempo = TiempoIndicator({ timestamp: partido.timestamp, estado: partido.estado })
    
    if (apuesta?.aceptada || estadoTiempo.bloqueado) return
    
    const limpio = valor.replace(/[^0-9]/g, "")
    setApuestas(prev => ({ 
      ...prev, 
      [partidoId]: { ...prev[partidoId], [campo]: limpio } 
    }))
    guardarLocal()
  }

  const aceptarApuestaResultado = (partidoId: string) => {
    if (!jugador) return
    const apuesta = apuestas[partidoId]
    const seleccionadas = [apuesta?.L, apuesta?.E, apuesta?.V].filter(Boolean).length
    const partido = partidosVisibles.find(p => p.id === partidoId)!
    const estadoTiempo = TiempoIndicator({ timestamp: partido.timestamp, estado: partido.estado })
    
    if (estadoTiempo.bloqueado) {
      mostrarMensaje("⏰ No se puede aceptar: partido cerrado", "error")
      return
    }
    
    if (seleccionadas === 0) {
      mostrarMensaje("⚠️ Debes seleccionar al menos una opción", "error")
      return
    }

    if (jugador.balones < seleccionadas) {
      mostrarMensaje(`❌ Necesitas ${mostrarBalones(seleccionadas)} y solo tienes ${mostrarBalones(jugador.balones)}`, "error")
      return
    }

    const nuevoJugador = { ...jugador, balones: jugador.balones - seleccionadas }
    const jugadorConvertido = convertirBalones(nuevoJugador)
    actualizarJugador(jugadorConvertido)

    setApuestas(prev => ({ 
      ...prev, 
      [partidoId]: { ...prev[partidoId], aceptada: true } 
    }))
    guardarLocal()
    mostrarMensaje(`✅ Apuesta aceptada: -${mostrarBalones(seleccionadas)}`, "success")
  }

  const aceptarApuestaMarcador = (partidoId: string) => {
    if (!jugador) return
    const apuesta = apuestas[partidoId]
    const tieneGoles = apuesta?.golesLocal !== "" || apuesta?.golesVisita !== ""
    const partido = partidosVisibles.find(p => p.id === partidoId)!
    const estadoTiempo = TiempoIndicator({ timestamp: partido.timestamp, estado: partido.estado })
    
    if (estadoTiempo.bloqueado) {
      mostrarMensaje("⏰ No se puede aceptar: partido cerrado", "error")
      return
    }
    
    if (!tieneGoles) {
      mostrarMensaje("⚠️ Debes ingresar un marcador", "error")
      return
    }

    if (jugador.balones < 1) {
      mostrarMensaje("❌ Necesitas ⚽️ y no tienes suficientes", "error")
      return
    }

    const nuevoJugador = { ...jugador, balones: jugador.balones - 1 }
    const jugadorConvertido = convertirBalones(nuevoJugador)
    actualizarJugador(jugadorConvertido)

    setApuestas(prev => ({ 
      ...prev, 
      [partidoId]: { ...prev[partidoId], aceptada: true } 
    }))
    guardarLocal()
    mostrarMensaje("✅ Apuesta de marcador aceptada: -⚽️", "success")
  }

  const editarApuesta = (partidoId: string) => {
    if (!jugador) return
    const partido = partidosVisibles.find(p => p.id === partidoId)!
    const estadoTiempo = TiempoIndicator({ timestamp: partido.timestamp, estado: partido.estado })
    
    if (estadoTiempo.bloqueado) {
      mostrarMensaje("❌ No se puede editar: partido cerrado", "error")
      return
    }
    
    const apuesta = apuestas[partidoId]
    const seleccionadas = [apuesta?.L, apuesta?.E, apuesta?.V].filter(Boolean).length
    const tieneMarcador = apuesta?.golesLocal !== "" || apuesta?.golesVisita !== ""
    let balonesADevolver = seleccionadas
    if (tieneMarcador) balonesADevolver += 1
    
    if (balonesADevolver > 0) {
      const nuevoJugador = { ...jugador, balones: jugador.balones + balonesADevolver }
      actualizarJugador(nuevoJugador)
      mostrarMensaje(`↩️ Se devolvieron ${mostrarBalones(balonesADevolver)}`, "info")
    }
    
    setApuestas(prev => ({ 
      ...prev, 
      [partidoId]: { ...prev[partidoId], aceptada: false } 
    }))
    guardarLocal()
  }

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
  }

  const calcularTotalApuestas = () => {
    if (!jugador) return 0
    let total = 0
    Object.values(apuestas).forEach(apuesta => {
      if (apuesta.aceptada) {
        const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
        total += seleccionadas
        if (apuesta.golesLocal !== "" || apuesta.golesVisita !== "") total += 1
      }
    })
    if (apuestaFinalista.aceptada) total += 1
    return total
  }

  const handleRegistro = (nombre: string, email: string) => {
    const nuevoJugador: Jugador = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      balones: 10,
      medallas: 0,
      copas: 0,
      email: email.trim(),
      fechaRegistro: new Date().toISOString()
    }
    localStorage.setItem("jugador_actual", JSON.stringify(nuevoJugador))
    setJugador(nuevoJugador)
    setMostrarModalRegistro(false)
    setMostrarModalResumen(true)
  }

  const handleValidarApuestas = () => {
    const total = calcularTotalApuestas()
    if (total === 0) {
      mostrarMensaje("⚠️ No hay apuestas aceptadas para validar", "error")
      return
    }
    
    if (jugador && jugador.nombre !== "Invitado") {
      setMostrarModalResumen(true)
    } else {
      setMostrarModalRegistro(true)
    }
  }

  const handleConfirmarApuestas = () => {
    setMostrarModalResumen(false)
    if (jugador) {
      mostrarMensaje(`🎉 ¡Apuestas confirmadas! Gastaste ${mostrarBalones(calcularTotalApuestas())}`, "success")
    }
  }

  const totalApuestas = calcularTotalApuestas()
  const partidosFiltrados = jugador ? filtrarPartidosFuturosYHoy(partidosVisibles) : []

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* HEADER */}
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Quiniela de Apuestas
          </h1>
          {jugador && (
            <p className="text-[10px] text-slate-400">{jugador.nombre}</p>
          )}
        </div>
        <button onClick={() => {}} disabled={actualizando} className="text-slate-400 hover:text-white transition-colors">
          <RefreshCw className={`h-5 w-5 ${actualizando ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Panel de Recursos del Jugador */}
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
          mensaje.tipo === "error" ? "bg-red-600 text-white" : 
          "bg-blue-600 text-white"
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
      <ModalRegistro open={mostrarModalRegistro} onClose={() => setMostrarModalRegistro(false)} onRegister={handleRegistro} />
      <ModalResumen 
        open={mostrarModalResumen} 
        onClose={() => setMostrarModalResumen(false)} 
        onConfirm={handleConfirmarApuestas}
        apuestas={apuestas}
        apuestaFinalista={apuestaFinalista}
        jugador={jugador}
      />

      <div className="p-[0.75rem] md:p-[1.5rem] pb-28">
        <div className="max-w-4xl mx-auto space-y-[0.75rem]">

          {/* ========== APUESTA MUNDIALISTA (con 🏆) ========== */}
          <div className="relative">
            <div className="bg-slate-800/30 rounded-r-lg rounded-l-none overflow-hidden">
              <div className="pt-2 px-3">
                <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                  <Award className="h-3 w-3" /> Apuesta Mundialista 🏆 (1 Copa)
                </span>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full opacity-70"></div>
              <div className="pl-3">
                <div className="p-3">
                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    <div className="text-center">
                      <span className="text-[0.55rem] font-bold text-green-400 uppercase block mb-2">🏆 CAMPEÓN</span>
                      <Input 
                        type="text" 
                        placeholder="Ej. Brasil" 
                        value={apuestaFinalista.primero} 
                        onChange={(e) => setApuestaFinalista(prev => ({ ...prev, primero: e.target.value }))} 
                        disabled={apuestaFinalista.aceptada} 
                        className="w-36 text-center bg-slate-950 border-slate-800 text-white h-[2.2rem] rounded-[0.5rem] text-sm disabled:opacity-50" 
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700/50 bg-slate-800/40 p-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center justify-start gap-1 text-slate-400 text-[0.55rem]">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {jugador && jugador.copas > 0 ? "✅ Dispones de 🏆 para apostar" : "⚠️ Necesitas 5 🏵 para obtener 1 🏆"}
                      </div>
                      {apuestaFinalista.aceptada && (
                        <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-md w-fit mt-1">
                          <span className="text-base">🏆</span>
                          <span className="text-[0.65rem] font-bold text-white">Apuesta Mundialista</span>
                          <span className="text-[0.7rem] font-black text-yellow-400">1 🏆</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        if (!jugador) return
                        if (!apuestaFinalista.primero) {
                          mostrarMensaje("⚠️ Debes escribir un CAMPEÓN", "error")
                          return
                        }
                        if (jugador.copas < 1) {
                          mostrarMensaje("❌ No tienes suficientes 🏆. Consigue 5 🏵 para obtener 1 🏆", "error")
                          return
                        }
                        const nuevoJugador = { ...jugador, copas: jugador.copas - 1 }
                        actualizarJugador(nuevoJugador)
                        setApuestaFinalista(prev => ({ ...prev, aceptada: true }))
                        guardarLocal()
                        mostrarMensaje("✅ Apuesta Mundialista aceptada: -1 🏆", "success")
                      }} disabled={apuestaFinalista.aceptada || !apuestaFinalista.primero || (jugador?.copas || 0) < 1} className={`h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${apuestaFinalista.aceptada ? "bg-emerald-800 text-emerald-200 cursor-not-allowed opacity-70" : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"} disabled:opacity-50`}>
                        <CheckCircle className="h-3 w-3" /> Aceptar
                      </button>
                      <button onClick={() => {
                        if (!jugador) return
                        const nuevoJugador = { ...jugador, copas: jugador.copas + 1 }
                        actualizarJugador(nuevoJugador)
                        setApuestaFinalista(prev => ({ ...prev, aceptada: false }))
                        guardarLocal()
                        mostrarMensaje("↩️ Se devolvió 1 🏆", "info")
                      }} disabled={!apuestaFinalista.aceptada} className="h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white transition-all disabled:opacity-50">
                        <Edit className="h-3 w-3" /> Editar
                      </button>
                    </div>
                  </div>
                  {apuestaFinalista.aceptada && (
                    <div className="text-center text-emerald-400 text-[0.55rem] mt-1">
                      ✓ Apuesta registrada: {apuestaFinalista.primero} es CAMPEÓN
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========== LISTA DE PARTIDOS ========== */}
          {partidosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400">No hay partidos programados para hoy o en los próximos días.</p>
              <p className="text-slate-500 text-sm mt-1">¡Vuelve pronto para más acción!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {partidosFiltrados.map((partido) => {
                const apuesta = apuestas[partido.id] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
                const tipo = getTipoApuesta(apuesta)
                const aceptada = apuesta.aceptada
                const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
                const esHoy = esPartidoHoy(partido.timestamp)
                const estadoTiempo = TiempoIndicator({ timestamp: partido.timestamp, estado: partido.estado })
                
                return (
                  <div key={partido.id} className={`bg-slate-900 rounded-xl border overflow-hidden shadow-xl transition-all ${esHoy ? 'border-yellow-500/50 scale-[1.01]' : 'border-slate-800'}`}>
                    
                    {/* Cabecera del partido */}
                    <div className="p-3 bg-slate-950/40 border-b border-slate-800">
                      <div className="text-center font-black text-sky-400 text-sm">
                        {partido.banderaLocal} {partido.local} <span className="text-yellow-600 mx-2">VS</span> {partido.visitante} {partido.banderaVisitante}
                      </div>
                      {partido.estado === "live" && (
                        <div className="text-center text-red-500 text-xs font-bold mt-1 animate-pulse">
                          🔴 EN VIVO
                        </div>
                      )}
                    </div>

                    {/* Info del partido */}
                    <div className="px-3 pt-2">
                      <div className="flex flex-wrap justify-center gap-3 text-[0.55rem] text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatearFecha(partido.fecha)}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatearHoraConZona(partido.timestamp, partido.ciudad)}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {partido.estadio}</span>
                        <span className="text-slate-600">•</span>
                        <span>{partido.ciudad}</span>
                        <span className="text-slate-600">•</span>
                        <span>{partido.pais}</span>
                        <span className="text-slate-600">•</span>
                        <span>Grupo {partido.grupo}</span>
                      </div>
                    </div>

                    {/* ========== APUESTA RESULTADO ========== */}
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
                                <div className="flex items-center justify-start gap-1 text-slate-400 text-[0.55rem]">
                                  <div className={`w-2 h-2 rounded-full ${estadoTiempo.color}`}></div>
                                  {estadoTiempo.mensaje}
                                </div>
                                {seleccionadas > 0 && !estadoTiempo.bloqueado && !aceptada && (
                                  <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-md w-fit mt-1">
  <span className="text-[0.65rem] font-bold text-white">{tipo.texto}</span>
  <span className="text-[0.7rem] font-black text-yellow-400">{tipo.costo} ⚽️</span>
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
                                  <CheckCircle className="h-3 w-3" /> Aceptar ({tipo.costo} ⚽️)
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

                    {/* ========== APUESTA MARCADOR ========== */}
                    <div className="bg-slate-950/50 rounded-[0.6rem] border border-slate-800 mx-3 mt-2 mb-3">
                      <div className="border-b border-slate-800/80 p-2 text-center">
                        <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                          <Target className="h-3 w-3" /> Apuesta Marcador (1 ⚽️)
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
                            <div className="flex items-center justify-start gap-1 text-slate-400 text-[0.55rem]">
                              <div className={`w-2 h-2 rounded-full ${estadoTiempo.color}`}></div>
                              {estadoTiempo.mensaje}
                            </div>
                            {(apuesta.golesLocal !== "" || apuesta.golesVisita !== "") && !estadoTiempo.bloqueado && !aceptada && (
                              <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-md w-fit mt-1">
                                <span className="text-base">⚽️</span>
                                <span className="text-[0.65rem] font-bold text-white">Marcador</span>
                                <span className="text-[0.7rem] font-black text-yellow-400">1 ⚽️</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => aceptarApuestaMarcador(partido.id)} disabled={aceptada || estadoTiempo.bloqueado || (apuesta.golesLocal === "" && apuesta.golesVisita === "")} className={`h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${aceptada ? "bg-emerald-800 text-emerald-200 cursor-not-allowed opacity-70" : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"} disabled:opacity-50`}>
                              <CheckCircle className="h-3 w-3" /> Aceptar (1 ⚽️)
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
          )}

          {/* Botón para cargar más partidos */}
          {partidosVisibles.length < TODOS_LOS_PARTIDOS.length && partidosFiltrados.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button onClick={() => {
                setCargandoMas(true)
                setTimeout(() => {
                  setPartidosVisibles(TODOS_LOS_PARTIDOS)
                  setCargandoMas(false)
                }, 500)
              }} disabled={cargandoMas} className="bg-slate-800 hover:bg-slate-700 text-white gap-2">
                {cargandoMas ? "Cargando..." : "Cargar más partidos"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Botón Flotante */}
      <BotonFlotante total={totalApuestas} onClick={handleValidarApuestas} />

      {/* FOOTER */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Sistema de Balones ⚽️ | Medallas 🏵 | Copa 🏆</p>
      </footer>
    </div>
  )
}