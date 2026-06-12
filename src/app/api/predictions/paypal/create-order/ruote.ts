import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import paypal from '@paypal/checkout-server-sdk'

const clientId = process.env.PAYPAL_CLIENT_ID!
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret)
const client = new paypal.core.PayPalHttpClient(environment)

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { orderId } = await req.json()

    // Capturar el pago en PayPal
    const request = new paypal.orders.OrdersCaptureRequest(orderId)
    request.requestBody({})
    
    const capture = await client.execute(request)
    
    if (capture.result.status === 'COMPLETED') {
      // Actualizar pago en BD
      await prisma.payment.update({
        where: { paypalOrderId: orderId },
        data: { 
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      // Obtener custom_id para saber qué apuestas pagar
      const customData = JSON.parse(capture.result.purchase_units[0].custom_id || '{}')
      
      // Marcar apuestas como pagadas
      if (customData.predictionsIds?.length) {
        await prisma.prediction.updateMany({
          where: { id: { in: customData.predictionsIds } },
          data: { pagada: true, paymentId: orderId }
        })
      }
      
      if (customData.bonusId) {
        await prisma.bonusPrediction.update({
          where: { id: customData.bonusId },
          data: { pagada: true, paymentId: orderId }
        })
      }

      // Actualizar acumulado
      await prisma.$executeRaw`
        UPDATE Acumulado 
        SET total = total + ${capture.result.purchase_units[0].amount.value}::float,
            actualizado = NOW()
        WHERE id = (SELECT id FROM Acumulado LIMIT 1)
      `
      
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
  } catch (error) {
    console.error('Error capturing order:', error)
    return NextResponse.json({ error: 'Error capturing order' }, { status: 500 })
  }
}