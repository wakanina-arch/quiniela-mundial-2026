import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando la siembra de partidos...')

  // Leer el archivo JSON
  const filePath = path.join(__dirname, 'partidos.json')
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const partidos = JSON.parse(rawData)

  // Limpiar partidos existentes para evitar duplicados en desarrollo
  await prisma.partido.deleteMany()

  // Insertar todos los partidos en lote
  for (const partido of partidos) {
    await prisma.partido.create({
      data: {
        fase: partido.fase,
        fecha: new Date(partido.fecha),
        equipoLocal: partido.equipoLocal,
        equipoVisita: partido.equipoVisita,
        grupo: partido.grupo || null,
        status: 'PENDIENTE'
      }
    })
  }

  console.log(`✅ ¡Éxito! Se han cargado ${partidos.length} partidos correctamente.`)
}

main()
  .catch((e) => {
    console.error('❌ Error en la siembra:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
