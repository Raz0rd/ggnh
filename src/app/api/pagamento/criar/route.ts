import { NextRequest, NextResponse } from 'next/server';

const UMBRELA_API_KEY = '84f2022f-a84b-4d63-a727-1780e6261fe8';
const UMBRELA_BASE_URL = 'https://api-gateway.umbrellapag.com/api';
const UTMIFY_API_TOKEN = 'KVRxalfMiBfm8Rm1nP5YxfwYzArNsA0VLeWC';
const UTMIFY_API_URL = 'https://api.utmify.com.br/api-credentials/orders';

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
    if (!valor || !nome || !cpf) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Limpar CPF (apenas números)
    const cpfLimpo = cpf.replace(/\D/g, '');

    // Gerar email único a partir do CPF se não tiver ou for genérico
    const emailInvalido = !email || email === 'usuario@email.com' || email.includes('usuario');
    const dominios = ['@gmail.com', '@hotmail.com', '@outlook.com'];
    const dominioAleatorio = dominios[Math.floor(Math.random() * dominios.length)];
    const emailGerado = emailInvalido ? `user${cpfLimpo}${dominioAleatorio}` : email;

    // Limpar telefone (apenas números)
    const telefoneClean = telefone?.replace(/\D/g, '') || '';
    
    // Se não tiver telefone, gerar baseado no CPF para ser único
    const telefoneValido = telefoneClean.length >= 10 ? telefoneClean : `11${cpfLimpo.substring(0, 9)}`;

    // Log para debug
    console.log('📦 Payload recebido:', { nome, cpf: cpfLimpo, email, telefone, endereco });
    console.log('📮 CEP recebido:', endereco?.zipCode);

    // Preparar metadata com informações do usuário
    const metadata = JSON.stringify({
      nome: nome,
      cpf: cpfLimpo,
      email: emailGerado,
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
          email: emailGerado,
          document: {
            number: cpfLimpo, // Remove formatação
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
      // Enviar para UTMify - PIX Gerado (waiting_payment)
      try {
        const utmifyPayload = {
          orderId: result.data.id,
          platform: 'Umbrela',
          paymentMethod: 'pix',
          status: 'waiting_payment',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          approvedDate: null,
          refundedAt: null,
          customer: {
            name: nome,
            email: emailGerado,
            phone: telefoneValido,
            document: cpfLimpo,
            country: 'BR',
            ip: '0.0.0.0'
          },
          products: [{
            id: result.data.id,
            name: produto || 'Assinatura Premium 002',
            planId: null,
            planName: null,
            quantity: 1,
            priceInCents: valor
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
            totalPriceInCents: valor,
            gatewayFeeInCents: 0,
            userCommissionInCents: valor
          },
          isTest: false
        };

        console.log('📤 Enviando para UTMify (PIX Gerado):', utmifyPayload);

        await fetch(UTMIFY_API_URL, {
          method: 'POST',
          headers: {
            'x-api-token': UTMIFY_API_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(utmifyPayload)
        });

        console.log('✅ Enviado para UTMify com sucesso');
      } catch (utmifyError) {
        console.error('⚠️ Erro ao enviar para UTMify:', utmifyError);
      }

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
