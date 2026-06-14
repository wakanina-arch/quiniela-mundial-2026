import { NextRequest, NextResponse } from 'next/server'

// Misma estructura de usuarios que en register
const usuarios: Record<string, { id: string; nombre: string; balones: number; balonesRugby: number; ticketsMundialista: number }> = {}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')
  
  if (!id || !usuarios[id]) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  const user = usuarios[id]
  return NextResponse.json({
    id: user.id,
    nombre: user.nombre,
    balones: user.balones,
    balonesRugby: user.balonesRugby || 0,
    ticketsMundialista: user.ticketsMundialista || 0,
    aciertos: 0,
    totalApuestas: 0
  })
}

// Exportar usuarios para que register pueda acceder (misma instancia)
export { usuarios }
