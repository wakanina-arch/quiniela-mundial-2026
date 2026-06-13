"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Newspaper, ExternalLink, RefreshCw, Globe, Tv, Radio, Twitter, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Noticia {
  id: string
  titulo: string
  resumen: string
  fuente: string
  fuenteIcono: string
  url: string
  timestamp: number
  categoria: string
}

// Fuentes de noticias del Mundial
const FUENTES = [
  { nombre: "FIFA", url: "https://www.fifa.com/fifaplus/es/articles", icono: "🏆", color: "bg-blue-600" },
  { nombre: "ESPN", url: "https://www.espn.com/soccer/", icono: "📺", color: "bg-red-600" },
  { nombre: "Marca", url: "https://www.marca.com/futbol/mundial/2026.html", icono: "📰", color: "bg-green-600" },
  { nombre: "AS", url: "https://as.com/futbol/internacional/", icono: "⚽", color: "bg-yellow-600" },
  { nombre: "Sport", url: "https://www.sport.es/es/mundial/", icono: "🇪🇸", color: "bg-blue-500" },
  { nombre: "Sky Sports", url: "https://www.skysports.com/football", icono: "🔵", color: "bg-sky-600" },
  { nombre: "BBC Sport", url: "https://www.bbc.com/sport/football", icono: "📻", color: "bg-red-700" },
  { nombre: "TUDN", url: "https://www.tudn.com/futbol/mundial", icono: "🇲🇽", color: "bg-green-700" }
]

// Noticias destacadas (simuladas, en producción vendrían de una API)
const NOTICIAS_DESTACADAS: Noticia[] = [
  {
    id: "1",
    titulo: "México arranca con victoria en el Mundial 2026",
    resumen: "El Tri derrotó 2-0 a Sudáfrica en el partido inaugural del Grupo A en el Estadio Azteca.",
    fuente: "ESPN",
    fuenteIcono: "📺",
    url: "https://www.espn.com/soccer/",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    categoria: "Resultados"
  },
  {
    id: "2",
    titulo: "Canadá empata en su debut mundialista",
    resumen: "La selección canadiense logró un valioso empate 1-1 ante Bosnia en Toronto.",
    fuente: "Marca",
    fuenteIcono: "📰",
    url: "https://www.marca.com/futbol/mundial/2026.html",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    categoria: "Resultados"
  },
  {
    id: "3",
    titulo: "Estados Unidos golea y se perfila como favorito",
    resumen: "El equipo local derrotó 4-1 a Paraguay en el SoFi Stadium de Los Ángeles.",
    fuente: "AS",
    fuenteIcono: "⚽",
    url: "https://as.com/futbol/internacional/",
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    categoria: "Destacados"
  },
  {
    id: "4",
    titulo: "Brasil vs Marruecos: duelo de candidatos hoy",
    resumen: "La Canarinha se enfrenta a los Leones del Atlas en el MetLife Stadium.",
    fuente: "Sport",
    fuenteIcono: "🇪🇸",
    url: "https://www.sport.es/es/mundial/",
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
    categoria: "Previa"
  }
]

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>(NOTICIAS_DESTACADAS)
  const [actualizando, setActualizando] = useState(false)
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(new Date())

  const actualizarNoticias = () => {
    setActualizando(true)
    // Simular carga de noticias (en producción sería fetch a API)
    setTimeout(() => {
      setUltimaActualizacion(new Date())
      setActualizando(false)
    }, 1000)
  }

  const formatearTiempo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const horas = Math.floor(diff / (1000 * 60 * 60))
    if (horas < 1) return "Hace menos de 1 hora"
    if (horas === 1) return "Hace 1 hora"
    return `Hace ${horas} horas`
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-green-400" />
          Noticias del Mundial
        </h1>
        <button 
          onClick={actualizarNoticias}
          disabled={actualizando}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className={`h-5 w-5 ${actualizando ? "animate-spin" : ""}`} />
        </button>
      </header>

      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Última actualización */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              Última actualización: {ultimaActualizacion.toLocaleTimeString()}
            </div>
            <div className="text-xs text-slate-500">
              Fuentes oficiales FIFA, ESPN, Marca, AS, Sport, BBC, TUDN
            </div>
          </div>

          {/* Grid de Fuentes */}
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              COBERTURA EN VIVO
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {FUENTES.map((fuente) => (
                <a
                  key={fuente.nombre}
                  href={fuente.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${fuente.color} p-3 rounded-lg text-center hover:opacity-80 transition-all hover:scale-105`}
                >
                  <span className="text-2xl block mb-1">{fuente.icono}</span>
                  <span className="text-xs font-bold text-white">{fuente.nombre}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Noticias Destacadas */}
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-3 flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              NOTICIAS DESTACADAS
            </h2>
            <div className="space-y-3">
              {noticias.map((noticia) => (
                <div key={noticia.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-yellow-500/30 transition-all">
                  <div className="p-4">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{noticia.fuenteIcono}</span>
                        <span className="text-xs font-bold text-slate-400">{noticia.fuente}</span>
                        <span className="text-[10px] text-slate-600">•</span>
                        <span className="text-[10px] text-slate-500">{formatearTiempo(noticia.timestamp)}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {noticia.categoria}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{noticia.titulo}</h3>
                    <p className="text-sm text-slate-400 mb-3">{noticia.resumen}</p>
                    <a 
                      href={noticia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
                    >
                      Leer más <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enlaces rápidos a medios */}
          <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-400 mb-3 flex items-center gap-2">
              <Tv className="h-4 w-4" />
              SÍGUENOS EN REDES
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://twitter.com/FIFAWorldCup" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <Twitter className="h-4 w-4 text-sky-400" />
                <span className="text-sm">@FIFAWorldCup</span>
              </a>
              <a href="https://twitter.com/ESPNFC" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <Twitter className="h-4 w-4 text-sky-400" />
                <span className="text-sm">@ESPNFC</span>
              </a>
              <a href="https://twitter.com/marca" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <Twitter className="h-4 w-4 text-sky-400" />
                <span className="text-sm">@marca</span>
              </a>
              <a href="https://twitter.com/AS_Sports" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <Twitter className="h-4 w-4 text-sky-400" />
                <span className="text-sm">@AS_Sports</span>
              </a>
            </div>
          </div>

          {/* Leyenda de fuentes */}
          <div className="mt-6 text-center text-[10px] text-slate-600">
            <p>Noticias obtenidas de fuentes oficiales: FIFA, ESPN, Marca, AS, Sport, BBC Sport, TUDN, Sky Sports</p>
            <p className="mt-1">® 2026 Quiniela Mundialista — Información en tiempo real del Mundial</p>
          </div>
        </div>
      </main>
    </div>
  )
}