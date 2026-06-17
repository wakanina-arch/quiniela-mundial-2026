"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, Users, ArrowLeft, Medal, TrendingUp, Target, Award, RefreshCw } from "lucide-react"

interface Jugador {
  id: string
  nombre: string
  balones: number
  medallas: number
  copas: number
  totalApuestas: number
  aciertos: number
  efectividad: number
}

// Datos de ejemplo
const JUGADORES_EJEMPLO: Jugador[] = [
  { id: "1", nombre: "ElCrackDelBalon", balones: 10, medallas: 3, copas: 0, totalApuestas: 8, aciertos: 6, efectividad: 75 },
  { id: "2", nombre: "GoleadorLegend", balones: 8, medallas: 2, copas: 1, totalApuestas: 10, aciertos: 7, efectividad: 70 },
  { id: "3", nombre: "ReyDelEmpate", balones: 9, medallas: 1, copas: 0, totalApuestas: 7, aciertos: 5, efectividad: 71.4 },
]

export default function RankingPage() {
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [cargando, setCargando] = useState(true)
  const [categoria, setCategoria] = useState<"general" | "puntos" | "goles" | "final">("general")

  useEffect(() => {
    const usuarioActual = localStorage.getItem("jugador_actual")
    if (usuarioActual) {
      const actual = JSON.parse(usuarioActual)
      setJugadores([{
        id: actual.id,
        nombre: actual.nombre,
        balones: actual.balones || 10,
        medallas: actual.medallas || 0,
        copas: actual.copas || 0,
        totalApuestas: actual.totalApuestas || 0,
        aciertos: actual.aciertos || 0,
        efectividad: actual.totalApuestas ? (actual.aciertos / actual.totalApuestas) * 100 : 0
      }])
    } else {
      setJugadores(JUGADORES_EJEMPLO)
    }
    setCargando(false)
  }, [])

  const ordenarJugadores = (lista: Jugador[]) => {
    if (categoria === "general") return [...lista].sort((a, b) => b.balones - a.balones)
    if (categoria === "puntos") return [...lista].sort((a, b) => b.aciertos - a.aciertos)
    if (categoria === "goles") return [...lista].sort((a, b) => b.medallas - a.medallas)
    return [...lista].sort((a, b) => b.copas - a.copas)
  }

  const jugadoresOrdenados = ordenarJugadores(jugadores)

  if (cargando) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-yellow-500 text-xl">Cargando...</div></div>
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/home" className="text-slate-300 hover:text-white flex items-center gap-2"><ArrowLeft className="h-5 w-5" /> Volver</Link>
          <div className="flex items-center gap-2"><Users className="h-5 w-5 text-sky-400" /><span className="text-white font-bold">Ranking de Jugadores</span></div>
          <div className="w-5"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setCategoria("general")} className={`px-4 py-2 rounded-lg font-bold ${categoria === "general" ? "bg-yellow-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}><Trophy className="h-4 w-4 inline mr-1" /> General</button>
          <button onClick={() => setCategoria("puntos")} className={`px-4 py-2 rounded-lg font-bold ${categoria === "puntos" ? "bg-yellow-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}><TrendingUp className="h-4 w-4 inline mr-1" /> Puntos</button>
          <button onClick={() => setCategoria("goles")} className={`px-4 py-2 rounded-lg font-bold ${categoria === "goles" ? "bg-yellow-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}><Target className="h-4 w-4 inline mr-1" /> Goles</button>
          <button onClick={() => setCategoria("final")} className={`px-4 py-2 rounded-lg font-bold ${categoria === "final" ? "bg-yellow-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}><Award className="h-4 w-4 inline mr-1" /> Final</button>
        </div>

        {/* Tabla */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr><th className="p-4 text-left">#</th><th className="p-4 text-left">Jugador</th><th className="p-4 text-center">{categoria === "general" && "⚽️ Balones"}{categoria === "puntos" && "🎯 Aciertos"}{categoria === "goles" && "🏵 Medallas"}{categoria === "final" && "🏆 Copas"}</th><th className="p-4 text-center">Efectividad</th></tr></thead>
              <tbody className="divide-y divide-slate-800">
                {jugadoresOrdenados.map((j, idx) => (<tr key={j.id} className="hover:bg-slate-800/30"><td className="p-4 font-bold">{idx === 0 ? "👑" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx+1}`}</td><td className="p-4 text-white">{j.nombre}</td><td className="p-4 text-center font-bold text-yellow-400">{categoria === "general" && j.balones}{categoria === "puntos" && j.aciertos}{categoria === "goles" && j.medallas}{categoria === "final" && j.copas}</td><td className="p-4 text-center"><span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">{Math.round(j.efectividad)}%</span></td></tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
