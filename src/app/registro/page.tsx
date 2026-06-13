"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trophy, User, Mail, ArrowLeft, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegistroPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  // Verificar si ya existe usuario
  useEffect(() => {
    const usuario = localStorage.getItem("quiniela_usuario")
    if (usuario) {
      // Si ya está registrado, ir directamente a la quiniela
      router.push("/quiniela")
    }
  }, [router])

  const generarNumeroJugador = () => {
    // Generar número único de 6 dígitos
    return Math.floor(Math.random() * 900000) + 100000
  }

  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!nombre.trim()) {
      setError("Por favor ingresa tu nombre completo")
      return
    }

    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico")
      return
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Por favor ingresa un correo electrónico válido")
      return
    }

    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    setCargando(true)

    // Simular registro
    setTimeout(() => {
      const numeroJugador = generarNumeroJugador()
      
      const usuario = {
        id: Date.now(),
        nombre: nombre.trim(),
        email: email.trim(),
        numeroJugador: numeroJugador,
        fechaRegistro: new Date().toISOString(),
        registrado: true
      }

      localStorage.setItem("quiniela_usuario", JSON.stringify(usuario))
      localStorage.setItem(`jugador_${numeroJugador}`, JSON.stringify(usuario))
      
      setCargando(false)
      router.push("/quiniela")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-white flex items-center gap-2 mx-auto">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Registro de Participante
        </h1>
        <div className="w-5"></div>
      </header>

      <main className="flex items-center justify-center p-6 min-h-[calc(100vh-56px)]">
        <div className="max-w-md w-full">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-yellow-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Crea tu cuenta</h2>
              <p className="text-slate-400 text-sm mt-1">
                Regístrate para participar en la quiniela
              </p>
            </div>

            <form onSubmit={handleRegistro} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Ej. Edgar Jara"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                    disabled={cargando}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                    disabled={cargando}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terminos"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-yellow-500 focus:ring-yellow-500"
                />
                <label htmlFor="terminos" className="text-sm text-slate-400">
                  Acepto los{" "}
                  <button type="button" className="text-yellow-500 hover:underline">
                    términos y condiciones
                  </button>
                </label>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={cargando}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold py-2"
              >
                {cargando ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Registrando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Registrarse <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                Al registrarte obtendrás un número de jugador único
                <br />
                para participar en la quiniela.
              </p>
            </div>
          </div>

          {/* Info adicional */}
          <div className="mt-4 text-center text-xs text-slate-600">
            <p>💡 Registrarse es <span className="text-green-400">GRATUITO</span></p>
            <p className="mt-1">💰 Solo pagas cuando aceptas tus apuestas</p>
          </div>
        </div>
      </main>
    </div>
  )
}
