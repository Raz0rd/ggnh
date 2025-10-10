import { NextRequest, NextResponse } from 'next/server';

const UMBRELA_API_KEY = '84f2022f-a84b-4d63-a727-1780e6261fe8';
const UMBRELA_BASE_URL = 'https://api-gateway.umbrellapag.com/api';

// Forçar rota dinâmica
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      valor,
      nome,
      email,
      cpf,
      telefone,
      produto,
      endereco
    } = body;

    // Validações básicas
    if (!valor || !nome || !email || !cpf) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Limpar telefone (apenas números)
    const telefoneClean = telefone?.replace(/\D/g, '') || '';
    
    // Se não tiver telefone, usar um padrão
    const telefoneValido = telefoneClean.length >= 10 ? telefoneClean : '11999999999';

    // Preparar metadata com informações do usuário
    const metadata = JSON.stringify({
      nome: nome,
      cpf: cpf.replace(/\D/g, ''),
      email: email,
      telefone: telefoneValido,
      produto: produto || 'Assinatura Premium 002',
      valorEmReais: (valor / 100).toFixed(2),
      dataTransacao: new Date().toISOString()
    });

    // Criar transação na Umbrela
    const response = await fetch(`${UMBRELA_BASE_URL}/user/transactions`, {
      method: 'POST',
      headers: {
        'x-api-key': UMBRELA_API_KEY,
        'User-Agent': 'UMBRELLAB2B/1.0',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: valor, // Valor em centavos
        currency: 'BRL',
        paymentMethod: 'PIX',
        customer: {
          name: nome,
          email: email,
          document: {
            number: cpf.replace(/\D/g, ''), // Remove formatação
            type: 'CPF'
          },
          phone: telefoneValido, // Telefone sem formatação, obrigatório
          externalRef: '',
          address: {
            street: endereco?.street || 'Rua',
            streetNumber: endereco?.streetNumber || '0',
            complement: endereco?.complement || '',
            zipCode: endereco?.zipCode?.replace(/\D/g, '') || '00000000',
            neighborhood: endereco?.neighborhood || 'Centro',
            city: endereco?.city || 'São Paulo',
            state: endereco?.state || 'SP',
            country: 'br'
          }
        },
        shipping: {
          fee: 0,
          address: {
            street: endereco?.street || 'Rua',
            streetNumber: endereco?.streetNumber || '0',
            complement: endereco?.complement || '',
            zipCode: endereco?.zipCode?.replace(/\D/g, '') || '00000000',
            neighborhood: endereco?.neighborhood || 'Centro',
            city: endereco?.city || 'São Paulo',
            state: endereco?.state || 'SP',
            country: 'br'
          }
        },
        items: [{
          title: produto || 'Assinatura Premium 002',
          unitPrice: valor,
          quantity: 1,
          tangible: true,
          externalRef: ''
        }],
        pix: {
          expiresInDays: 1
        },
        postbackUrl: '',
        metadata: metadata, // Dados do usuário e transação
        traceable: true,
        ip: '0.0.0.0'
      })
    });

    const result = await response.json();

    if (result.status === 200) {
      return NextResponse.json({
        success: true,
        transactionId: result.data.id,
        qrCode: result.data.qrCode,
        status: result.data.status,
        expirationDate: result.data.pix?.expirationDate,
        amount: result.data.amount
      });
    }

    // Erro da API Umbrela
    return NextResponse.json(
      { error: 'Erro ao criar transação', details: result },
      { status: 500 }
    );

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
