import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. PERMITIR recursos estáticos y API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. PERMITIR splash (no redirigir aquí)
  if (pathname === '/splash') {
    return NextResponse.next()
  }

  // 3. PERMITIR home SOLO si viene del splash (cookie)
  if (pathname === '/home') {
    const fromSplash = request.cookies.get('fromSplash')?.value === 'true'
    
    if (fromSplash) {
      // Permitir acceso a home y ELIMINAR la cookie (solo para esta vez)
      const response = NextResponse.next()
      response.cookies.delete('fromSplash')
      return response
    }
    
    // Si no viene del splash, redirigir a splash
    return NextResponse.redirect(new URL('/splash', request.url))
  }

  // 4. Para TODAS las demás rutas (/, /ranking, /rondas, etc.)
  // Redirigir a splash
  return NextResponse.redirect(new URL('/splash', request.url))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}