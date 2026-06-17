import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Trophy } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-slate-400 mb-6">La página que buscas no existe</p>
        <Link href="/home">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  )
}
