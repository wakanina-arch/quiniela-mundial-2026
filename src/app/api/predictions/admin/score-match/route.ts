import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { ShieldCheck } from "lucide-react"

// Estructura esperada para cerrar el partido
interface ScoreMatchInput {
  partidoId: string
  golesLocalReal: number
  golesVisitaReal: number
}

export async function POST(request: Request) {
  try {
    // 1. Protección de Rol de Administrador
    // Aquí se validará que el usuario en sesión sea un ADMIN.
    // Por ahora, permitimos el acceso para desarrollo local.

    const { partidoId, golesLocalReal, golesVisitaReal }: ScoreMatchInput = await request.json()

    if (!partidoId || golesLocalReal < 0 || golesVisitaReal < 0) {
      return NextResponse.json(
        { error: "Datos de partido inválidos o incompletos." },
        { status: 400 }
      )
    }

    // 2. Ejecutar todo el proceso en una transacción atómica de base de datos
    const resultado = await prisma.$transaction(async (tx) => {
      
      // A. Actualizar el partido con el marcador real y cambiar su estado
      const partidoActualizado = await tx.partido.update({
        where: { id: partidoId },
        data: {
          golesLocal: golesLocalReal,
          golesVisita: golesVisitaReal,
          status: "FINALIZADO"
        }
      })

      // B. Obtener todas las predicciones de los usuarios para este partido
      const predicciones = await tx.prediction.findMany({
        where: { partidoId: partidoId }
      })

      // C. Procesar cada predicción y calcular los puntos ganados
      for (const pred of predicciones) {
        let puntos = 0

        const esMarcadorExacto = 
          pred.golesLocal === golesLocalReal && 
          pred.golesVisita === golesVisitaReal

        const esEmpateAcertado = 
          pred.golesLocal === pred.golesVisita && 
          golesLocalReal === golesVisitaReal

        const ganoLocalPred = pred.golesLocal > pred.golesVisita
        const ganoLocalReal = golesLocalReal > golesVisitaReal
        const ganoVisitaPred = pred.golesLocal < pred.golesVisita
        const ganoVisitaReal = golesLocalReal < golesVisitaReal

        const esGanadorAcertado = 
          (ganoLocalPred && ganoLocalReal) || 
          (ganoVisitaPred && ganoVisitaReal)

        // Aplicación estricta de las reglas de negocio de la quiniela
        if (esMarcadorExacto) {
          puntos = 3
        } else if (esGanadorAcertado) {
          puntos = 2
        } else if (esEmpateAcertado) {
          puntos = 1
        }

        // D. Si el usuario sumó puntos, actualizar su registro de predicción y su perfil global
        if (puntos > 0) {
          // Guardar los puntos en la predicción específica
          await tx.prediction.update({
            where: { id: pred.id },
            data: { puntosGanados: puntos }
          })

          // Sumar los puntos al total acumulado del usuario
          await tx.user.update({
            where: { id: pred.userId },
            data: {
              points: {
                increment: puntos
              }
            }
          })
        }
      }

      return { totalProcesado: predicciones.length }
    })

    return NextResponse.json({
      success: true,
      message: `Partido cerrado. Se han procesado y actualizado ${resultado.totalProcesado} quinielas de usuarios.`,
    })

  } catch (error: any) {
    console.error("Error en el cálculo de puntos del administrador:", error)
    return NextResponse.json(
      { error: error.message || "Error interno al procesar el cierre del partido." },
      { status: 500 }
    )
  }
}
