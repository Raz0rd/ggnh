import { NextRequest, NextResponse } from 'next/server';

const UMBRELA_API_KEY = process.env.UMBRELA_API_KEY || '84f2022f-a84b-4d63-a727-1780e6261fe8';
const UMBRELA_BASE_URL = 'https://api-gateway.umbrellapag.com/api';
const UTMIFY_API_TOKEN = 'KVRxalfMiBfm8Rm1nP5YxfwYzArNsA0VLeWC';
const UTMIFY_API_URL = 'https://api.utmify.com.br/api-credentials/orders';

// Forçar rota dinâmica
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Função para gerar QR Code via API externa
async function generateQRCodeImage(text: string): Promise<string> {
  try {
    // Usar API pública para gerar QR Code
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(text)}`;
    return qrApiUrl;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, cpf, telefone } = body;

    // Validação básica
    if (!nome || !cpf) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
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

    // Valor da validação biométrica: R$ 14,59 em centavos
    const valor = 1459;

    // Preparar metadata
    const metadata = JSON.stringify({
      tipo: 'validacao_biometrica',
      nome: nome,
      cpf: cpfLimpo,
      email: emailGerado,
      telefone: telefoneValido,
      valorEmReais: (valor / 100).toFixed(2),
      dataTransacao: new Date().toISOString()
    });

    console.log('📤 Criando transação Umbrela:', {
      url: `${UMBRELA_BASE_URL}/user/transactions`,
      valor: valor,
      nome: nome,
      cpf: cpfLimpo,
      email: emailGerado,
      telefone: telefoneValido
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
        amount: valor,
        currency: 'BRL',
        paymentMethod: 'PIX',
        customer: {
          name: nome,
          email: emailGerado,
          document: {
            number: cpfLimpo,
            type: 'CPF'
          },
          phone: telefoneValido,
          externalRef: '',
          address: {
            street: 'Rua',
            streetNumber: '0',
            complement: '',
            zipCode: '00000000',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            country: 'br'
          }
        },
        shipping: {
          fee: 0,
          address: {
            street: 'Rua',
            streetNumber: '0',
            complement: '',
            zipCode: '00000000',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            country: 'br'
          }
        },
        items: [{
          title: 'Taxa de VB',
          unitPrice: valor,
          quantity: 1,
          tangible: false,
          externalRef: ''
        }],
        pix: {
          expiresInDays: 1
        },
        postbackUrl: '',
        metadata: metadata,
        traceable: true,
        ip: '0.0.0.0'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      console.error('❌ Erro Umbrela:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return NextResponse.json(
        { success: false, error: 'Erro ao criar transação', details: errorData },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    console.log('✅ Resposta Umbrela:', JSON.stringify(result, null, 2));

    // A resposta da Umbrela vem em result.data
    const data = result.data || result;
    const qrCodeText = data.qrCode || data.pix?.qrCode || '';
    
    // Gerar imagem do QR Code se não vier da API
    let qrCodeImage = data.qrCodeImage || data.pix?.qrCodeImage || '';
    if (!qrCodeImage && qrCodeText) {
      qrCodeImage = await generateQRCodeImage(qrCodeText);
    }

    // Enviar para UTMify - PIX Gerado (waiting_payment)
    try {
      const metadataObj = JSON.parse(metadata);
      const utmifyPayload = {
        orderId: data.id,
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
          id: data.id,
          name: 'Taxa de Validação Biométrica',
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
      // Não bloquear o fluxo se UTMify falhar
    }

    return NextResponse.json({
      success: true,
      transactionId: data.id,
      qrCode: qrCodeText,
      qrCodeImage: qrCodeImage
    });

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
