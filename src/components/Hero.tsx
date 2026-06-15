"use client"

import Link from "next/link"
import { Trophy, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="w-full py-12 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Trophy className="h-10 w-10 text-yellow-500 animate-pulse" />
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
            Quiniela Mundialista 2026
          </h1>
        </div>
        <p className="text-slate-400 text-lg mt-2">Demuestra cuánto sabes de fútbol y compite con amigos</p>
        <div className="mt-6">
          <Link
            href="/quiniela"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white h-11 px-8 gap-2 font-bold shadow-lg transition-all duration-300 hover:scale-105"
          >
            Llenar mi Quiniela <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
