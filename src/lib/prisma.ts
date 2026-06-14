import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Truco oficial de Prisma 7 para usar DATABASE_URL directa sin complicarse con adaptadores nativos
export const prisma = globalForPrisma.prisma || new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
