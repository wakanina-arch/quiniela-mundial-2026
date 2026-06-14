import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { nombre } = await req.json()

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
    }

    const alias = nombre.trim()

    // Si el jugador ya existe, lo recupera; si no, lo crea con 10 balones
    const jugador = await prisma.arquetipo.upsert({
      where: { nombre: alias },
      update: {}, 
      create: {
        nombre: alias,
        balones: 10,
        balonesRugby: 0,
        ticketsMundialista: 0,
      }
    })

    return NextResponse.json(jugador)
  } catch (error) {
    console.error("Error al registrar:", error)
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 })
  }
}
