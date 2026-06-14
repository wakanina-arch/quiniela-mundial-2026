import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isSameDay } from 'date-fns'

// Forzar procesamiento dinámico en servidor
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const arquetipoId = searchParams.get('arquetipoId')

    const matches = await prisma.match.findMany({
      orderBy: { date: 'asc' }
    })

    // Si se proporciona arquetipoId, obtener las apuestas del usuario para saber si ya apostó
    const betsMap = new Map()
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
    
    const matchesWithStatus = matches.map(match => {
      // Forzar que la fecha sea interpretada correctamente como un objeto Date válido
      const matchDate = new Date(match.date)
      
      return {
        ...match,
        isToday: isSameDay(matchDate, now),
        hasBetResultado: betsMap.has(`${match.id}-RESULTADO`),
        hasBetMarcador: betsMap.has(`${match.id}-MARCADOR`),
        // Validación segura del tiempo restante (20 minutos)
        canBet: match.status === 'scheduled' && (matchDate.getTime() - now.getTime()) > 20 * 60 * 1000
      }
    })

    return NextResponse.json(matchesWithStatus)
  } catch (error) {
    // Esto imprimirá el fallo exacto en tu terminal si Prisma no conecta
    console.error("Error en API matches:", error)
    return NextResponse.json({ error: 'Error interno de servidor' }, { status: 500 })
  }
}
