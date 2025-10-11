import { NextRequest, NextResponse } from 'next/server';

const UMBRELA_API_KEY = '84f2022f-a84b-4d63-a727-1780e6261fe8';
const UMBRELA_BASE_URL = 'https://api-gateway.umbrellapag.com/api';
const UTMIFY_API_TOKEN = 'KVRxalfMiBfm8Rm1nP5YxfwYzArNsA0VLeWC';
const UTMIFY_API_URL = 'https://api.utmify.com.br/api-credentials/orders';

// Forçar rota dinâmica
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'ID da transação não fornecido' },
        { status: 400 }
      );
    }

    // Verificar status na Umbrela
    const response = await fetch(
      `${UMBRELA_BASE_URL}/user/transactions/${transactionId}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': UMBRELA_API_KEY,
          'User-Agent': 'UMBRELLAB2B/1.0'
        }
      }
    );

    const result = await response.json();

    if (result.status === 200) {
      const pago = result.data.status === 'PAID';
      
      // Se pago, enviar para UTMify com status paid
      if (pago) {
        try {
          const data = result.data;
          const metadata = data.metadata ? JSON.parse(data.metadata) : {};
          const customer = data.customer || {};
          
          const utmifyPayload = {
            orderId: data.id,
            platform: 'Umbrela',
            paymentMethod: 'pix',
            status: 'paid',
            createdAt: data.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
            approvedDate: data.paidAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
            refundedAt: null,
            customer: {
              name: customer.name || metadata.nome || 'Cliente',
              email: customer.email || metadata.email || 'cliente@email.com',
              phone: customer.phone || metadata.telefone || '11999999999',
              document: customer.document?.number || metadata.cpf || '00000000000',
              country: 'BR',
              ip: '0.0.0.0'
            },
            products: [{
              id: data.id,
              name: metadata.produto || 'Assinatura Premium 002',
              planId: null,
              planName: null,
              quantity: 1,
              priceInCents: data.amount || 2274
            }],
            trackingParameters: {
              src: null,
              sck: null,
              utm_source: null,
              utm_campaign: null,
              utm_medium: null,
              utm_content: null,
              utm_term: null
            },
            commission: {
              totalPriceInCents: data.amount || 2274,
              gatewayFeeInCents: 0,
              userCommissionInCents: data.amount || 2274
            },
            isTest: false
          };

          console.log('📤 Enviando para UTMify (PIX PAGO):', utmifyPayload);

          await fetch(UTMIFY_API_URL, {
            method: 'POST',
            headers: {
              'x-api-token': UTMIFY_API_TOKEN,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(utmifyPayload)
          });

          console.log('✅ Status PAID enviado para UTMify');
        } catch (utmifyError) {
          console.error('⚠️ Erro ao enviar para UTMify:', utmifyError);
        }
      }

      return NextResponse.json({
        success: true,
        transactionId: result.data.id,
        status: result.data.status,
        pago: pago,
        amount: result.data.amount,
        paidAt: result.data.paidAt || null,
        customer: result.data.customer
      });
    }

    return NextResponse.json(
      { error: 'Erro ao verificar transação', details: result },
      { status: 500 }
    );

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
