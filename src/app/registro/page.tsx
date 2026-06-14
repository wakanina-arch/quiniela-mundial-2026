"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, AlertCircle, Trophy } from "lucide-react"

export default function RegistroPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!nombre || nombre.length < 3 || nombre.length > 20) {
      setError("El nombre debe tener entre 3 y 20 caracteres")
      setLoading(false)
      return
    }

    // Crear ID único
    const id = Date.now().toString()
    
    // Guardar en localStorage en arquetipoData (formato que espera quiniela)
    const arquetipoData = {
      id: id,
      nombre: nombre,
      balones: 10,
      balonesRugby: 0,
      ticketsMundialista: 0,
      fechaRegistro: new Date().toISOString()
    }
    
    localStorage.setItem("arquetipoId", id)
    localStorage.setItem("arquetipoData", JSON.stringify(arquetipoData))
    
    console.log("Datos guardados:", arquetipoData)

    // Redirigir a quiniela
    router.push("/quiniela")
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <h1 className="text-2xl font-black text-white">Elige tu Arquetipo</h1>
          <p className="text-slate-400 text-sm">Nombre único (3-20 caracteres)</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Ej. ElCrackDelBalon"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            disabled={loading}
            autoComplete="off"
          />
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black py-3 rounded-lg transition"
          >
            {loading ? "Creando..." : "Comenzar aventura 🎈"}
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-6">
          Al registrarte aceptas las reglas del juego. Sin dinero real.
        </p>
      </div>
    </div>
  )
}
