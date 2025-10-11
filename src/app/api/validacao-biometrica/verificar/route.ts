import { NextRequest, NextResponse } from 'next/server';

const UMBRELA_API_KEY = process.env.UMBRELA_API_KEY || '84f2022f-a84b-4d63-a727-1780e6261fe8';
const UMBRELA_BASE_URL = 'https://api-gateway.umbrellapag.com/api';
const UTMIFY_API_TOKEN = 'U1htkxfFDFGP5Ts2wRP6IWw2nDrxJvJEPEHE';
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
        { success: false, error: 'ID da transação não fornecido' },
        { status: 400 }
      );
    }

    // Consultar status na Umbrela
    const response = await fetch(`${UMBRELA_BASE_URL}/user/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'x-api-key': UMBRELA_API_KEY,
        'User-Agent': 'UMBRELLAB2B/1.0'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Erro ao verificar transação' },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    // A resposta da Umbrela vem em result.data
    const data = result.data || result;
    const pago = data.status === 'PAID';

    console.log('🔍 Status verificado:', {
      transactionId,
      status: data.status,
      pago
    });

    // Se pago, enviar para UTMify com status paid
    if (pago) {
      try {
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
            name: 'Taxa de Validação Biométrica',
            planId: null,
            planName: null,
            quantity: 1,
            priceInCents: data.amount || 1459
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
            totalPriceInCents: data.amount || 1459,
            gatewayFeeInCents: 0,
            userCommissionInCents: data.amount || 1459
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
      pago,
      status: data.status,
      transactionData: data
    });

  } catch (error) {
    console.error('Erro ao verificar transação:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
