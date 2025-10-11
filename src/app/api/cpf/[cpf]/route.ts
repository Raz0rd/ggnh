import { NextRequest, NextResponse } from 'next/server';

// URL da API configurável via ENV
// Formato: http://74.50.76.90:7000/f9361c92e28d38772782e826d2442d07c5fdd833d9b3efe4beadffae322292da/cpf/{cpf}
const CPF_API_BASE = process.env.CPF_API_BASE || 'http://74.50.76.90:7000';
const CPF_API_TOKEN = process.env.CPF_API_TOKEN || 'f9361c92e28d38772782e826d2442d07c5fdd833d9b3efe4beadffae322292da';

// Forçar rota dinâmica
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { cpf: string } }
) {
  try {
    const { cpf } = params;

    // Limpar CPF (remover pontos e traços)
    const cpfLimpo = cpf.replace(/\D/g, '');

    // Validar CPF
    if (cpfLimpo.length !== 11) {
      return NextResponse.json(
        { error: 'CPF inválido' },
        { status: 400 }
      );
    }

    // Construir URL da API
    const url = `${CPF_API_BASE}/${CPF_API_TOKEN}/cpf/${cpfLimpo}`;

    console.log('🔍 Consultando CPF:', cpfLimpo);
    console.log('🌐 URL:', url);

    // Fazer requisição simples (sem headers suspeitos)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'python-requests/2.31.0',
      },
    });
    
    console.log('📊 Status da resposta:', response.status);

    if (!response.ok) {
      console.error('❌ Erro na API:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Erro ao buscar dados do usuário' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Verificar se retornou dados válidos
    if (!data || !data.cpf) {
      console.log('⚠️ CPF não encontrado:', cpfLimpo);
      return NextResponse.json(
        { error: 'CPF não encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ CPF encontrado:', data.nomeCompleto);

    // Converter data de DD-MM-YYYY para YYYY-MM-DD
    const dataNascFormatada = data.dataNascimento 
      ? data.dataNascimento.split('-').reverse().join('-') 
      : '';

    // Pegar primeiro endereço (prioridade mais alta)
    const enderecoObj = data.enderecos && data.enderecos.length > 0 ? data.enderecos[0] : {};
    
    // Pegar primeiro telefone
    const telefone = data.telefones && data.telefones.length > 0 ? data.telefones[0] : '';
    
    // Pegar email do neon ou do array emails
    const email = (data.neon && data.neon.length > 0 && data.neon[0].email) 
      || (data.emails && data.emails.length > 0 ? data.emails[0] : '') 
      || '';

    // Mapear campos da API para formato esperado pelo frontend
    const userData = {
      cpf: data.cpf,
      nome: data.nomeCompleto,
      dataNascimento: dataNascFormatada,
      nomeMae: data.nomeMae || '',
      nomePai: data.nomePai || '',
      sexo: data.sexo,
      rg: data.rg || 'Sem informação',
      email: email,
      telefone: telefone,
      endereco: enderecoObj.ENDERECO || '',
      cidade: enderecoObj.CIDADE || '',
      uf: enderecoObj.UF || '',
      cep: enderecoObj.CEP || '',
      bairro: enderecoObj.BAIRRO || '',
      // Campos extras disponíveis
      tituloEleitor: data.tituloEleitor || '',
      renda: data.renda || '',
      score: data.score || '',
      orgaoEmissor: data.orgaoEmissor || 'Sem informação',
    };

    return NextResponse.json(userData);

  } catch (error) {
    console.error('❌ Erro na API /api/cpf:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
