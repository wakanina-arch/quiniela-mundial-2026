import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo') || 'GENERAL'

  let orderBy: any = {}
  if (tipo === 'GENERAL') orderBy = { balones: 'desc' }
  else if (tipo === 'PUNTOS') orderBy = { aciertos: 'desc' }
  else if (tipo === 'GOLES') orderBy = { balonesRugby: 'desc' }
  else if (tipo === 'FINAL') orderBy = { ticketsMundialista: 'desc' }

  const arquetipos = await prisma.arquetipo.findMany({
    select: {
      nombre: true,
      balones: true,
      balonesRugby: true,
      ticketsMundialista: true,
      totalApuestas: true,
      aciertos: true
    },
    orderBy,
    take: 100
  })

  const ranking = arquetipos.map((a, idx) => ({
    posicion: idx + 1,
    nombre: a.nombre,
    balones: a.balones,
    rugby: a.balonesRugby,
    tickets: a.ticketsMundialista,
    efectividad: a.totalApuestas === 0 ? 0 : (a.aciertos / a.totalApuestas) * 100
  }))

  return NextResponse.json(ranking)
}