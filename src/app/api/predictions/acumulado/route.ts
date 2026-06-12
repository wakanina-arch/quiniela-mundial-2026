import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    let acumulado = await prisma.acumulado.findFirst()
    
    if (!acumulado) {
      acumulado = await prisma.acumulado.create({
        data: { total: 0 }
      })
    }
    
    return NextResponse.json({ total: acumulado.total })
  } catch (error) {
    return NextResponse.json({ total: 0 }, { status: 500 })
  }
}