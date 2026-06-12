"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trophy, Save, LayoutGrid, Calendar, MapPin, Clock } from "lucide-react"
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
  pais: string
  grupo: string
}

interface Apuesta {
  opcion: "L" | "E" | "V" | ""
  golesLocal: string
  golesVisita: string
}

// Partidos de la Jornada de Apertura
const PARTIDOS: Partido[] = [
  {
    id: "1",
    local: "Canadá",
    visitante: "Bosnia y H.",
    banderaLocal: "🇨🇦",
    banderaVisitante: "🇧🇦",
    fecha: "Viernes 12 de Junio",
    hora: "21:00",
    estadio: "Estadio de Toronto",
    pais: "Canadá",
    grupo: "B"
  },
  {
    id: "2",
    local: "México",
    visitante: "Corea del Sur",
    banderaLocal: "🇲🇽",
    banderaVisitante: "🇰🇷",
    fecha: "Viernes 12 de Junio",
    hora: "18:00",
    estadio: "Estadio Azteca",
    pais: "México",
    grupo: "A"
  },
  {
    id: "3",
    local: "Estados Unidos",
    visitante: "Paraguay",
    banderaLocal: "🇺🇸",
    banderaVisitante: "🇵🇾",
    fecha: "Viernes 12 de Junio",
    hora: "15:00",
    estadio: "MetLife Stadium",
    pais: "EE.UU.",
    grupo: "D"
  }
]

