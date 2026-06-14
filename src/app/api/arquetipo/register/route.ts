import { NextRequest, NextResponse } from 'next/server'

// Simular base de datos en memoria (para desarrollo)
const usuarios: Record<string, { id: string; nombre: string; balones: number; fecha: string }> = {}

export async function POST(req: NextRequest) {
  try {
    const { nombre } = await req.json()
    
    if (!nombre || nombre.length < 3 || nombre.length > 20) {
      return NextResponse.json({ error: 'El nombre debe tener entre 3 y 20 caracteres' }, { status: 400 })
    }
    
    // Verificar si ya existe
    const existe = Object.values(usuarios).find(u => u.nombre === nombre)
    if (existe) {
      return NextResponse.json({ error: 'Ese nombre ya está en uso' }, { status: 400 })
    }
    
    // Crear nuevo usuario
    const id = Date.now().toString()
    usuarios[id] = {
      id,
      nombre,
      balones: 10,
      fecha: new Date().toISOString()
    }
    
    return NextResponse.json({ id, nombre, balones: 10 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
