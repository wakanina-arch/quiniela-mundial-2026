"use client"

import { useState, useEffect } from "react"
import { Calendar, Save, LayoutGrid, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Partido {
  id: string
  fase: string
  grupo: string | null
  equipoLocal: string
  equipoVisita: string
  fecha: string
}

export default function QuinielaForm({ partidos }: { partidos: Partido[] }) {
  const [loading, setLoading] = useState(false)
  const [pronosticos, setPronosticos] = useState<Record<string, { local: string; visita: string }>>({})

  // Agrupar los partidos por días formateados
  const fechasUnicas = Array.from(
    new Set(partidos.map((p) => new Date(p.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })))
  )

  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("")

  useEffect(() => {
    if (fechasUnicas.length > 0 && !fechaSeleccionada) {
      setFechaSeleccionada(fechasUnicas[0])
    }
  }, [fechasUnicas, fechaSeleccionada])

  const handleInputChange = (partidoId: string, campo: "local" | "visita", valor: string) => {
    const limpio = valor.replace(/[^0-9]/g, "")
    setPronosticos((prev) => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        [campo]: limpio
      },
    }))
  }

  const guardarQuiniela = async () => {
    setLoading(true)
    const payload = Object.entries(pronosticos)
      .filter(([_, marcas]) => marcas.local !== "" && marcas.visita !== "")
      .map(([partidoId, marcas]) => ({
        partidoId,
        golesLocal: parseInt(marcas.local, 10),
        golesVisita: parseInt(marcas.visita, 10),
      }))

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error("Error al guardar en el servidor")
      alert("📝 ¡Marcadores registrados en tu Quiniela!")
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const partidosDelDia = partidos.filter(
    (p) => new Date(p.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) === fechaSeleccionada
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Cabecera Principal */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2 text-white tracking-tight uppercase">
              <LayoutGrid className="h-5 w-5 text-sky-500" /> CALENDARIO MUNDIAL
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Haz clic en los días para rellenar tus pronósticos directamente sobre la planilla digital.
            </p>
          </div>
          <Button 
            onClick={guardarQuiniela} 
            disabled={loading} 
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 shadow-md gap-2 rounded-lg"
          >
            <Save className="h-4 w-4" />
            {loading ? "Guardando..." : "Guardar Mis Cambios"}
          </Button>
        </div>

        {/* Filtro de Días Estilo Tarjeta Horizontal */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {fechasUnicas.map((fecha) => (
            <button
              key={fecha}
              onClick={() => setFechaSeleccionada(fecha)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider border transition-all ${
                fechaSeleccionada === fecha
                  ? "bg-sky-600 border-sky-500 text-white shadow"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {fecha}
            </button>
          ))}
        </div>

        {/* Planilla de Partidos Compacta */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Encuentros Programados</span>
            <span className="text-sky-400">{fechaSeleccionada}</span>
          </div>
          <div className="divide-y divide-slate-800/60">
            {partidosDelDia.map((partido) => (
              <div key={partido.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-850/20 transition-colors">
                
                {/* Bloque Local */}
                <div className="flex-1 text-right font-bold text-sm sm:text-base text-slate-100 truncate">
                  {partido.equipoLocal}
                </div>

                {/* Casillas de Marcador Centrales */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800 shadow-inner">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={pronosticos[partido.id]?.local || ""}
                    onChange={(e) => handleInputChange(partido.id, "local", e.target.value)}
                    className="w-10 h-8 bg-slate-900 border-slate-700 text-center font-black text-white text-sm focus-visible:ring-sky-500 p-0 rounded"
                    placeholder="-"
                  />
                  <span className="text-slate-600 font-bold text-xs px-0.5">X</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={pronosticos[partido.id]?.visita || ""}
                    onChange={(e) => handleInputChange(partido.id, "visita", e.target.value)}
                    className="w-10 h-8 bg-slate-900 border-slate-700 text-center font-black text-white text-sm focus-visible:ring-sky-500 p-0 rounded"
                    placeholder="-"
                  />
                </div>

                {/* Bloque Visitante */}
                <div className="flex-1 text-left font-bold text-sm sm:text-base text-slate-100 truncate">
                  {partido.equipoVisita}
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
