"use client"

import { PartyPopper } from "lucide-react"

interface FloatingButtonProps {
  onClick: () => void
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 border border-amber-400/20 animate-pulse hover:animate-none"
      >
        <PartyPopper className="h-5 w-5" />
        Participa / Vive la aventura
      </button>
    </div>
  )
}
