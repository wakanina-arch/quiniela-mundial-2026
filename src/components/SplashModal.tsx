"use client"

import { Trophy, X, PartyPopper } from "lucide-react"
import { useRouter } from "next/navigation"

interface SplashModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SplashModal({ isOpen, onClose }: SplashModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl max-w-md w-full text-center p-8 border border-yellow-500/30 shadow-2xl relative">
        <button
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 p-2 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="animate-bounce mb-6">
          <Trophy className="h-20 w-20 text-yellow-500 mx-auto" />
        </div>

        <h2 className="text-3xl font-black text-white mb-2">QUINIELA MUNDIAL 2026</h2>
        <p className="text-slate-300 text-sm mb-6">JUEGO 100% GRATUITO DE ESTRATEGIA</p>

        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center justify-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-2 rounded-lg">
            <span className="text-2xl">⚽️</span> 10 balones gratis
          </div>
          <div className="flex items-center justify-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-2 rounded-lg">
            <span className="text-2xl">🏉</span> Comodín
          </div>
          <div className="flex items-center justify-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-2 rounded-lg">
            <span className="text-2xl">🏆</span> Tickets Mundial
          </div>
        </div>

        <button
          onClick={() => {
            onClose()
            router.push("/registro")
          }}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black py-4 text-lg gap-2 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
        >
          Comenzar Aventura <PartyPopper className="h-5 w-5" />
        </button>

        <p className="text-[10px] text-slate-600 mt-6">Juego gratuito. Sin dinero real. +13 años.</p>
      </div>
    </div>
  )
}
