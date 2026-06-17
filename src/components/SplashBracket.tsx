"use client"

import { Trophy, Medal } from "lucide-react"

const BANDERAS: Record<string, string> = {
  México: "🇲🇽", "Corea del Sur": "🇰🇷", "República Checa": "🇨🇿", Sudáfrica: "🇿🇦",
  Canadá: "🇨🇦", "Bosnia y Herzegovina": "🇧🇦", Catar: "🇶🇦", Suiza: "🇨🇭",
  Brasil: "🇧🇷", Marruecos: "🇲🇦", Haití: "🇭🇹", Escocia: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Estados Unidos": "🇺🇸", Paraguay: "🇵🇾", Australia: "🇦🇺", Turquía: "🇹🇷",
  Alemania: "🇩🇪", Curazao: "🇨🇼", "Costa de Marfil": "🇨🇮", Ecuador: "🇪🇨",
  "Países Bajos": "🇳🇱", Japón: "🇯🇵", Suecia: "🇸🇪", Túnez: "🇹🇳",
  Bélgica: "🇧🇪", Egipto: "🇪🇬", Irán: "🇮🇷", "Nueva Zelanda": "🇳🇿",
  España: "🇪🇸", "Cabo Verde": "🇨🇻", "Arabia Saudita": "🇸🇦", Uruguay: "🇺🇾",
  Francia: "🇫🇷", Senegal: "🇸🇳", Irak: "🇮🇶", Noruega: "🇳🇴",
  Argentina: "🇦🇷", Argelia: "🇩🇿", Austria: "🇦🇹", Jordania: "🇯🇴",
  Portugal: "🇵🇹", "RD Congo": "🇨🇩", Uzbekistán: "🇺🇿", Colombia: "🇨🇴",
  Inglaterra: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Croacia: "🇭🇷", Ghana: "🇬🇭", Panamá: "🇵🇦",
}

type Grupo = { id: string; color: string; equipos: string[] }

