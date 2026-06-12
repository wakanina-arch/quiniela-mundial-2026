import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Si alguien intenta acceder a /quiniela sin estar registrado, va al home
  if (pathname === '/quiniela') {
    const usuario = request.cookies.get('quiniela_usuario')
    if (!usuario) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/quiniela']
}