export default function QuinielaPage() {
  const router = useRouter()
  const [registrado, setRegistrado] = useState(false)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [apuestas, setApuestas] = useState<Record<string, Apuesta>>({})

  useEffect(() => {
    // Cargar apuestas guardadas
    const saved = localStorage.getItem("quiniela_apuestas")
    if (saved) {
      setApuestas(JSON.parse(saved))
    } else {
      const inicial: Record<string, Apuesta> = {}
      PARTIDOS.forEach(p => {
        inicial[p.id] = { opcion: "", golesLocal: "", golesVisita: "" }
      })
      setApuestas(inicial)
    }
  }, [])

  const handleInscripcion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !email) {
      alert("Por favor introduce tus datos para ingresar a la planilla.")
      return
    }
    setRegistrado(true)
    // Guardar usuario
    localStorage.setItem("quiniela_usuario", JSON.stringify({ nombre, email }))
  }

  // Estampar sello (resultado L/E/V)
  const estamparSello = (partidoId: string, seleccion: "L" | "E" | "V") => {
    setApuestas(prev => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        opcion: prev[partidoId]?.opcion === seleccion ? "" : seleccion
      }
    }))
  }

  // Manejo de goles
  const handleGoles = (partidoId: string, campo: "golesLocal" | "golesVisita", valor: string) => {
    const limpio = valor.replace(/[^0-9]/g, "")
    setApuestas(prev => ({
      ...prev,
      [partidoId]: { ...prev[partidoId], [campo]: limpio }
    }))
  }

  const guardarGiro = () => {
    localStorage.setItem("quiniela_apuestas", JSON.stringify(apuestas))
    alert(`📝 ¡Boleta archivada con éxito, ${nombre}! Tus marcaciones han sido registradas.`)
  }

  // VISTA 1: INSCRIPCIÓN
  if (!registrado) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <Trophy className="h-10 w-10 text-yellow-500 mx-auto" />
            <h1 className="text-2xl font-black uppercase tracking-tight">Registro de Participante</h1>
            <p className="text-slate-400 text-xs">Inscríbete para validar tu boleta de doble apuesta.</p>
          </div>
          <form onSubmit={handleInscripcion} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nombre Completo</label>
              <Input 
                type="text" 
                placeholder="Ej. Edgar Jara" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                className="bg-slate-950 border-slate-800 text-white font-medium" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Correo Electrónico</label>
              <Input 
                type="email" 
                placeholder="edgar@correo.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-slate-950 border-slate-800 text-white font-medium" 
              />
            </div>
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black rounded-lg py-2.5 text-xs uppercase tracking-wider">
              Abrir Mi Planilla
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // VISTA 2: QUINIELA COMPLETA
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* CABECERA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2 text-white uppercase tracking-tight">
              <LayoutGrid className="h-5 w-5 text-yellow-500" /> 
              PLANILLA DE PRONÓSTICOS
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Participante activo: <span className="text-yellow-400 font-bold">{nombre}</span>
            </p>
          </div>
          <Button 
            onClick={guardarGiro} 
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-6 shadow-md gap-2 rounded-lg"
          >
            <Save className="h-4 w-4" /> Guardar Mis Cambios
          </Button>
        </div>

        {/* JORNADA DE APERTURA */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/40 border-b border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
            Jornada de Apertura — Viernes 12 de Junio
          </div>
          
          <div className="divide-y divide-slate-800/60">
            {PARTIDOS.map((partido) => {
              const apuesta = apuestas[partido.id] || { opcion: "", golesLocal: "", golesVisita: "" }
              
              return (
                <div key={partido.id} className="p-6 space-y-5">
                  
                  {/* ENCABEZADO: Partido */}
                  <div className="text-center sm:text-left font-black text-slate-200 tracking-wide text-sm border-b border-slate-800/60 pb-3">
                    <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
                      <span className="text-slate-400 text-xs">Partido:</span>
                      <span className="text-yellow-400 font-black uppercase text-base">
                        {partido.banderaLocal} {partido.local} VS {partido.visitante} {partido.banderaVisitante}
                      </span>
                    </div>
                    {/* SUBTÍTULO: Datos del partido */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {partido.fecha}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {partido.hora}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {partido.estadio}, {partido.pais}</span>
                      <span className="flex items-center gap-1">Grupo {partido.grupo}</span>
                    </div>
                  </div>

                  {/* 1ª APUESTA: RESULTADO (GLOBOS) */}
                  <div className="space-y-3 bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black tracking-widest uppercase text-yellow-400">
                        ① Pronóstico de Resultado
                      </span>
                      <span className="text-[9px] text-slate-500">1 punto por acierto</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center max-w-md mx-auto sm:mx-0 pt-1">
                      {/* LOCAL */}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-green-400 mb-1">LOCAL</span>
                        <button 
                          onClick={() => estamparSello(partido.id, "L")} 
                          className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl transition-all duration-300 ${
                            apuesta.opcion === "L" 
                              ? "bg-green-600 border-green-400 text-white shadow-lg scale-105" 
                              : "bg-slate-950 border-slate-700 text-slate-600 hover:border-green-500"
                          }`}
                        >
                          {apuesta.opcion === "L" ? "✓" : "1"}
                        </button>
                      </div>

                      {/* EMPATE */}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-yellow-400 mb-1">EMPATE</span>
                        <button 
                          onClick={() => estamparSello(partido.id, "E")} 
                          className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl transition-all duration-300 ${
                            apuesta.opcion === "E" 
                              ? "bg-yellow-600 border-yellow-400 text-white shadow-lg scale-105" 
                              : "bg-slate-950 border-slate-700 text-slate-600 hover:border-yellow-500"
                          }`}
                        >
                          {apuesta.opcion === "E" ? "✓" : "X"}
                        </button>
                      </div>

                      {/* VISITA */}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-blue-400 mb-1">VISITA</span>
                        <button 
                          onClick={() => estamparSello(partido.id, "V")} 
                          className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl transition-all duration-300 ${
                            apuesta.opcion === "V" 
                              ? "bg-blue-600 border-blue-400 text-white shadow-lg scale-105" 
                              : "bg-slate-950 border-slate-700 text-slate-600 hover:border-blue-500"
                          }`}
                        >
                          {apuesta.opcion === "V" ? "✓" : "2"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2ª APUESTA: GOLES */}
                  <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <span className="text-[10px] font-black tracking-widest uppercase text-sky-400">
                        ② Pronóstico de Goles
                      </span>
                      <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">
                        ⚽ Acumula por aciertos
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto pt-2">
                      <div className="text-center space-y-2">
                        <label className="text-[11px] font-bold text-green-400 uppercase block">
                          {partido.banderaLocal} {partido.local}
                        </label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="0"
                          value={apuesta.golesLocal}
                          onChange={(e) => handleGoles(partido.id, "golesLocal", e.target.value)}
                          className="bg-slate-950 border-slate-700 text-center text-xl font-black text-white focus-visible:ring-yellow-500 h-14 rounded-xl"
                        />
                      </div>

                      <div className="text-center space-y-2">
                        <label className="text-[11px] font-bold text-blue-400 uppercase block">
                          {partido.banderaVisitante} {partido.visitante}
                        </label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="0"
                          value={apuesta.golesVisita}
                          onChange={(e) => handleGoles(partido.id, "golesVisita", e.target.value)}
                          className="bg-slate-950 border-slate-700 text-center text-xl font-black text-white focus-visible:ring-yellow-500 h-14 rounded-xl"
                        />
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-500 text-center pt-2">
                      💡 Si seleccionaste EMPATE, ambos equipos marcarán la misma cantidad de goles
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* PIE: Botón guardar flotante */}
        <div className="sticky bottom-6 mt-8 flex justify-center">
          <Button 
            onClick={guardarGiro}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black gap-2 px-8 py-6 text-lg shadow-xl rounded-xl"
          >
            <Save className="h-5 w-5" />
            💾 Guardar Todos mis Pronósticos
          </Button>
        </div>
      </div>
    </div>
  )
}