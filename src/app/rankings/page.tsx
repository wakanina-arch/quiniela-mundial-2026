"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, Users, ArrowLeft, Crown, Target, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UsuarioRanking {
  id: string
  nombre: string
  email: string
  numeroJugador: number
  puntosTotales: number
  golesAcertados: number
  apuestasRealizadas: number
  aciertosResultado: number
  aciertosMarcador: number
}

export default function ClasificacionPage() {
  const [usuarios, setUsuarios] = useState<UsuarioRanking[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState<"puntos" | "goles">("puntos")

  useEffect(() => {
    // Cargar usuarios registrados y calcular sus puntos
    const cargarUsuarios = () => {
      const usuariosRegistrados: UsuarioRanking[] = []
      
      // Buscar todos los usuarios guardados en localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("jugador_")) {
          const usuarioData = localStorage.getItem(key)
          if (usuarioData) {
            const usuario = JSON.parse(usuarioData)
            
            // Buscar apuestas del usuario
            const apuestasGuardadas = localStorage.getItem("quiniela_apuestas_v2")
            let puntosTotales = 0
            let golesAcertados = 0
            let apuestasRealizadas = 0
            let aciertosResultado = 0
            let aciertosMarcador = 0
            
            if (apuestasGuardadas) {
              const data = JSON.parse(apuestasGuardadas)
              const apuestas = data.resultado || {}
              
              // Calcular puntos de cada apuesta (simulado)
              Object.values(apuestas).forEach((apuesta: any) => {
                if (apuesta.aceptada) {
                  apuestasRealizadas++
                  
                  // Puntos por resultado (1 punto por acierto)
                  if (apuesta.L || apuesta.E || apuesta.V) {
                    aciertosResultado++
                    puntosTotales += 1
                  }
                  
                  // Puntos por goles (2 puntos por acierto)
                  if (apuesta.golesLocal && parseInt(apuesta.golesLocal) > 0) {
                    aciertosMarcador++
                    golesAcertados += parseInt(apuesta.golesLocal)
                    puntosTotales += 2
                  }
                  if (apuesta.golesVisita && parseInt(apuesta.golesVisita) > 0) {
                    golesAcertados += parseInt(apuesta.golesVisita)
                    puntosTotales += 2
                  }
                }
              })
            }
            
            usuariosRegistrados.push({
              id: key.replace("jugador_", ""),
              nombre: usuario.nombre,
              email: usuario.email,
              numeroJugador: usuario.numeroJugador,
              puntosTotales,
              golesAcertados,
              apuestasRealizadas,
              aciertosResultado,
              aciertosMarcador
            })
          }
        }
      }
      
      // Ordenar por puntos (por defecto)
      usuariosRegistrados.sort((a, b) => b.puntosTotales - a.puntosTotales)
      setUsuarios(usuariosRegistrados)
      setCargando(false)
    }
    
    cargarUsuarios()
  }, [])

  const ordenarPorPuntos = () => {
    setFiltro("puntos")
    const ordenados = [...usuarios].sort((a, b) => b.puntosTotales - a.puntosTotales)
    setUsuarios(ordenados)
  }

  const ordenarPorGoles = () => {
    setFiltro("goles")
    const ordenados = [...usuarios].sort((a, b) => b.golesAcertados - a.golesAcertados)
    setUsuarios(ordenados)
  }

  const getMedalla = (posicion: number) => {
    switch (posicion) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Crown className="h-5 w-5 text-slate-400" />
      case 2:
        return <Crown className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-slate-500 text-sm font-bold">{posicion + 1}</span>
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Cargando clasificación...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-sky-400" />
          Ranking de Participantes
        </h1>
        <div className="w-5"></div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Filtros */}
          <div className="flex gap-3 mb-6 justify-center">
            <Button 
              onClick={ordenarPorPuntos}
              className={`gap-2 ${filtro === "puntos" ? "bg-yellow-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
            >
              <Trophy className="h-4 w-4" />
              Por Puntos
            </Button>
            <Button 
              onClick={ordenarPorGoles}
              className={`gap-2 ${filtro === "goles" ? "bg-yellow-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
            >
              <Target className="h-4 w-4" />
              Por Goles
            </Button>
          </div>

          {/* Tabla de ranking */}
          {usuarios.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              <Users className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <p>Todavía no hay participantes</p>
              <p className="text-sm mt-2">¡Sé el primero en participar!</p>
              <Link href="/quiniela">
                <Button className="mt-4 bg-yellow-500 text-slate-950">
                  Ir a la Quiniela
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr className="border-b border-slate-700">
                      <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Pos</th>
                      <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Participante</th>
                      <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        Puntos
                      </th>
                      <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Target className="h-3 w-3 inline mr-1" />
                        Goles
                      </th>
                      <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Apuestas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario, idx) => (
                      <tr key={usuario.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 text-left">
                          <div className="flex items-center gap-2">
                            {getMedalla(idx)}
                          </div>
                        </td>
                        <td className="p-4 text-left">
                          <div>
                            <p className="font-bold text-white">{usuario.nombre}</p>
                            <p className="text-xs text-slate-500">#{usuario.numeroJugador}</p>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-xl font-black text-yellow-500">{usuario.puntosTotales}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-xl font-black text-sky-400">{usuario.golesAcertados}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-slate-300">{usuario.apuestasRealizadas}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leyenda */}
          <div className="mt-6 bg-slate-800/30 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-400">
              🏆 <span className="text-yellow-500">1 punto! </span> por acierto de resultado (Local/Empate/Visita) | 
              ⚽ <span className="text-sky-400"> 1 gol! </span> por cada gol acertado
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}