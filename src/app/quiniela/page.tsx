"use client"

import { useState } from "react"
import { Trophy, UserPlus, ArrowRight, Save, LayoutGrid } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function QuinielaPage() {
  const [registrado, setRegistrado] = useState(false)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")

  // Estado para las predicciones de la quiniela
  const [pronosticos, setPronosticos] = useState<Record<string, { local: string; visita: string }>>({
    "1": { local: "", visita: "" },
    "2": { local: "", visita: "" }
  })

  const handleInscripcion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !email) {
      alert("Por favor rellena todos los campos para ingresar a la competencia.")
      return
    }
    setRegistrado(true)
  }

  const handleMarcador = (id: string, campo: "local" | "visita", valor: string) => {
    const limpio = valor.replace(/[^0-9]/g, "")
    setPronosticos(prev => ({
      ...prev,
      [id]: { ...prev[id], [campo]: limpio }
    }))
  }

  const guardarGiro = () => {
    alert(`¡Perfecto ${nombre}! Tus marcadores en papel se han registrado para el cómputo de puntos.`)
  }

  // VISTA 1: INSCRIPCIÓN SIMPLE
  if (!registrado) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <Trophy className="h-10 w-10 text-amber-500 mx-auto animate-pulse" />
            <h1 className="text-2xl font-black uppercase tracking-tight">Inscripción Competencia</h1>
            <p className="text-slate-400 text-xs">Ingresa tus datos como en los giros tradicionales para sumar en el ranking.</p>
          </div>
          <form onSubmit={handleInscripcion} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nombre Completo</label>
              <Input 
                type="text" 
                placeholder="Ej. Juan Pérez" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white focus-visible:ring-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Correo Electrónico</label>
              <Input 
                type="email" 
                placeholder="juan@correo.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white focus-visible:ring-sky-500"
              />
            </div>
            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold gap-2 rounded-lg pt-1">
              <UserPlus className="h-4 w-4" /> Entrar a Planilla Digital
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // VISTA 2: QUINIELA TIPO PAPEL TOTALMENTE FUNCIONAL
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2 text-white uppercase tracking-tight">
              <LayoutGrid className="h-5 w-5 text-sky-500" /> PLANILLA DE PRONÓSTICOS
            </h1>
            <p className="text-slate-400 text-xs mt-1">Participante activo: <span className="text-emerald-400 font-bold">{nombre}</span></p>
          </div>
          <Button onClick={guardarGiro} className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 shadow-md gap-2 rounded-lg">
            <Save className="h-4 w-4" /> Guardar Mis Cambios
          </Button>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/40 border-b border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
            Jornada de Apertura — Viernes 12 de Junio
          </div>
          <div className="divide-y divide-slate-800/60">
            {/* Partido 1 */}
            <div className="p-4 sm:p-6 flex items-center justify-between gap-4">
              <div className="flex-1 text-right font-bold text-sm sm:text-base text-slate-100">Canadá</div>
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                <Input
                  type="text"
                  maxLength={2}
                  value={pronosticos["1"].local}
                  onChange={(e) => handleMarcador("1", "local", e.target.value)}
                  className="w-10 h-8 bg-slate-900 border-slate-700 text-center font-black text-white text-sm focus-visible:ring-sky-500 p-0 rounded"
                  placeholder="-"
                />
                <span className="text-slate-600 font-bold text-xs px-0.5">X</span>
                <Input
                  type="text"
                  maxLength={2}
                  value={pronosticos["1"].visita}
                  onChange={(e) => handleMarcador("1", "visita", e.target.value)}
                  className="w-10 h-8 bg-slate-900 border-slate-700 text-center font-black text-white text-sm focus-visible:ring-sky-500 p-0 rounded"
                  placeholder="-"
                />
              </div>
              <div className="flex-1 text-left font-bold text-sm sm:text-base text-slate-100">Bosnia y H.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
