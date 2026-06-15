"use client"

import { PartidoReal } from "@/types"
import { BANDERAS } from "@/constants/banderas"
import { Calendar, Clock, MapPin } from "lucide-react"

interface MatchCardProps {
  partido: PartidoReal
  fechaFormateada?: string
}

const getStatusBadge = (jugado: boolean, estado?: string) => {
  if (jugado) {
    return { text: "Finalizado", color: "bg-green-500/20 text-green-400", icon: "🟢" }
  }
  return { text: "Próximo", color: "bg-blue-500/20 text-blue-400", icon: "🔵" }
}

export function MatchCard({ partido }: MatchCardProps) {
  const status = getStatusBadge(partido.jugado)

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
      {/* Grupo y estado */}
      <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex justify-between items-center">
        <div className="text-center font-bold text-sky-400 text-sm">Grupo {partido.grupo}</div>
        <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.color}`}>
          {status.icon} {status.text}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Equipos y marcador */}
        <div className="flex items-center justify-between gap-3 text-center font-bold text-base">
          <div className="flex-1 text-right">
            <span className="text-lg mr-1">{BANDERAS[partido.local] || "🏳️"}</span>
            <span className="text-slate-100">{partido.local}</span>
          </div>
          {partido.jugado ? (
            <div className="text-yellow-500 font-black text-lg px-2 py-1 bg-slate-800 rounded">
              {partido.golesLocal} - {partido.golesVisitante}
            </div>
          ) : (
            <div className="text-slate-400 text-xs px-2 py-1 bg-slate-800 rounded flex flex-col items-center">
              <Clock className="h-3 w-3 mb-0.5" />
              {partido.hora} ET
            </div>
          )}
          <div className="flex-1 text-left">
            <span className="text-lg mr-1">{BANDERAS[partido.visitante] || "🏳️"}</span>
            <span className="text-slate-100">{partido.visitante}</span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-3 text-center text-xs text-slate-400 space-y-1">
          {!partido.jugado && (
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{new Date(partido.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{partido.estadio}, {partido.ciudad}</span>
          </div>
        </div>

        {partido.jugado && (
          <div className="mt-2 text-center text-[10px] text-green-400 font-semibold">✓ Partido finalizado</div>
        )}
      </div>
    </div>
  )
}
