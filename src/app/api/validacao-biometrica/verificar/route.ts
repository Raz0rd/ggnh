import { NextRequest, NextResponse } from 'next/server';

const UMBRELA_API_KEY = process.env.UMBRELA_API_KEY || '84f2022f-a84b-4d63-a727-1780e6261fe8';
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
