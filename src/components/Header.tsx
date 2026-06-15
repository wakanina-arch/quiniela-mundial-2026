"use client"

import Link from "next/link"
import { Trophy, Users, LayoutDashboard, Star, Newspaper } from "lucide-react"

export function Header() {
  return (
    // responsive: padding reducido en mobile
    <header className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-50 w-full overflow-x-hidden">
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 flex-shrink-0" />
        {/* responsive: texto oculto en móvil muy pequeño, visible desde sm */}
        <span className="font-bold text-white text-xs sm:text-sm md:text-base truncate hidden sm:inline">Quiniela Mundialista 2026</span>
        <span className="font-bold text-white text-xs sm:hidden truncate">QM2026</span>
      </div>
      <nav className="flex gap-1 sm:gap-2 lg:gap-4 items-center">
        {/* responsive: algunos textos se ocultan en móvil */}
        <Link href="/quiniela" className="text-slate-300 hover:text-white text-[10px] sm:text-sm whitespace-nowrap">Quiniela</Link>
        <Link href="/ranking" className="text-slate-300 hover:text-white text-[10px] sm:text-sm whitespace-nowrap">Ranking</Link>
        <Link href="/rondas" className="text-slate-300 hover:text-white text-[10px] sm:text-sm whitespace-nowrap hidden sm:inline">Rondas</Link>
        <Link href="/Tclasificacion" className="text-slate-300 hover:text-white text-[10px] sm:text-sm whitespace-nowrap hidden md:inline">Clasificación</Link>
        <Link href="/noticias" className="text-slate-300 hover:text-white text-[10px] sm:text-sm whitespace-nowrap hidden lg:inline">Noticias</Link>
      </nav>
    </header>
  )
}