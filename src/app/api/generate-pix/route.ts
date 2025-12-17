import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getClientIp(req: NextRequest): string {
  const headers = [
    'cf-connecting-ip',
    'x-real-ip',
    'x-forwarded-for',
    'x-client-ip',
  ];
  
  for (const header of headers) {
    const value = req.headers.get(header);
    if (value) {
      const ip = value.split(',')[0].trim();
      if (ip && ip !== 'unknown') {
        return ip;
      }
    }
  }
  
  return req.ip || 'unknown';
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

async function generatePixGhostPay(body: any, baseUrl: string) {
  const secretKey = process.env.GHOSTPAY_API_KEY
  const companyId = process.env.GHOSTPAY_COMPANY_ID
  
  console.log("\n👻 [GhostPay] Verificando autenticação:")
  console.log("  Secret Key:", secretKey ? "✓ Presente" : "✗ Ausente")
  console.log("  Company ID:", companyId ? "✓ Presente" : "✗ Ausente")
  
  if (!secretKey || !companyId) {
    console.error("❌ [GhostPay] Credenciais não configuradas")
    throw new Error("GHOSTPAY_API_KEY e GHOSTPAY_COMPANY_ID são obrigatórios")
  }

  console.log("📤 [GhostPay] Gerando PIX - Valor: R$", (body.amount / 100).toFixed(2))
  console.log("🌐 [GhostPay] URL dinâmica detectada:", baseUrl)

  const generateFakeEmail = (name: string): string => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    return `${cleanName}@gmail.com` 
  }

  const getDomainPrefix = (url: string): string => {
    try {
      const hostname = new URL(url).hostname
      const domain = hostname.replace('www.', '').split('.')[0]
      return domain.substring(0, 5).toUpperCase()
    } catch {
      return 'PROD'
    }
  }

  const domainPrefix = getDomainPrefix(baseUrl)

  const ghostPayload = {
    amount: body.amount,
    paymentMethod: 'pix',
    customer: {
      name: body.customer.name,
      email: generateFakeEmail(body.customer.name),
      phone: body.customer.phone,
      document: {
        number: body.customer.document.number || body.customer.document,
        type: 'cpf'
      }
    },
    items: [
      {
        title: `${domainPrefix} - ${body.itemType === "recharge" ? "eBook eSport Digital Premium" : "eBook eSport Gold Edition"}`,
        unitPrice: body.amount,
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
      body: errorText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    throw new Error(`Erro na API de pagamento: ${response.status}`)
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

  const normalizedResponse = {
    transactionId,
    pixCode,
    qrCode: qrCodeImage,
    success: true
  }
  console.log("🎉 [GhostPay] RESPOSTA NORMALIZADA (dados essenciais)")
  return normalizedResponse
}

async function generatePixUmbrela(body: any, baseUrl: string) {
  const apiKey = process.env.UMBRELA_API_KEY
  
  console.log("\n☂️ [Umbrela] Verificando autenticação:", apiKey ? "✓ Token presente" : "✗ Token ausente")
  
  if (!apiKey) {
    console.error("❌ [Umbrela] UMBRELA_API_KEY não configurado")
    throw new Error("UMBRELA_API_KEY não configurado no servidor")
  }

  console.log("📤 [Umbrela] Gerando PIX - Valor: R$", (body.amount / 100).toFixed(2))
  console.log("🌐 [Umbrela] URL dinâmica detectada:", baseUrl)

  const generateFakeEmail = (name: string): string => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    return `${cleanName}@gmail.com` 
  }

  const generateIptvProductName = (itemType: string, amount: number): string => {
    const variants = [200, 250, 300, 350, 400, 500, 600]
    const randomVariant = variants[Math.floor(Math.random() * variants.length)]
    
    if (itemType === "recharge") {
      return `IPTV Assinatura Premium ${randomVariant}new` 
    } else {
      return `IPTV Gold Premium ${randomVariant}new` 
    }
  }

  const ADDRESSES = [
    { cep: "12510516", cidade: "Guaratinguetá", estado: "SP", bairro: "Bosque dos Ipês", rua: "Rua Fábio Rangel Dinamarco" },
    { cep: "58400295", cidade: "Campina Grande", estado: "PB", bairro: "Centro", rua: "Rua Frei Caneca" },
    { cep: "66025660", cidade: "Belém", estado: "PA", bairro: "Jurunas", rua: "Rua dos Mundurucus" },
    { cep: "37206660", cidade: "Lavras", estado: "MG", bairro: "Jardim Floresta", rua: "Rua Tenente Fulgêncio" },
    { cep: "13150148", cidade: "Cosmópolis", estado: "SP", bairro: "Jardim Bela Vista", rua: "Rua Eurides de Godoi" }
  ]
  
  const randomAddress = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)]
  
  const defaultAddress = {
    street: randomAddress.rua || "Rua Digital",
    streetNumber: "123",
    complement: "",
    zipCode: randomAddress.cep || "01000000",
    neighborhood: randomAddress.bairro || "Centro",
    city: randomAddress.cidade || "São Paulo",
    state: randomAddress.estado || "SP",
    country: "br"
  }

  const customerCPF = body.customer.document.number || body.customer.document
  const customerEmail = body.customer.email || generateFakeEmail(body.customer.name)
  
  const metadataObject = {
    usuario: {
      nome: body.customer.name,
      cpf: customerCPF,
      email: customerEmail,
      telefone: body.customer.phone,
      endereco: `${randomAddress.rua}, 123 - ${randomAddress.bairro}, ${randomAddress.cidade}/${randomAddress.estado} - CEP: ${randomAddress.cep}` 
    },
    pedido: {
      valor_centavos: body.amount,
      valor_reais: (body.amount / 100).toFixed(2)
    }
  }
  
  const metadata = JSON.stringify(metadataObject)

  const umbrelaPayload = {
    amount: body.amount,
    currency: "BRL",
    paymentMethod: "PIX",
    customer: {
      name: body.customer.name,
      email: customerEmail,
      document: {
        number: customerCPF,
        type: "CPF"
      },
      phone: body.customer.phone,
      externalRef: "",
      address: defaultAddress
    },
    shipping: {
      fee: 0,
      address: defaultAddress
    },
    items: [{
      title: generateIptvProductName(body.itemType, body.amount),
      unitPrice: body.amount,
      quantity: 1,
      tangible: false,
      externalRef: ""
    }],
    pix: {
      expiresInDays: 1
    },
    postbackUrl: `${baseUrl}/api/webhook`,
    metadata: metadata,
    traceable: true,
    ip: "0.0.0.0"
  }
  
  console.log("🚀 [Umbrela] Enviando requisição para API...")
  
  const response = await fetch("https://api-gateway.umbrellapag.com/api/user/transactions", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "User-Agent": "UMBRELLAB2B/1.0",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(umbrelaPayload),
  })

  console.log("📡 [Umbrela] Status:", response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ [Umbrela] ERROR RESPONSE:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    })
    
    throw new Error(`Erro na API Umbrela: ${response.status}`)
  }

  const data = await response.json()

  const transactionId = data.data?.id
  const pixCode = data.data?.qrCode
  const qrCodeImage = data.data?.qrCode
  
  console.log("🔍 [Umbrela] DADOS EXTRAÍDOS:", {
    transactionId,
    pixCode: pixCode ? `${pixCode.substring(0, 50)}...` : null,
    status: data.data?.status
  })
  
  const normalizedResponse = {
    transactionId,
    pixCode,
    qrCode: qrCodeImage,
    success: true
  }
  
  console.log("🎉 [Umbrela] RESPOSTA NORMALIZADA (dados essenciais)")
  return normalizedResponse
}

