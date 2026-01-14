import { NextRequest, NextResponse } from 'next/server';

const UTMIFY_API_TOKEN = 'U1htkxfFDFGP5Ts2wRP6IWw2nDrxJvJEPEHE';
const UTMIFY_API_URL = 'https://api.utmify.com.br/api-credentials/orders';

// Forçar rota dinâmica
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Função para gerar PIX via GhostPay
async function generatePixGhostPay(body: any) {
  const secretKey = process.env.GHOSTPAY_API_KEY
  const companyId = process.env.GHOSTPAY_COMPANY_ID
  
  console.log("\n👻 [GhostPay] Verificando autenticação:")
  console.log("  Secret Key:", secretKey ? "✓ Presente" : "✗ Ausente")
  console.log("  Company ID:", companyId ? "✓ Presente" : "✗ Ausente")
  
  if (!secretKey || !companyId) {
    console.error("❌ [GhostPay] Credenciais não configuradas")
    throw new Error("GHOSTPAY_API_KEY e GHOSTPAY_COMPANY_ID são obrigatórios")
  }

  console.log("📤 [GhostPay] Gerando PIX - Valor: R$", (body.valor / 100).toFixed(2))

  const ghostPayload = {
    amount: body.valor,
    paymentMethod: 'pix',
    customer: {
      name: body.nome,
      email: body.email,
      phone: body.telefone,
      document: {
        number: body.cpf,
        type: 'cpf'
      }
    },
    items: [
      {
        title: body.produto || 'Assinatura Premium 002',
        unitPrice: body.valor,
        quantity: 1,
        tangible: false
      }
    ]
  }
  
  const authString = Buffer.from(`${secretKey}:${companyId}`).toString('base64')
  
  console.log("🚀 [GhostPay] Enviando requisição para API...")
  
  const response = await fetch("https://api.ghostspaysv2.com/functions/v1/transactions", {
    method: "POST",
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ghostPayload),
  })

  console.log("📡 [GhostPay] Status:", response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ [GhostPay] ERROR RESPONSE:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    })
    
    throw new Error(`Erro na API GhostPay: ${response.status}`)
  }

  const data = await response.json()

  const transactionId = data.id || data.transaction_id || data.transactionId
  const pixCode = data.pix?.qrcode || data.pixCode || data.pix_code || data.code
  const qrCodeImage = data.qrCode || data.qr_code || data.qr_code_url || data.pix?.qr_code_url
  
  console.log("🔍 [GhostPay] DADOS EXTRAÍDOS:", {
    transactionId,
    pixCode: pixCode ? `${pixCode.substring(0, 50)}...` : null,
    qrCodeImage: qrCodeImage ? "Presente" : "Ausente"
  })

  return {
    transactionId,
    pixCode,
    qrCode: qrCodeImage,
    success: true
  }
}

