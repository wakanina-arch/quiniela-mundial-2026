import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const nombre = searchParams.get('nombre')

    if (!nombre) {
      return NextResponse.json({ error: 'Falta el nombre del jugador' }, { status: 400 })
    }

    const jugador = await prisma.arquetipo.findUnique({
      where: { nombre: nombre.trim() }
    })

    if (!jugador) {
      return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 })
    }

    return NextResponse.json(jugador)
  } catch (error) {
    console.error("Error en API me:", error)
    return NextResponse.json({ error: 'Error de servidor' }, { status: 500 })
  }
}