export async function POST(request: NextRequest) {
  try {
    const gateway = process.env.PAYMENT_GATEWAY || 'ghostpay'
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("🚀 [GATEWAY] Iniciando geração de PIX")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("🎯 [GATEWAY] Gateway selecionado:", gateway)
    
    const body = await request.json()
    
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
    const baseUrl = `${protocol}://${host}` 
    
    console.log("🌐 [URL DEBUG] Headers recebidos:", {
      host: request.headers.get('host'),
      'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
      protocol,
      baseUrl
    })
    
    let result: any
    
    if (gateway === 'ghostpay') {
      result = await generatePixGhostPay(body, baseUrl)
    } else if (gateway === 'umbrela') {
      result = await generatePixUmbrela(body, baseUrl)
    } else {
      result = await generatePixGhostPay(body, baseUrl)
    }
    
    if (!result || !result.transactionId) {
      throw new Error("Resposta inválida do gateway de pagamento")
    }
    
    const validResult = result as { transactionId: string; pixCode: string; qrCode: string; success: boolean }
    
    console.log("✅ [GATEWAY] PIX gerado com sucesso!")
    console.log("   - Transaction ID:", validResult.transactionId)
    console.log("   - Valor: R$", (body.amount / 100).toFixed(2))
    console.log("   - Cliente:", body.customer?.name)
    
    return NextResponse.json(validResult)
  } catch (error) {
    console.error("💥 [GATEWAY] ERRO:", error instanceof Error ? error.message : 'Unknown error')
    
    const userMessage = error instanceof Error ? error.message : 'Erro ao processar pagamento. Tente novamente.'
    
    return NextResponse.json({ 
      error: userMessage,
      success: false 
    }, { status: 500 })
  }
}
