export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { arquetipoId } = await req.json()
  const arquetipo = await prisma.arquetipo.findUnique({ where: { id: arquetipoId } })
  if (!arquetipo) return NextResponse.json({ error: 'No existe' }, { status: 404 })

  const hoy = new Date()
  const ultimoBonus = arquetipo.bonusDiario
  if (ultimoBonus && ultimoBonus.toDateString() === hoy.toDateString()) {
    return NextResponse.json({ error: 'Ya reclamaste el bonus hoy' }, { status: 400 })
  }

  let nuevosBalones = arquetipo.balones + 1
  if (nuevosBalones > 10) nuevosBalones = 10

  await prisma.arquetipo.update({
    where: { id: arquetipoId },
    data: { balones: nuevosBalones, bonusDiario: hoy }
  })

  return NextResponse.json({ success: true, balones: nuevosBalones })
}