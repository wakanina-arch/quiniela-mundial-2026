"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trophy, Users, ArrowRight, Star, LayoutDashboard, MapPin, Calendar, Clock, Newspaper, X, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { obtenerPartidosActualizados, BANDERAS, type PartidoReal } from "@/lib/partidosMundial"

// Obtener fecha actual en formato YYYY-MM-DD (zona horaria America/New_York)
const getTodayEST = (): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
};

// Lógica temporal: VS (hasta 20' antes), Pendiente (desde 20' antes hasta 30' después del final)
const obtenerEstadoVisual = (partido: PartidoReal) => {
  const ahora = Date.now();
  const inicio = partido.timestamp;
  const veinteAntes = inicio - 20 * 60 * 1000;
  const finPartido = inicio + 90 * 60 * 1000;
  const finMargen = finPartido + 30 * 60 * 1000;

  // Si ya hay resultado real (jugado true)
  if (partido.jugado) {
    return {
      mostrarMarcador: true,
      textoEstado: "Finalizado",
      colorTexto: "text-green-400",
      fondo: "bg-green-950/30"
    };
  }

  // Período "Pendiente": desde 20' antes hasta 30' después de finalizado
  if (ahora >= veinteAntes && ahora <= finMargen) {
    return {
      mostrarPendiente: true,
      textoEstado: "Pendiente",
      colorTexto: "text-yellow-400",
      fondo: "bg-yellow-950/20"
    };
  }

  // Antes de 20' antes del inicio -> VS
  if (ahora < veinteAntes) {
    return {
      mostrarVS: true,
      textoEstado: "Próximo",
      colorTexto: "text-yellow-500",
      fondo: "bg-slate-800"
    };
  }

  // Después de finMargen sin resultado -> también Pendiente (por si acaso)
  if (ahora > finMargen && !partido.jugado) {
    return {
      mostrarPendiente: true,
      textoEstado: "Pendiente (sin resultado)",
      colorTexto: "text-yellow-400",
      fondo: "bg-yellow-950/20"
    };
  }

  // Por defecto (no debería ocurrir)
  return { mostrarVS: true, textoEstado: "Próximo", colorTexto: "text-yellow-500", fondo: "bg-slate-800" };
};