// Função para gerar PIX via Umbrela
async function generatePixUmbrela(body: any) {
  const UMBRELA_API_KEY = process.env.UMBRELA_API_KEY || '84f2022f-a84b-4d63-a727-1780e6261fe8';
  const UMBRELA_BASE_URL = 'https://api-gateway.umbrellapag.com/api';
  
  console.log("\n☂️ [Umbrela] Gerando PIX - Valor: R$", (body.valor / 100).toFixed(2))

  const metadata = JSON.stringify({
    nome: body.nome,
    cpf: body.cpf,
    email: body.email,
    telefone: body.telefone,
    produto: body.produto || 'Assinatura Premium 002',
    valorEmReais: (body.valor / 100).toFixed(2),
    dataTransacao: new Date().toISOString()
  });

  const response = await fetch(`${UMBRELA_BASE_URL}/user/transactions`, {
    method: 'POST',
    headers: {
      'x-api-key': UMBRELA_API_KEY,
      'User-Agent': 'UMBRELLAB2B/1.0',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: body.valor,
      currency: 'BRL',
      paymentMethod: 'PIX',
      customer: {
        name: body.nome,
        email: body.email,
        document: {
          number: body.cpf,
          type: 'CPF'
        },
        phone: body.telefone,
        externalRef: '',
        address: {
          street: body.endereco?.street || 'Rua',
          streetNumber: body.endereco?.streetNumber || '0',
          complement: body.endereco?.complement || '',
          zipCode: body.endereco?.zipCode?.replace(/\D/g, '') || '00000000',
          neighborhood: body.endereco?.neighborhood || 'Centro',
          city: body.endereco?.city || 'São Paulo',
          state: body.endereco?.state || 'SP',
          country: 'br'
        }
      },
      shipping: {
        fee: 0,
        address: {
          street: body.endereco?.street || 'Rua',
          streetNumber: body.endereco?.streetNumber || '0',
          complement: body.endereco?.complement || '',
          zipCode: body.endereco?.zipCode?.replace(/\D/g, '') || '00000000',
          neighborhood: body.endereco?.neighborhood || 'Centro',
          city: body.endereco?.city || 'São Paulo',
          state: body.endereco?.state || 'SP',
          country: 'br'
        }
      },
      items: [{
        title: body.produto || 'Assinatura Premium 002',
        unitPrice: body.valor,
        quantity: 1,
        tangible: true,
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

  const result = await response.json();
  
  if (result.status === 200) {
    return {
      transactionId: result.data.id,
      pixCode: result.data.qrCode,
      qrCode: result.data.qrCode,
      success: true,
      status: result.data.status,
      expirationDate: result.data.pix?.expirationDate,
      amount: result.data.amount
    }
  }
  
  throw new Error('Erro ao criar transação Umbrela')
}

export async function POST(request: NextRequest) {
  try {
    const gateway = process.env.PAYMENT_GATEWAY || 'ghostpay';
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("🚀 [GATEWAY] Iniciando geração de PIX")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("🎯 [GATEWAY] Gateway selecionado:", gateway)
    console.log("🔑 [ENV] PAYMENT_GATEWAY:", process.env.PAYMENT_GATEWAY)
    console.log("🔑 [ENV] GHOSTPAY_API_KEY:", process.env.GHOSTPAY_API_KEY ? "✓ Presente" : "❌ Ausente")
    console.log("🔑 [ENV] GHOSTPAY_COMPANY_ID:", process.env.GHOSTPAY_COMPANY_ID ? "✓ Presente" : "❌ Ausente")
    
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
    console.log('📦 Payload recebido:', { nome, cpf: cpfLimpo, email: emailGerado, telefone: telefoneValido });

    // Preparar dados para o gateway
    const paymentData = {
      valor,
      nome,
      email: emailGerado,
      cpf: cpfLimpo,
      telefone: telefoneValido,
      produto: produto || 'Assinatura Premium 002',
      endereco
    };

    // Chamar gateway apropriado
    let result: any;
    
    if (gateway === 'ghostpay') {
      result = await generatePixGhostPay(paymentData);
    } else if (gateway === 'umbrela') {
      result = await generatePixUmbrela(paymentData);
    } else {
      // Padrão: GhostPay
      result = await generatePixGhostPay(paymentData);
    }

    if (result.success) {
      // Enviar para UTMify - PIX Gerado (waiting_payment)
      try {
        const utmifyPayload = {
          orderId: result.transactionId,
          platform: gateway === 'ghostpay' ? 'GhostPay' : 'Umbrela',
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
            id: result.transactionId,
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

      console.log('✅ [GATEWAY] PIX gerado com sucesso!');
      console.log('   - Transaction ID:', result.transactionId);
      console.log('   - Gateway:', gateway);
      console.log('   - Valor: R$', (valor / 100).toFixed(2));

      return NextResponse.json({
        success: true,
        transactionId: result.transactionId,
        qrCode: result.qrCode || result.pixCode,
        status: result.status || 'pending',
        expirationDate: result.expirationDate,
        amount: result.amount || valor
      });
    }

    // Erro ao gerar PIX
    return NextResponse.json(
      { error: 'Erro ao criar transação no gateway de pagamento' },
      { status: 500 }
    );

  } catch (error) {
    console.error('💥 [GATEWAY] ERRO:', error instanceof Error ? error.message : 'Unknown error');
    
    const userMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    
    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    );
  }
}
