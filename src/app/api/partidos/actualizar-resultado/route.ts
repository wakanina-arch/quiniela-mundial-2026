import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Función de lógica de premios (ganar balón con conversión a rugby)
async function premiarArquetipo(arquetipoId: string, esAcierto: boolean, bonusExtra = 0) {
  const arquetipo = await prisma.arquetipo.findUnique({ where: { id: arquetipoId } })
  if (!arquetipo) return

  if (esAcierto) {
    let balonesGanados = 1 + bonusExtra // streak puede dar +2
    let nuevosBalones = arquetipo.balones + balonesGanados
    let nuevosRugby = arquetipo.balonesRugby
    let nuevosTickets = arquetipo.ticketsMundialista

    if (nuevosBalones > 10) {
      const exceso = nuevosBalones - 10
      nuevosBalones = 10
      nuevosRugby += exceso
      // Cada 5 rugby se convierten en 1 balón + 1 ticket
      const canje = Math.floor(nuevosRugby / 5)
      if (canje > 0) {
        nuevosRugby -= canje * 5
        nuevosBalones = Math.min(10, nuevosBalones + canje)
        nuevosTickets += canje
      }
    }

    await prisma.arquetipo.update({
      where: { id: arquetipoId },
      data: {
        balones: nuevosBalones,
        balonesRugby: nuevosRugby,
        ticketsMundialista: nuevosTickets,
        aciertos: { increment: 1 },
        rachaActual: { increment: 1 },
        ultimoAcierto: new Date()
      }
    })
  } else {
    // Fallo: solo resta balón (ya se restó al crear apuesta, aquí no se resta de nuevo)
    // Reiniciar racha
    await prisma.arquetipo.update({
      where: { id: arquetipoId },
      data: { rachaActual: 0 }
    })
    // Si se queda a cero, se penaliza (ya se maneja en el front)
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { matchId, goalsLocal, goalsVisita } = await req.json()

    const match = await prisma.match.findUnique({ where: { id: matchId } })
    if (!match) return NextResponse.json({ error: 'Partido no existe' }, { status: 404 })

    // Actualizar resultado del partido
    await prisma.match.update({
      where: { id: matchId },
      data: { goalsLocalReal: goalsLocal, goalsVisitaReal: goalsVisita, status: 'finished' }
    })

    // Obtener todas las apuestas PENDING de este partido
    const apuestas = await prisma.apuesta.findMany({
      where: { matchId, status: 'PENDING' },
      include: { arquetipo: true }
    })

    for (const apuesta of apuestas) {
      let acierto = false
      let bonus = 0

      if (apuesta.tipo === 'RESULTADO') {
        const pick = (apuesta.prediccion as any).pick
        const winnerReal = goalsLocal > goalsVisita ? 'Local' : goalsLocal < goalsVisita ? 'Visita' : 'Empate'
        acierto = (pick === winnerReal)
      } else if (apuesta.tipo === 'MARCADOR') {
        const pred = apuesta.prediccion as any
        acierto = (pred.golesLocal === goalsLocal && pred.golesVisita === goalsVisita)
      }
      // CAMPEON se evaluará aparte al final del torneo

      if (acierto) {
        // Bonus por racha de 3 aciertos seguidos
        if (apuesta.arquetipo.rachaActual >= 2) {
          bonus = 1 // en la siguiente apuesta se dará +2, pero aquí ya es el acierto actual
          // Realmente en esta función ya estamos otorgando el premio. Para simplificar, damos +1 extra si racha >=3
          if (apuesta.arquetipo.rachaActual >= 2) bonus = 1
        }
        await premiarArquetipo(apuesta.arquetipoId, true, bonus)
        await prisma.apuesta.update({ where: { id: apuesta.id }, data: { status: 'WON', aciertoBonus: 1 + bonus } })
      } else {
        await premiarArquetipo(apuesta.arquetipoId, false, 0)
        await prisma.apuesta.update({ where: { id: apuesta.id }, data: { status: 'LOST' } })
        // Si el arquetipo se quedó a 0 balones, penalizar
        const updated = await prisma.arquetipo.findUnique({ where: { id: apuesta.arquetipoId } })
        if (updated && updated.balones === 0 && !updated.penalizadoHasta) {
          await prisma.arquetipo.update({
            where: { id: apuesta.arquetipoId },
            data: { penalizadoHasta: new Date(Date.now() + 24 * 60 * 60 * 1000) }
          })
        }
      }
    }

    return NextResponse.json({ success: true, apuestasProcesadas: apuestas.length })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}