"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Lock, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// Listado de ejemplo de selecciones clasificadas
const PAISES = ["México", "Estados Unidos", "Canadá", "Argentina", "Brasil", "Francia", "España", "Alemania", "Inglaterra", "Portugal"]

export default function BonusPage() {
  const { toast } = useToast()
  const [isLocked, setIsLocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [top4, setTop4] = useState({
    campeon: "",
    subcampeon: "",
    tercero: "",
    cuarto: ""
  })

  useEffect(() => {
    // FECHA LÍMITE: Partido inaugural - 11 de Junio de 2026
    const fechaLimite = new Date("2026-06-11T16:00:00.000Z")
    if (new Date() >= fechaLimite) {
      setIsLocked(true)
    }
  }, [])

  const handleSelect = (posicion: string, valor: string) => {
    setTop4(prev => ({ ...prev, [posicion]: valor }))
  }

  // Filtrar países para que no se puedan duplicar en los selectores
  const getOpcionesDisponibles = (actual: string) => {
    const seleccionados = Object.values(top4).filter(v => v !== "" && v !== actual)
    return PAISES.filter(pais => !seleccionados.includes(pais))
  }

  const guardarBonus = async () => {
    if (!top4.campeon || !top4.subcampeon || !top4.tercero || !top4.cuarto) {
      toast({
        variant: "destructive",
        title: "Selección incompleta",
        description: "Debes asignar los 4 puestos obligatoriamente."
      })
      return
    }

    setLoading(true)
    try {
      // Simulación de envío a la API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "¡Bonus registrado!",
        description: "Tu predicción del Top 4 ha sido guardada."
      })
    } catch (error) {
      toast({ variant: "destructive", title: "Error al guardar" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <Card className="border-slate-200 dark:border-slate-800 shadow-md">
        <CardHeader className="text-center border-b bg-slate-50/50 dark:bg-slate-900/50">
          <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-2 animate-bounce" />
          <CardTitle className="text-2xl font-bold">Predicción del Top 4 Final</CardTitle>
          <CardDescription>
            Elige las posiciones exactas de los 4 finalistas del torneo.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {isLocked && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-3 text-sm font-medium border border-destructive/20">
              <Lock className="h-5 w-5 shrink-0" />
              El torneo ya ha comenzado. Este formulario se encuentra bloqueado de forma definitiva.
            </div>
          )}

          <div className="space-y-4">
            {/* Campeón */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Campeón</label>
                <Select disabled={isLocked} value={top4.campeon} onValueChange={(v) => handleSelect("campeon", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecciona País" /></SelectTrigger>
                  <SelectContent>
                    {getOpcionesDisponibles(top4.campeon).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subcampeón */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-400/10 flex items-center justify-center text-slate-400 shrink-0">
                <Medal className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Subcampeón</label>
                <Select disabled={isLocked} value={top4.subcampeon} onValueChange={(v) => handleSelect("subcampeon", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecciona País" /></SelectTrigger>
                  <SelectContent>
                    {getOpcionesDisponibles(top4.subcampeon).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tercer Puesto */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-700/10 flex items-center justify-center text-amber-700 shrink-0">
                <Medal className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Tercer Puesto</label>
                <Select disabled={isLocked} value={top4.tercero} onValueChange={(v) => handleSelect("tercero", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecciona País" /></SelectTrigger>
                  <SelectContent>
                    {getOpcionesDisponibles(top4.tercero).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cuarto Puesto */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Cuarto Puesto</label>
                <Select disabled={isLocked} value={top4.cuarto} onValueChange={(v) => handleSelect("cuarto", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecciona País" /></SelectTrigger>
                  <SelectContent>
                    {getOpcionesDisponibles(top4.cuarto).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button 
            onClick={guardarBonus} 
            disabled={isLocked || loading} 
            className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2 mt-4"
          >
            <Save className="h-4 w-4" />
            {loading ? "Guardando..." : "Confirmar Mi Top 4"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
