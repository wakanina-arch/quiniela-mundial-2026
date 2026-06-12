"use client"

import { useState, useEffect } from "react"
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
  ciudad: string
  pais: string
  grupo: string
}

interface Apuesta {
  opcion: "L" | "E" | "V" | ""
  golesLocal: string
  golesVisita: string
}

const PARTIDOS: Partido[] = [
  {
    id: "1", local: "Canadá", visitante: "Bosnia y H.",
    banderaLocal: "🇨🇦", banderaVisitante: "🇧🇦",
    fecha: "Viernes 12 Junio", hora: "21:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", grupo: "B"
  },
  {
    id: "2", local: "México", visitante: "Corea del Sur",
    banderaLocal: "🇲🇽", banderaVisitante: "🇰🇷",
    fecha: "Viernes 12 Junio", hora: "18:00", estadio: "Estadio Azteca", ciudad: "Ciudad de México", pais: "México", grupo: "A"
  },
  {
    id: "3", local: "Estados Unidos", visitante: "Paraguay",
    banderaLocal: "🇺🇸", banderaVisitante: "🇵🇾",
    fecha: "Viernes 12 Junio", hora: "15:00", estadio: "MetLife Stadium", ciudad: "East Rutherford", pais: "EE.UU.", grupo: "D"
  }
]

