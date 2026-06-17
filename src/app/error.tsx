'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Algo salió mal</h1>
        <p className="text-slate-400 mb-6">Hubo un error al cargar esta página</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            Intentar de nuevo
          </Button>
          <Link href="/home">
            <Button className="bg-slate-700 hover:bg-slate-600 text-white">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
