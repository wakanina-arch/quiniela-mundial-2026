import { useState, useEffect } from "react"

interface PartidoReal {
  id: string
  grupo: string
  local: string
  visitante: string
  golesLocal: number
  golesVisitante: number
  jugado: boolean
  fecha: string
  hora: string
  estadio: string
  ciudad: string
  pais: string
  ronda: number
}

export function usePartidosHoy() {
  const [partidosHoy, setPartidosHoy] = useState<PartidoReal[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fechaActual, setFechaActual] = useState("")

  useEffect(() => {
    let activo = true

    const cargarPartidos = async () => {
      try {
        const hoy = new Date()
        // Formato YYYY-MM-DD para comparar con la fecha de los partidos
        const fechaISO = hoy.toISOString().split("T")[0]
        setFechaActual(fechaISO)

        const response = await fetch("/api/partidos")

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los partidos`)
        }

        const data = await response.json()
        
        if (!Array.isArray(data)) {
          throw new Error("Los datos recibidos no son válidos")
        }

        // Filtrar partidos que son de hoy o que son futuros pero más cercanos
        const partidosDelDia = data.filter((p: PartidoReal) => p.fecha === fechaISO)
        
        // También mostrar partidos que ya pasaron pero son del día actual
        const partidosOrdenados = partidosDelDia.sort((a, b) => {
          const horaA = parseInt(a.hora.split(":")[0])
          const horaB = parseInt(b.hora.split(":")[0])
          return horaA - horaB
        })

        if (activo) {
          setPartidosHoy(partidosOrdenados)
          setError(null)
        }
      } catch (err) {
        console.error("Error cargando partidos:", err)
        if (activo) {
          setError(err instanceof Error ? err.message : "Error desconocido al cargar los partidos")
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarPartidos()

    return () => {
      activo = false
    }
  }, [])

  return { partidosHoy, cargando, error, fechaActual }
}
