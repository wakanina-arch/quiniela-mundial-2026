"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Trophy } from "lucide-react"

const steps = [
  { icon: "⚽️", title: "Tienes 10 balones", desc: "Cada apuesta cuesta 1 balón" },
  { icon: "🎯", title: "Acierta y recuperas el balón", desc: "No pierdes si aciertas" },
  { icon: "🏉", title: "después de 10 balones optienes un comodín", desc: "Cada 5 rugby = 1 balón + ticket" },
  { icon: "🏆", title: "con 5 comodines optienes una copa para participar en la Apuesta Mundialista", desc: "Gana premios mundialistas" }
]

export default function TutorialPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const nextStep = () => {
    if (step + 1 < steps.length) setStep(step + 1)
    else router.push("/quiniela")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 rounded-2xl border border-slate-700 p-8 text-center">
        <div className="text-7xl mb-6 animate-bounce">{steps[step].icon}</div>
        <h2 className="text-2xl font-black text-white mb-2">{steps[step].title}</h2>
        <p className="text-slate-300 mb-6">{steps[step].desc}</p>
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === step ? "bg-yellow-500" : "bg-slate-600"}`} />
          ))}
        </div>
        <button
          onClick={nextStep}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black py-3 px-6 rounded-full flex items-center justify-center gap-2 mx-auto"
        >
          {step === steps.length - 1 ? "Jugar ahora" : "Siguiente"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
