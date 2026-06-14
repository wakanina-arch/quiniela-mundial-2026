import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tipo = searchParams.get('tipo') || 'GENERAL'

    const usuarios = await prisma.arquetipo.findMany({
      orderBy: {
        aciertos: 'desc'
      }
    })

    return NextResponse.json(usuarios)
  } catch (error) {
    console.error("Error en API ranking:", error)
    return NextResponse.json({ error: 'Error interno de servidor' }, { status: 500 })
  }
}
