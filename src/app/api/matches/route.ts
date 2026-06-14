import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isSameDay } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const arquetipoId = searchParams.get('arquetipoId')

    const matches = await prisma.match.findMany({
      orderBy: { date: 'asc' }
    })

    // Si se proporciona arquetipoId, obtener las apuestas del usuario para saber si ya apostó
    let betsMap = new Map()
    if (arquetipoId) {
      const bets = await prisma.apuesta.findMany({
        where: { arquetipoId },
        select: { matchId: true, tipo: true }
      })
      bets.forEach(bet => {
        const key = `${bet.matchId}-${bet.tipo}`
        betsMap.set(key, true)
      })
    }

    const now = new Date()
    const matchesWithStatus = matches.map(match => ({
      ...match,
      isToday: isSameDay(match.date, now),
      hasBetResultado: betsMap.has(`${match.id}-RESULTADO`) || false,
      hasBetMarcador: betsMap.has(`${match.id}-MARCADOR`) || false,
      canBet: match.status === 'scheduled' && (match.date.getTime() - now.getTime()) > 20 * 60 * 1000
    }))

    return NextResponse.json(matchesWithStatus)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}