const GRUPOS: Grupo[] = [
  { id: "A", color: "from-emerald-500 to-emerald-700", equipos: ["México", "Corea del Sur", "República Checa", "Sudáfrica"] },
  { id: "B", color: "from-rose-500 to-rose-700", equipos: ["Canadá", "Bosnia y Herzegovina", "Catar", "Suiza"] },
  { id: "C", color: "from-orange-500 to-orange-700", equipos: ["Brasil", "Marruecos", "Haití", "Escocia"] },
  { id: "D", color: "from-blue-500 to-blue-700", equipos: ["Estados Unidos", "Paraguay", "Australia", "Turquía"] },
  { id: "E", color: "from-violet-500 to-violet-700", equipos: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"] },
  { id: "F", color: "from-lime-500 to-lime-700", equipos: ["Países Bajos", "Japón", "Suecia", "Túnez"] },
  { id: "G", color: "from-pink-500 to-pink-700", equipos: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"] },
  { id: "H", color: "from-teal-500 to-teal-700", equipos: ["España", "Cabo Verde", "Arabia Saudita", "Uruguay"] },
  { id: "I", color: "from-purple-500 to-purple-700", equipos: ["Francia", "Senegal", "Irak", "Noruega"] },
  { id: "J", color: "from-sky-500 to-sky-700", equipos: ["Argentina", "Argelia", "Austria", "Jordania"] },
  { id: "K", color: "from-amber-500 to-amber-700", equipos: ["Portugal", "RD Congo", "Uzbekistán", "Colombia"] },
  { id: "L", color: "from-indigo-500 to-indigo-700", equipos: ["Inglaterra", "Croacia", "Ghana", "Panamá"] },
]

// ============================================================
// BLOQUES R32, R16, QF - CON TAMAÑOS AJUSTADOS
// ============================================================
// ============================================================
// BLOQUES R32, R16, QF - TÉRMINO MEDIO
// ============================================================
const SLOT_SIZES = {
  sm: "clamp(52px, 6vw, 76px)",   // R32 - grandes pero sin pasarse
  md: "clamp(44px, 5vw, 64px)",   // R16 - intermedios
  lg: "clamp(36px, 4vw, 52px)",   // QF - más pequeños
} as const

function ColumnaSlots({
  cantidad,
  etiqueta,
  tamaño = "md",
}: {
  cantidad: number
  etiqueta: string
  tamaño?: keyof typeof SLOT_SIZES
}) {
  const size = SLOT_SIZES[tamaño]
  return (
    <div 
      className="flex flex-col justify-around py-1" 
      style={{ 
        gap: "clamp(6px, 1vw, 14px)",
        paddingLeft: "clamp(2px, 0.5vw, 8px)",
        paddingRight: "clamp(2px, 0.5vw, 8px)",
      }}
    >
      {Array.from({ length: cantidad }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-center bg-slate-900/30 border border-slate-700/40 rounded-md"
          style={{ 
            width: size, 
            height: size,
            // Expansión muy sutil
            transform: tamaño === 'sm' ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <span
            className="text-slate-500 uppercase tracking-wider font-medium"
            style={{ fontSize: "clamp(8px, 1.3vw, 12px)" }}
          >
            {etiqueta}
          </span>
        </div>
      ))}
    </div>
  )
}

export function SplashBracket({
  modo = "splash",
  trophyInteractive = true,
  onTrophyClick,
}: {
  modo?: "splash" | "home"
  trophyInteractive?: boolean
  onTrophyClick?: () => void
}) {
  const gruposIzq = GRUPOS.slice(0, 6)
  const gruposDer = GRUPOS.slice(6, 12)

  const textos = {
    splash: {
      heroSuperior: "WORLD CHAMPIONS",
      subtituloSuperior: "FIFA World Cup 2026 — 48 equipos · 12 grupos · Eliminación directa",
      heroInferior: "Quiniela Mundialista",
      subtituloInferior: "¡Divertite con el juego de estrategia del mundial de fútbol!",
    },
    home: {
      heroSuperior: "WORLD CHAMPIONS",
      subtituloSuperior: "FIFA World Cup 2026 — 48 equipos · 12 grupos · Eliminación directa",
      heroInferior: "Quiniela Mundialista",
      subtituloInferior: "Sigue el camino del campeón",
    },
  }
  const t = textos[modo] ?? textos.splash

  return (
    <div className="w-full max-w-6xl mx-auto px-2 py-4">
      {/* HERO SUPERIOR */}
      <div className="text-center mb-3">
        <h1
          className="font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          style={{ fontSize: "clamp(20px, 5vw, 44px)" }}
        >
          {t.heroSuperior}
        </h1>
        <p className="text-slate-400 tracking-wider" style={{ fontSize: "clamp(8px, 1.5vw, 12px)" }}>
          {t.subtituloSuperior}
        </p>
      </div>

      {/* BRACKET PRINCIPAL */}
      <div
        className="grid items-center justify-center"
        style={{ gridTemplateColumns: "auto 1fr auto", gap: "clamp(6px, 1.5vw, 16px)" }}
      >
        {/* GRUPOS IZQUIERDA */}
        <div className="flex flex-col" style={{ width: "clamp(60px, 14vw, 120px)", gap: "clamp(4px, 1vw, 12px)" }}>
          {gruposIzq.map((g) => (
            <div key={g.id} className="rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900/50 shadow-lg">
              <div
                className={`bg-gradient-to-r ${g.color} text-center text-white font-bold tracking-widest`}
                style={{ fontSize: "clamp(7px, 1.3vw, 10px)", padding: "clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 8px)" }}
              >
                GRUPO {g.id}
              </div>
              <div className="grid grid-cols-2" style={{ gap: "clamp(1px, 0.3vw, 4px)", padding: "clamp(2px, 0.5vw, 8px)" }}>
                {g.equipos.map((eq) => (
                  <div
                    key={eq}
                    className="flex items-center justify-center bg-slate-800/50 rounded"
                    style={{ fontSize: "clamp(10px, 2.4vw, 18px)", padding: "clamp(1px, 0.3vw, 4px)" }}
                  >
                    {BANDERAS[eq] ?? "🏳️"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* BRACKET CENTRAL - CON BLOQUES R32, R16, QF */}
        <div className="flex items-center justify-center" style={{ gap: "clamp(4px, 1vw, 14px)" }}>
          {/* R32 - 8 COLUMNAS (más grandes) */}
          <ColumnaSlots cantidad={8} etiqueta="R32" tamaño="sm" />
          
          {/* R16 - 4 COLUMNAS (intermedias) */}
          <ColumnaSlots cantidad={4} etiqueta="R16" tamaño="md" />
          
          {/* QF - 2 COLUMNAS (más pequeñas) */}
          <ColumnaSlots cantidad={2} etiqueta="QF" tamaño="lg" />

          {/* CENTRO: MEDALLAS + TROPHY */}
<div
  className="flex flex-col items-center justify-center"
  style={{ 
    gap: "clamp(4px, 1vw, 12px)",
    minWidth: "clamp(52px, 9vw, 96px)",
    marginTop: "clamp(60px, 9vw, 100px)",      // MITAD de la bajada anterior
    marginBottom: "clamp(60px, 9vw, 100px)",    // MITAD de la bajada anterior
    transform: "translateY(20px)",               // MITAD del desplazamiento extra
  }}
>
  {/* MEDALLA PLATA */}
  <div style={{ marginBottom: "clamp(8px, 1.5vw, 20px)" }}>
    <Medal 
      style={{ 
        width: "clamp(18px, 3.2vw, 28px)", 
        height: "clamp(18px, 3.2vw, 28px)" 
      }} 
      className="text-sky-400" 
    />
  </div>

  {/* TROPHY */}
  {trophyInteractive ? (
    <button
      onClick={onTrophyClick}
      className="cursor-pointer group transition-transform hover:scale-110 duration-300"
      aria-label="Entrar al juego"
    >
      <Trophy
        style={{ 
          width: "clamp(38px, 7vw, 64px)", 
          height: "clamp(38px, 7vw, 64px)" 
        }}
        className="text-yellow-400 drop-shadow-[0_0_40px_rgba(234,179,8,0.6)] animate-pulse group-hover:drop-shadow-[0_0_60px_rgba(234,179,8,0.9)] transition-all"
      />
    </button>
  ) : (
    <Trophy
      style={{ 
        width: "clamp(38px, 7vw, 64px)", 
        height: "clamp(38px, 7vw, 64px)" 
      }}
      className="text-yellow-400 drop-shadow-[0_0_40px_rgba(234,179,8,0.6)]"
    />
  )}

  {/* MEDALLA BRONCE */}
  <div style={{ marginTop: "clamp(8px, 1.5vw, 20px)" }}>
    <Medal 
      style={{ 
        width: "clamp(18px, 3.2vw, 28px)", 
        height: "clamp(18px, 3.2vw, 28px)" 
      }} 
      className="text-amber-600" 
    />
  </div>
  
  {/* MEDALLA CONSUELO */}
  <div style={{ marginTop: "clamp(12px, 2vw, 28px)" }}>
    <Medal 
      style={{ 
        width: "clamp(18px, 3.2vw, 28px)", 
        height: "clamp(18px, 3.2vw, 28px)" 
      }} 
      className="text-white/40" 
    />
  </div>
</div>

          {/* QF - 2 COLUMNAS (más pequeñas) */}
          <ColumnaSlots cantidad={2} etiqueta="QF" tamaño="lg" />
          
          {/* R16 - 4 COLUMNAS (intermedias) */}
          <ColumnaSlots cantidad={4} etiqueta="R16" tamaño="md" />
          
          {/* R32 - 8 COLUMNAS (más grandes) */}
          <ColumnaSlots cantidad={8} etiqueta="R32" tamaño="sm" />
        </div>

        {/* GRUPOS DERECHA */}
        <div className="flex flex-col" style={{ width: "clamp(60px, 14vw, 120px)", gap: "clamp(4px, 1vw, 12px)" }}>
          {gruposDer.map((g) => (
            <div key={g.id} className="rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900/50 shadow-lg">
              <div
                className={`bg-gradient-to-r ${g.color} text-center text-white font-bold tracking-widest`}
                style={{ fontSize: "clamp(7px, 1.3vw, 10px)", padding: "clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 8px)" }}
              >
                GRUPO {g.id}
              </div>
              <div className="grid grid-cols-2" style={{ gap: "clamp(1px, 0.3vw, 4px)", padding: "clamp(2px, 0.5vw, 8px)" }}>
                {g.equipos.map((eq) => (
                  <div
                    key={eq}
                    className="flex items-center justify-center bg-slate-800/50 rounded"
                    style={{ fontSize: "clamp(10px, 2.4vw, 18px)", padding: "clamp(1px, 0.3vw, 4px)" }}
                  >
                    {BANDERAS[eq] ?? "🏳️"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HERO INFERIOR */}
      <div className="text-center mt-3">
        <h2
          className="font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          style={{ fontSize: "clamp(16px, 4.5vw, 40px)" }}
        >
          {t.heroInferior}
        </h2>
        <p className="text-slate-400" style={{ fontSize: "clamp(8px, 1.4vw, 12px)" }}>
          {t.subtituloInferior}
        </p>
      </div>
    </div>
  )
}
