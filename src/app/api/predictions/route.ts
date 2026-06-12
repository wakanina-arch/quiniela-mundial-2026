import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(request: Request) {
  try {
    const userId = "user-id-temporal-de-pruebas" // ID único temporal
    const body = await request.json()

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 })
    }

    // Guardado masivo y atómico en base de datos mediante transacción simple
    await prisma.$transaction(
      body.map((pred) =>
        prisma.prediction.upsert({
          where: {
            userId_partidoId: {
              userId,
              partidoId: pred.partidoId,
            },
          },
          update: {
            golesLocal: pred.golesLocal,
            golesVisita: pred.golesVisita,
          },
          create: {
            userId,
            partidoId: pred.partidoId,
            golesLocal: pred.golesLocal,
            golesVisita: pred.golesVisita,
          },
        })
      )
    )

    return NextResponse.json({ success: true, message: "Guardado en papel exitoso" })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
