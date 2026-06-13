import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Si intenta acceder a /quiniela directamente sin datos de apuestas pendientes
  // redirigir a home (opcional, según necesidad)
  if (pathname === '/quiniela') {
    // Permitir acceso normal, no redirigir
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: []
}
