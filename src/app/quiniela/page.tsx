"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trophy, LayoutGrid, Calendar, MapPin, Clock, TrendingUp, Target, Info, CheckCircle, Edit, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

export default function QuinielaPage() {
  const router = useRouter()
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [cargandoPartidos, setCargandoPartidos] = useState(true)
  const [apuestas, setApuestas] = useState<Record<string, Apuesta>>({})
  const [apuestaFinalista, setApuestaFinalista] = useState<ApuestaFinalista>({ primero: "", segundo: "", aceptada: false })
  const [mostrarReglas, setMostrarReglas] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)

  // Cargar partidos desde API
  const cargarPartidos = async () => {
    try {
      const res = await fetch('/api/partidos')
      const data = await res.json()
      setPartidos(data.partidos)
      
      // Inicializar apuestas para los nuevos partidos
      const nuevasApuestas = { ...apuestas }
      data.partidos.forEach((p: Partido) => {
        if (!nuevasApuestas[p.id]) {
          nuevasApuestas[p.id] = { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
        }
      })
      setApuestas(nuevasApuestas)
    } catch (error) {
      console.error('Error cargando partidos:', error)
    } finally {
      setCargandoPartidos(false)
    }
  }

  // Forzar actualización cada segundo para la línea de tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    cargarPartidos()
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("quiniela_apuestas_v2")
    if (saved) {
      const data = JSON.parse(saved)
      setApuestas(prev => ({ ...prev, ...data.resultado }))
      setApuestaFinalista(data.finalista || { primero: "", segundo: "", aceptada: false })
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

  const estamparSello = (partidoId: string, tipo: "L" | "E" | "V") => {
    const apuesta = apuestas[partidoId]
    const partido = partidos.find(p => p.id === partidoId)!
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
    if (count === 0) return { texto: "", icono: "", costo: 0, showMessage: false }
    if (count === 1) return { texto: "Simple", icono: "🔴", costo: 0.50, showMessage: true }
    if (count === 2) return { texto: "Doble", icono: "🟡", costo: 1.00, showMessage: true }
    return { texto: "Triple", icono: "🔴", costo: 1.50, showMessage: true }
  }

  const handleGoles = (partidoId: string, campo: "golesLocal" | "golesVisita", valor: string) => {
    const apuesta = apuestas[partidoId]
    const partido = partidos.find(p => p.id === partidoId)!
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

  const aceptarApuesta = (partidoId: string) => {
    const apuesta = apuestas[partidoId]
    const seleccionadas = [apuesta?.L, apuesta?.E, apuesta?.V].filter(Boolean).length
    const tieneGoles = apuesta?.golesLocal !== "" || apuesta?.golesVisita !== ""
    const partido = partidos.find(p => p.id === partidoId)!
    const minutosRestantes = (partido.timestamp - Date.now()) / (1000 * 60)
    const bloqueado = minutosRestantes <= 20
    
    if (bloqueado) {
      alert("⏰ No se puede aceptar: partido cerrado")
      return
    }
    
    if (seleccionadas === 0 && !tieneGoles) {
      alert("⚠️ Debes seleccionar al menos una opción")
      return
    }

    setApuestas(prev => ({ 
      ...prev, 
      [partidoId]: { ...prev[partidoId], aceptada: true } 
    }))
    
    const tipo = getTipoApuesta(apuesta)
    if (tipo.showMessage) {
      alert(`✅ Apuesta aceptada: ${tipo.icono} ${tipo.texto} | ${tipo.costo.toFixed(2)}€`)
    } else if (tieneGoles) {
      alert(`✅ Apuesta de marcador aceptada`)
    }
    guardarLocal()
  }

  const editarApuesta = (partidoId: string) => {
    const partido = partidos.find(p => p.id === partidoId)!
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

  const aceptarFinalista = () => {
    if (!apuestaFinalista.primero || !apuestaFinalista.segundo) {
      alert("⚠️ Debes escribir un CAMPEÓN y un SUBCAMPEÓN")
      return
    }
    setApuestaFinalista(prev => ({ ...prev, aceptada: true }))
    alert(`✅ Apuesta de Finalistas aceptada: 🏆 ${apuestaFinalista.primero} vs 🥈 ${apuestaFinalista.segundo} | 1.00€`)
    guardarLocal()
  }

  const editarFinalista = () => {
    setApuestaFinalista(prev => ({ ...prev, aceptada: false }))
    guardarLocal()
  }

  const guardarYContinuar = () => {
    const pendientes = []
    
    Object.keys(apuestas).forEach(id => {
      const apuesta = apuestas[id]
      const seleccionadas = [apuesta?.L, apuesta?.E, apuesta?.V].filter(Boolean).length
      const costoResultado = seleccionadas * 0.50
      const tieneGoles = apuesta?.golesLocal !== "" || apuesta?.golesVisita !== ""
      const costoGoles = tieneGoles ? 0.50 : 0
      const costoTotal = costoResultado + costoGoles
      
      if (apuesta.aceptada && costoTotal > 0) {
        pendientes.push({
          id,
          tipo: "apuesta",
          descripcion: `Partido ${id}`,
          monto: costoTotal
        })
      }
    })
    
    if (apuestaFinalista.aceptada) {
      pendientes.push({
        id: "finalista",
        tipo: "finalista",
        descripcion: "Apuesta Finalistas",
        monto: 1.00
      })
    }
    
    if (pendientes.length === 0) {
      alert("No hay apuestas aceptadas para guardar")
      return
    }
    
    localStorage.setItem("apuestasPendientes", JSON.stringify(pendientes))
    router.push("/jugador")
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
        {estado.mensaje} ({Math.max(0, Math.round((timestamp - Date.now()) / 1000 / 60))} min)
      </div>
    )
  }

  if (cargandoPartidos) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Cargando partidos...</div>
      </div>
    )
  }

  if (partidos.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No hay partidos disponibles</h2>
          <p className="text-slate-400">Todos los partidos han finalizado. ¡Gracias por participar!</p>
          <Button onClick={() => router.push('/')} className="mt-4 bg-yellow-500 text-black">
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-[0.75rem] md:p-[1.5rem] pb-24">
      <div className="max-w-4xl mx-auto space-y-[0.75rem]">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[0.75rem] bg-slate-900 p-[1rem] rounded-[0.75rem] border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-[1rem] font-bold flex items-center gap-2 text-white uppercase tracking-tight">
              <LayoutGrid className="h-[0.75rem] w-[0.75rem] text-sky-500" /> QUINIELA DE PRONÓSTICOS
            </h1>
            <p className="text-xs text-slate-400 mt-1">📅 {partidos.length} partidos por jugar</p>
          </div>
          <Button onClick={() => setMostrarReglas(!mostrarReglas)} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-[0.75rem] shadow-md gap-2 rounded-[0.5rem] text-[0.7rem] py-[0.4rem]">
            <Info className="h-[0.7rem] w-[0.7rem]" /> Reglas
          </Button>
        </div>

        {/* Modal Reglas */}
        {mostrarReglas && (
          <div className="bg-slate-900 border-2 border-amber-500/50 p-6 rounded-xl space-y-4">
            <h2 className="text-sm font-black text-amber-500 uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Trophy className="h-4 w-4" /> REGLAMENTO 2026
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="space-y-2 bg-slate-950/40 p-3 rounded-lg">
                <span className="font-bold text-yellow-400">💰 APUESTA MÚLTIPLE</span>
                <p>• Simple: 1 opción = 0.50€</p>
                <p>• Doble: 2 opciones = 1.00€</p>
                <p>• Triple: 3 opciones = 1.50€</p>
                <p>• Marcador: 0.50€ por combinación</p>
                <p>• Finalistas: 1.00€</p>
                <p className="text-amber-400">Máximo 4 apuestas por partido (2.00€)</p>
              </div>
              <div className="space-y-2 bg-slate-950/40 p-3 rounded-lg">
                <span className="font-bold text-emerald-400">🏆 PREMIOS (33% c/u)</span>
                <p>• 1er Ganador: Mayor puntuación acumulada</p>
                <p>• 2do Ganador: Mayor cantidad de goles</p>
                <p>• 3er Ganador: Acierte Campeón y Subcampeón</p>
              </div>
            </div>
            <Button onClick={() => setMostrarReglas(false)} className="w-full bg-yellow-500 text-slate-950 font-black">Cerrar</Button>
          </div>
        )}

        {/* Jornada */}
        <div className="bg-slate-900 rounded-[0.75rem] border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-[0.5rem] bg-slate-950/40 border-b border-slate-800 text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 text-center">
            Próximos partidos - {new Date().toLocaleDateString()}
          </div>
          
          <div className="divide-y divide-slate-800/60">
            {partidos.map((partido) => {
              const apuesta = apuestas[partido.id] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false }
              const tipo = getTipoApuesta(apuesta)
              const aceptada = apuesta.aceptada
              const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length
              const estadoTiempo = getTiempoEstado(partido.timestamp)
              
              return (
                <div key={partido.id} className="p-[0.75rem] space-y-[0.75rem]">
                  
                  {/* EQUIPOS */}
                  <div className="text-center font-black tracking-wide border-b border-slate-800/60 pb-[0.5rem]">
                    <span className="text-[0.875rem] uppercase text-sky-400">
                      {partido.banderaLocal} {partido.local} <span className="text-yellow-600 mx-1">vs</span> {partido.visitante} {partido.banderaVisitante}
                    </span>
                  </div>

                  {/* SUBTÍTULO */}
                  <div className="flex flex-wrap justify-center gap-3 text-[0.55rem] text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {partido.fecha}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {partido.hora}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {partido.estadio}</span>
                    <span className="text-slate-600">•</span>
                    <span>{partido.ciudad}</span>
                    <span className="text-slate-600">•</span>
                    <span>{partido.pais}</span>
                    <span className="text-slate-600">•</span>
                    <span>Grupo {partido.grupo}</span>
                  </div>

                  {/* 1ra APUESTA: RESULTADO */}
                  <div className="relative">
                    <div className="bg-slate-800/30 rounded-r-lg rounded-l-none overflow-hidden">
                      <div className="pt-2 px-3">
                        <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                          <TrendingUp className="h-3 w-3" /> 1ra. Apuesta: Resultado
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
                              {seleccionadas > 0 && !estadoTiempo.bloqueado && (
                                <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-md w-fit mt-1">
                                  <span className="text-base">{tipo.icono}</span>
                                  <span className="text-[0.65rem] font-bold text-white">{tipo.texto}</span>
                                  <span className="text-[0.7rem] font-black text-yellow-400">{tipo.costo.toFixed(2)}€</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => aceptarApuesta(partido.id)} disabled={aceptada || estadoTiempo.bloqueado || (seleccionadas === 0 && apuesta.golesLocal === "" && apuesta.golesVisita === "")} className={`h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${aceptada ? "bg-emerald-800 text-emerald-200 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"} disabled:opacity-50`}>
                                <CheckCircle className="h-3 w-3" /> Aceptar
                              </button>
                              <button onClick={() => editarApuesta(partido.id)} disabled={!aceptada || estadoTiempo.bloqueado} className="h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white transition-all disabled:opacity-50">
                                <Edit className="h-3 w-3" /> Editar
                              </button>
                            </div>
                          </div>
                          {aceptada && <div className="text-center text-emerald-400 text-[0.55rem] mt-1">✓ Apuesta registrada</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2da APUESTA: MARCADOR */}
                  <div className="bg-slate-950/50 rounded-[0.6rem] border border-slate-800 overflow-hidden">
                    <div className="border-b border-slate-800/80 p-2 text-center">
                      <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                        <Target className="h-3 w-3" /> 2da. Apuesta: Marcador (0.50€)
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
                          <button onClick={() => aceptarApuesta(partido.id)} disabled={aceptada || estadoTiempo.bloqueado || (apuesta.golesLocal === "" && apuesta.golesVisita === "")} className={`h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${aceptada ? "bg-emerald-800 text-emerald-200 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"} disabled:opacity-50`}>
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
        </div>

        {/* 3ra APUESTA: FINALISTAS */}
        <div className="relative">
          <div className="bg-slate-800/30 rounded-r-lg rounded-l-none overflow-hidden">
            <div className="pt-2 px-3">
              <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                <Award className="h-3 w-3" /> 3ra. Apuesta: Finalistas de Copa (1.00€)
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
                  <div className="text-center">
                    <span className="text-[0.55rem] font-bold text-blue-400 uppercase block mb-2">🥈 SUBCAMPEÓN</span>
                    <Input 
                      type="text" 
                      placeholder="Ej. Argentina" 
                      value={apuestaFinalista.segundo} 
                      onChange={(e) => setApuestaFinalista(prev => ({ ...prev, segundo: e.target.value }))}
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
                    <button onClick={aceptarFinalista} disabled={apuestaFinalista.aceptada || !apuestaFinalista.primero || !apuestaFinalista.segundo} className={`h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${apuestaFinalista.aceptada ? "bg-emerald-800 text-emerald-200 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"} disabled:opacity-50`}>
                      <CheckCircle className="h-3 w-3" /> Aceptar
                    </button>
                    <button onClick={editarFinalista} disabled={!apuestaFinalista.aceptada} className="h-7 px-3 text-[0.6rem] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white transition-all disabled:opacity-50">
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

        {/* BOTÓN FLOTANTE */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button 
            onClick={guardarYContinuar}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-slate-950 font-bold gap-2 px-5 py-2 text-sm shadow-xl rounded-full border border-yellow-400/30"
          >
            <Trophy className="h-3.5 w-3.5" />
            Hacer mi participación
            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full">💰</span>
          </Button>
        </div>
      </div>
    </div>
  )
}