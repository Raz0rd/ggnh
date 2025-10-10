import { NextRequest, NextResponse } from 'next/server';

const UMBRELA_API_KEY = '84f2022f-a84b-4d63-a727-1780e6261fe8';
const UMBRELA_BASE_URL = 'https://api-gateway.umbrellapag.com/api';

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
      return NextResponse.json({
        success: true,
        transactionId: result.data.id,
        status: result.data.status,
        pago: result.data.status === 'PAID',
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
