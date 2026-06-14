"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Trophy, Home, History, Award } from "lucide-react"
import { useEffect, useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const [balones, setBalones] = useState(10)
  const [balonesRugby, setBalonesRugby] = useState(0)

  useEffect(() => {
    const data = localStorage.getItem("arquetipoData")
    if (data) {
      const parsed = JSON.parse(data)
      setBalones(parsed.balones || 10)
      setBalonesRugby(parsed.balonesRugby || 0)
    }
  }, [])

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span className="font-bold text-white hidden sm:inline">Quiniela 2026</span>
        </div>
        <div className="flex gap-4">
          <Link href="/quiniela" className={`${pathname === "/quiniela" ? "text-yellow-500" : "text-slate-300"} hover:text-white`}>
            <Home className="h-5 w-5" />
          </Link>
          <Link href="/historial" className={`${pathname === "/historial" ? "text-yellow-500" : "text-slate-300"} hover:text-white`}>
            <History className="h-5 w-5" />
          </Link>
          <Link href="/ranking" className={`${pathname === "/ranking" ? "text-yellow-500" : "text-slate-300"} hover:text-white`}>
            <Award className="h-5 w-5" />
          </Link>
        </div>
        <div className="flex gap-3 text-sm font-bold">
          <span className="text-yellow-400 flex items-center gap-1">⚽️ {balones}/10</span>
          <span className="text-blue-400 flex items-center gap-1">🏉 {balonesRugby}</span>
        </div>
      </div>
    </header>
  )
}
