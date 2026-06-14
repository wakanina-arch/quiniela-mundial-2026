import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/', '/registro', '/tutorial', '/noticias', '/rondas', '/Tclasificacion', '/rankings']
  
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Para /quiniela, permitir acceso sin cookie (se validará en cliente)
  if (pathname === '/quiniela') {
    return NextResponse.next()
  }

  // Para otras rutas protegidas, verificar cookie
  const arquetipoId = request.cookies.get('arquetipoId')?.value

  if (!arquetipoId && (pathname.startsWith('/ranking') || pathname.startsWith('/historial') || pathname.startsWith('/api/apuesta'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/quiniela/:path*', '/ranking/:path*', '/historial/:path*', '/api/apuesta/:path*']
}