export default function Home() {
  const router = useRouter()
  const [activarSplash, setActivarSplash] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [partidosHoy, setPartidosHoy] = useState<PartidoReal[]>([])
  const [fechaFormateada, setFechaFormateada] = useState("")

  useEffect(() => {
    const cargarPartidosDelDia = () => {
      const hoy = getTodayEST()
      const fechaObj = new Date(hoy)
      setFechaFormateada(fechaObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))

      const todosPartidos = obtenerPartidosActualizados()
      const partidosHoy = todosPartidos.filter(p => p.fecha === hoy)
      setPartidosHoy(partidosHoy)
      setCargando(false)
    }

    cargarPartidosDelDia()
    const interval = setInterval(cargarPartidosDelDia, 5 * 60 * 1000) // Actualizar cada 5 minutos
    return () => clearInterval(interval)
  }, [])

  if (cargando) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <div className="text-yellow-500 text-xl animate-pulse">Cargando Quiniela...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      {/* HEADER NAVBAR */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-800 bg-slate-900 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span className="font-bold text-white hidden sm:inline">Quiniela Mundialista 2026</span>
        </div>
        <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/ranking" className="gap-1 flex items-center"><Users className="h-4 w-4 text-sky-400" /> Rankings</Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/rondas" className="gap-1 flex items-center"><LayoutDashboard className="h-4 w-4 text-yellow-500" />Rondas</Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/Tclasificacion" className="gap-1 flex items-center"><Star className="h-4 w-4 text-purple-400" /> Clasificación</Link>
          </Button>
          <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/noticias" className="gap-1 flex items-center"><Newspaper className="h-4 w-4 text-green-400" /> Noticias</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center">
          <div className="container px-4 mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Trophy className="h-10 w-10 text-yellow-500 animate-pulse" />
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
                Quiniela Mundialista 2026
              </h1>
            </div>
            <p className="text-slate-400 text-lg mt-2">
              Demuestra cuánto sabes de fútbol y compite con amigos
            </p>
            <div className="mt-6">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white gap-2 font-bold shadow-lg shadow-sky-600/10" asChild>
                <Link href="/quiniela">
                  Llenar mi Quiniela <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* PARTIDOS DE HOY */}
        <section className="w-full py-10 bg-slate-950 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-green-400 flex items-center gap-2 mb-6">
              <Calendar className="h-4 w-4" /> PARTIDOS DE HOY - {fechaFormateada}
            </h2>
            {partidosHoy.length === 0 ? (
              <div className="text-center text-slate-400 py-12">
                <Trophy className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                <p>No hay encuentros oficiales programados para hoy.</p>
                <p className="text-sm mt-2">¡Aprovecha para repasar tus tácticas!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {partidosHoy.map((partido) => {
                  const estado = obtenerEstadoVisual(partido);
                  const mostrarMarcador = estado.mostrarMarcador;
                  const mostrarVS = estado.mostrarVS;
                  const mostrarPendiente = estado.mostrarPendiente;

                  return (
                    <div key={partido.id} className={`bg-slate-900 rounded-xl border overflow-hidden shadow-lg transition-all ${estado.fondo}`}>
                      <div className="p-4 bg-slate-950/40 border-b border-slate-800">
                        <div className="text-center font-bold text-sky-400 text-sm">Grupo {partido.grupo}</div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3 text-center font-bold text-base">
                          <div className="flex-1 text-right">
                            <span className="text-lg mr-1">{BANDERAS[partido.local] || "🏳️"}</span>
                            <span className="text-slate-100">{partido.local}</span>
                          </div>
                          {mostrarMarcador ? (
                            <div className="text-yellow-500 font-black text-base px-2 py-1 bg-slate-800 rounded">
                              {partido.golesLocal} - {partido.golesVisitante}
                            </div>
                          ) : mostrarVS ? (
                            <div className="text-yellow-500 font-black text-xs px-2 py-1 bg-slate-800 rounded">VS</div>
                          ) : mostrarPendiente ? (
                            <div className="text-yellow-400 font-black text-xs px-2 py-1 bg-yellow-950/40 rounded">Pendiente</div>
                          ) : (
                            <div className="text-yellow-500 font-black text-xs px-2 py-1 bg-slate-800 rounded">VS</div>
                          )}
                          <div className="flex-1 text-left">
                            <span className="text-lg mr-1">{BANDERAS[partido.visitante] || "🏳️"}</span>
                            <span className="text-slate-100">{partido.visitante}</span>
                          </div>
                        </div>
                        <div className="mt-3 text-center text-xs text-slate-400 flex flex-wrap justify-center gap-2">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {partido.horaLocal} ET / {partido.horaEspana} ES</span>
                        </div>
                        <div className="mt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
                          <MapPin className="h-3 w-3" /> {partido.estadio}, {partido.ciudad}
                        </div>
                        {mostrarPendiente && (
                          <div className="mt-1 text-center text-[8px] text-yellow-400/70">
                            (Resultado no oficial)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Datos oficiales actualizados según FIFA</p>
      </footer>

      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setActivarSplash(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-pulse"
        >
          <PartyPopper className="h-5 w-5" />
          Participa / Vive la aventura
        </button>
      </div>

      {/* MODAL SPLASH */}
      {activarSplash && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl max-w-md w-full text-center p-8 border border-yellow-500/30 relative">
            <button onClick={() => setActivarSplash(false)} className="absolute top-4 right-4 text-slate-500"><X className="h-5 w-5" /></button>
            <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-black text-white mb-2">QUINIELA MUNDIAL 2026</h2>
            <p className="text-slate-300 text-sm mb-6">JUEGO 100% GRATUITO DE ESTRATEGIA</p>
            <div className="flex flex-col gap-3 mb-8">
              <div className="bg-slate-800/50 p-2 rounded-lg">⚽️ 10 balones gratis</div>
              <div className="bg-slate-800/50 p-2 rounded-lg">🏉 Comodín</div>
              <div className="bg-slate-800/50 p-2 rounded-lg">🏆 Tickets Mundial</div>
            </div>
            <Button onClick={() => { setActivarSplash(false); router.push("/registro"); }} className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black py-3 rounded-lg">
              Comenzar Aventura <PartyPopper className="h-5 w-5 inline" />
            </Button>
            <p className="text-[10px] text-slate-600 mt-6">Juego gratuito. Sin dinero real. +13 años.</p>
          </div>
        </div>
      )}
    </div>
  )
}