export default function QuinielaPage() {
  const [registrado, setRegistrado] = useState(false)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [apuestas, setApuestas] = useState<Record<string, Apuesta>>({})

  useEffect(() => {
    const saved = localStorage.getItem("quiniela_apuestas")
    if (saved) {
      setApuestas(JSON.parse(saved))
    } else {
      const inicial: Record<string, Apuesta> = {}
      PARTIDOS.forEach(p => { inicial[p.id] = { opcion: "", golesLocal: "", golesVisita: "" } })
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
    localStorage.setItem("quiniela_usuario", JSON.stringify({ nombre, email }))
  }

  const estamparSello = (partidoId: string, seleccion: "L" | "E" | "V") => {
    setApuestas(prev => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        opcion: prev[partidoId]?.opcion === seleccion ? "" : seleccion
      }
    }))
  }

  const handleGoles = (partidoId: string, campo: "golesLocal" | "golesVisita", valor: string) => {
    const limpio = valor.replace(/[^0-9]/g, "")
    setApuestas(prev => ({ ...prev, [partidoId]: { ...prev[partidoId], [campo]: limpio } }))
  }

  const guardarGiro = () => {
    localStorage.setItem("quiniela_apuestas", JSON.stringify(apuestas))
    alert(`📝 ¡Boleta archivada con éxito, ${nombre}!`)
  }

  // VISTA 1: INSCRIPCIÓN
  if (!registrado) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <Trophy className="h-10 w-10 text-amber-500 mx-auto" />
            <h1 className="text-2xl font-black uppercase tracking-tight">Registro de Participante</h1>
            <p className="text-slate-400 text-xs">Inscríbete para validar tu boleta de doble apuesta.</p>
          </div>
          <form onSubmit={handleInscripcion} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nombre Completo</label>
              <Input type="text" placeholder="Ej. Edgar Jara" value={nombre} onChange={(e) => setNombre(e.target.value)} className="bg-slate-950 border-slate-800 text-white font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Correo Electrónico</label>
              <Input type="email" placeholder="edgar@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-950 border-slate-800 text-white font-medium" />
            </div>
            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black rounded-lg py-2.5 text-xs uppercase tracking-wider">Abrir Mi Planilla</Button>
          </form>
        </div>
      </div>
    )
  }

  // VISTA 2: QUINIELA COMPLETA
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-[0.75rem] md:p-[1.5rem]">
      <div className="max-w-3xl mx-auto space-y-[0.75rem]">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[0.75rem] bg-slate-900 p-[1rem] rounded-[0.75rem] border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-[1rem] font-bold flex items-center gap-2 text-white uppercase tracking-tight">
              <LayoutGrid className="h-[0.75rem] w-[0.75rem] text-sky-500" /> PLANILLA DE PRONÓSTICOS
            </h1>
            <p className="text-slate-400 text-[0.65rem] mt-1">Participante activo: <span className="text-emerald-400 font-bold">{nombre}</span></p>
          </div>
          <Button onClick={guardarGiro} className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold px-[0.75rem] shadow-md gap-2 rounded-[0.5rem] text-[0.7rem] py-[0.4rem]">
            <Save className="h-[0.7rem] w-[0.7rem]" /> Guardar Mis Cambios
          </Button>
        </div>

        {/* Jornada */}
        <div className="bg-slate-900 rounded-[0.75rem] border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-[0.5rem] bg-slate-950/40 border-b border-slate-800 text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 text-center">
            Jornada de Apertura — Viernes 12 de Junio
          </div>
          
          <div className="divide-y divide-slate-800/60">
            {PARTIDOS.map((partido) => {
              const apuesta = apuestas[partido.id] || { opcion: "", golesLocal: "", golesVisita: "" }
              
              return (
                <div key={partido.id} className="p-[0.75rem] space-y-[0.75rem]">
                  
                  {/* EQUIPOS - color azul celeste */}
                  <div className="text-center font-black tracking-wide border-b border-slate-800/60 pb-[0.5rem]">
                    <span className="text-[0.875rem] uppercase text-sky-400">
                      {partido.banderaLocal} {partido.local} <span className="text-yellow-600 mx-1">vs</span> {partido.visitante} {partido.banderaVisitante}
                    </span>
                  </div>

                  {/* SUBTÍTULO: fecha, hora, estadio, ciudad, país */}
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

                  {/* 1ra. APUESTA: RESULTADO */}
                  <div className="bg-slate-950/30 rounded-[0.6rem] border border-slate-800/50 py-2">
                    <div className="text-center mb-2">
                      <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500">
                        1ra. Apuesta: Resultado
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center max-w-sm mx-auto">
                      {/* LOCAL */}
                      <div className="flex flex-col items-center">
                        <span className="text-[0.55rem] font-bold text-green-400 uppercase mb-1">LOCAL</span>
                        <button 
                          onClick={() => estamparSello(partido.id, "L")} 
                          className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-[1.8rem] transition-all duration-300 hover:scale-110"
                        >
                          {apuesta.opcion === "L" ? "🌐" : "🌍"}
                        </button>
                      </div>

                      {/* EMPATE */}
                      <div className="flex flex-col items-center">
                        <span className="text-[0.55rem] font-bold text-yellow-400 uppercase mb-1">EMPATE</span>
                        <button 
                          onClick={() => estamparSello(partido.id, "E")} 
                          className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-[1.8rem] transition-all duration-300 hover:scale-110"
                        >
                          {apuesta.opcion === "E" ? "🌐" : "🌍"}
                        </button>
                      </div>

                      {/* VISITA */}
                      <div className="flex flex-col items-center">
                        <span className="text-[0.55rem] font-bold text-blue-400 uppercase mb-1">VISITA</span>
                        <button 
                          onClick={() => estamparSello(partido.id, "V")} 
                          className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-[1.8rem] transition-all duration-300 hover:scale-110"
                        >
                          {apuesta.opcion === "V" ? "🌐" : "🌍"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2da. APUESTA: MARCADOR */}
                  <div className="bg-slate-950/50 p-[0.75rem] rounded-[0.6rem] border border-slate-800">
                    <div className="border-b border-slate-800/80 pb-1 text-center">
                      <span className="text-[0.65rem] font-black tracking-widest uppercase text-yellow-500">
                        2da. Apuesta: Marcador
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-4 max-w-xs mx-auto pt-2">
                      <div className="text-center">
                        <label className="text-[0.55rem] font-bold text-green-400 uppercase tracking-wider block">{partido.local.split(' ')[0]}</label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="0"
                          value={apuesta.golesLocal}
                          onChange={(e) => handleGoles(partido.id, "golesLocal", e.target.value)}
                          className="bg-slate-950 border-slate-800 text-center text-[0.9rem] font-black text-white focus-visible:ring-sky-500 h-[2.2rem] rounded-[0.5rem] p-0 w-14 mx-auto"
                        />
                      </div>
                      <div className="text-slate-600 font-bold text-[0.8rem]">X</div>
                      <div className="text-center">
                        <label className="text-[0.55rem] font-bold text-blue-400 uppercase tracking-wider block">{partido.visitante.split(' ')[0]}</label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="0"
                          value={apuesta.golesVisita}
                          onChange={(e) => handleGoles(partido.id, "golesVisita", e.target.value)}
                          className="bg-slate-950 border-slate-800 text-center text-[0.9rem] font-black text-white focus-visible:ring-sky-500 h-[2.2rem] rounded-[0.5rem] p-0 w-14 mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Botón guardar flotante */}
        <div className="sticky bottom-4 mt-4 flex justify-center">
          <Button 
            onClick={guardarGiro}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black gap-2 px-[1rem] py-[0.5rem] text-[0.75rem] shadow-xl rounded-[0.6rem]"
          >
            <Save className="h-[0.9rem] w-[0.9rem]" />
            💾 Guardar Todos mis Pronósticos
          </Button>
        </div>
      </div>
    </div>
  )
}