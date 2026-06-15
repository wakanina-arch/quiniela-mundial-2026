import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  // TODOS LOS GRUPOS (A hasta L)
  const GRUPOS = [
    { id: "A", equipos: ["México", "Corea del Sur", "República Checa", "Sudáfrica"] },
    { id: "B", equipos: ["Canadá", "Bosnia y H.", "Catar", "Suiza"] },
    { id: "C", equipos: ["Brasil", "Marruecos", "Haití", "Escocia"] },
    { id: "D", equipos: ["Estados Unidos", "Paraguay", "Australia", "Turquía"] },
    { id: "E", equipos: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"] },
    { id: "F", equipos: ["Países Bajos", "Japón", "Suecia", "Túnez"] },
    { id: "G", equipos: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"] },
    { id: "H", equipos: ["España", "Cabo Verde", "Arabia Saudita", "Uruguay"] },
    { id: "I", equipos: ["Francia", "Senegal", "Irak", "Noruega"] },
    { id: "J", equipos: ["Argentina", "Argelia", "Austria", "Jordania"] },
    { id: "K", equipos: ["Portugal", "RD Congo", "Uzbekistán", "Colombia"] },
    { id: "L", equipos: ["Inglaterra", "Croacia", "Ghana", "Panamá"] },
  ]

  // PARTIDOS JUGADOS HASTA AHORA (actualizar a medida que pasan los partidos)
  const PARTIDOS_JUGADOS = [
    // Grupo A
    { grupo: "A", local: "México", visitante: "Sudáfrica", golesLocal: 2, golesVisitante: 0 },
    { grupo: "A", local: "Corea del Sur", visitante: "República Checa", golesLocal: 2, golesVisitante: 1 },
    // Grupo B
    { grupo: "B", local: "Canadá", visitante: "Bosnia y H.", golesLocal: 1, golesVisitante: 1 },
    // Grupo D
    { grupo: "D", local: "Estados Unidos", visitante: "Paraguay", golesLocal: 4, golesVisitante: 1 },
    // Los demás grupos aún no tienen partidos jugados, se mostrarán con 0 en todas las estadísticas
  ]

  // Inicializar estadísticas para todos los equipos
  const stats: Record<string, any> = {}
  
  GRUPOS.forEach(grupo => {
    grupo.equipos.forEach(equipo => {
      stats[equipo] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
    })
  })

  // Procesar partidos jugados
  PARTIDOS_JUGADOS.forEach(partido => {
    const local = stats[partido.local]
    const visitante = stats[partido.visitante]
    
    if (local && visitante) {
      local.pj++; visitante.pj++
      local.gf += partido.golesLocal; local.gc += partido.golesVisitante
      visitante.gf += partido.golesVisitante; visitante.gc += partido.golesLocal
      
      if (partido.golesLocal > partido.golesVisitante) {
        local.pg++; visitante.pp++; local.pts += 3
      } else if (partido.golesLocal < partido.golesVisitante) {
        local.pp++; visitante.pg++; visitante.pts += 3
      } else {
        local.pe++; visitante.pe++; local.pts += 1; visitante.pts += 1
      }
    }
  })

  // Construir resultado con todos los grupos
  const resultado = GRUPOS.map(grupo => {
    const equiposConStats = grupo.equipos.map(equipo => ({ 
      nombre: equipo, 
      ...stats[equipo] 
    }))
    
    equiposConStats.sort((a, b) => {
      if (a.pts !== b.pts) return b.pts - a.pts
      const diffA = a.gf - a.gc
      const diffB = b.gf - b.gc
      if (diffA !== diffB) return diffB - diffA
      return b.gf - a.gf
    })
    
    return { id: grupo.id, equipos: equiposConStats }
  })

  return NextResponse.json(resultado, {
    status: 200,
    headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
  })
}
