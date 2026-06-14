import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { arquetipoId, matchId, tipo, prediccion } = await req.json()

    // Obtener arquetipo y validar penalización
    const arquetipo = await prisma.arquetipo.findUnique({ where: { id: arquetipoId } })
    if (!arquetipo) return NextResponse.json({ error: 'Arquetipo no existe' }, { status: 404 })
    if (arquetipo.penalizadoHasta && arquetipo.penalizadoHasta > new Date()) {
      return NextResponse.json({ error: 'Estás penalizado sin balones hasta ' + arquetipo.penalizadoHasta }, { status: 403 })
    }
    if (arquetipo.balones < 1) {
      return NextResponse.json({ error: 'No tienes balones suficientes' }, { status: 400 })
    }

    // Verificar partido
    const match = await prisma.match.findUnique({ where: { id: matchId } })
    if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
    if (match.status !== 'scheduled') return NextResponse.json({ error: 'Partido ya comenzó o terminó' }, { status: 400 })
    const minutesBefore = (match.date.getTime() - Date.now()) / (1000 * 60)
    if (minutesBefore < 20) return NextResponse.json({ error: 'Faltan menos de 20 minutos, apuesta cerrada' }, { status: 400 })

    // Verificar si ya apostó a este tipo en este partido
    const exist = await prisma.apuesta.findFirst({
      where: { arquetipoId, matchId, tipo }
    })
    if (exist) return NextResponse.json({ error: 'Ya apostaste en este partido y tipo' }, { status: 400 })

    // Transacción: restar balón y crear apuesta
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.arquetipo.update({
        where: { id: arquetipoId },
        data: { balones: { decrement: 1 }, totalApuestas: { increment: 1 } }
      })
      const apuesta = await tx.apuesta.create({
        data: {
          arquetipoId,
          matchId,
          tipo,
          prediccion,
          status: 'PENDING'
        }
      })
      return { balones: updated.balones, apuesta }
    })

    return NextResponse.json({ success: true, balonesRestantes: result.balones, apuestaId: result.apuesta.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}