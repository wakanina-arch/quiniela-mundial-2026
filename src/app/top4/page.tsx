"use client"

import Link from "next/link"
import { ArrowLeft, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Top4Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-slate-800 bg-slate-900">
        <Link href="/" className="text-slate-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-white">Top 4 Finalistas</h1>
        <div className="w-5"></div>
      </header>
      <main className="p-6 text-center">
        <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <p className="text-slate-400">Top 4 finalistas próximamente...</p>
      </main>
    </div>
  )
}
