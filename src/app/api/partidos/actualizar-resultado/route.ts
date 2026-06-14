import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic';

async function premiarArquetipo(arquetipoId: string, esAcierto: boolean, bonusExtra = 0) {
  const arquetipo = await prisma.arquetipo.findUnique({ where: { id: arquetipoId } })
  if (!arquetipo) return

  if (esAcierto) {
    let balonesGanados = 1 + bonusExtra
    let nuevosBalones = arquetipo.balones + balonesGanados
    let nuevasCopas = arquetipo.ticketsMundialista

    // SISTEMA SIMPLIFICADO: Si supera el límite de 10 balones, el exceso va DIRECTO a Copas
    if (nuevosBalones > 10) {
      const exceso = nuevosBalones - 10
      nuevosBalones = 10
      nuevasCopas += exceso // Gana copas directamente sin pasar por comodines
    }

    await prisma.arquetipo.update({
      where: { id: arquetipoId },
      data: {
        balones: nuevosBalones,
        ticketsMundialista: nuevasCopas,
        aciertos: { increment: 1 },
        rachaActual: { increment: 1 },
        ultimoAcierto: new Date()
      }
    })
  } else {
    await prisma.arquetipo.update({
      where: { id: arquetipoId },
      data: { rachaActual: 0 }
    })
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

    await prisma.match.update({
      where: { id: matchId },
      data: { goalsLocalReal: goalsLocal, goalsVisitaReal: goalsVisita, status: 'finished' }
    })

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

      if (acierto) {
        if (apuesta.arquetipo.rachaActual >= 2) bonus = 1
        await premiarArquetipo(apuesta.arquetipoId, true, bonus)
        await prisma.apuesta.update({ where: { id: apuesta.id }, data: { status: 'WON', aciertoBonus: 1 + bonus } })
      } else {
        await premiarArquetipo(apuesta.arquetipoId, false, 0)
        await prisma.apuesta.update({ where: { id: apuesta.id }, data: { status: 'LOST' } })
        
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
