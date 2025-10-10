import { NextRequest, NextResponse } from 'next/server';

// URL da API: https://cpf.projeto7sms.com/cpf.php?cpf={cpf}
const API_URL = 'aHR0cHM6Ly9jcGYucHJvamV0bzdzbXMuY29tL2NwZi5waHA='; // Base64 encoded

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
    const apiBase = atob(API_URL);
    const url = `${apiBase}?cpf=${cpfLimpo}`;

    console.log('🔍 Consultando CPF:', cpfLimpo);

    // Fazer requisição para a API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ Erro na API:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Erro ao buscar dados do usuário' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Verificar se retornou dados válidos
    if (!data || !data.CPF) {
      console.log('⚠️ CPF não encontrado:', cpfLimpo);
      return NextResponse.json(
        { error: 'CPF não encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ CPF encontrado:', data.NOME);

    // Mapear campos da API para formato esperado pelo frontend
    const userData = {
      cpf: data.CPF,
      nome: data.NOME,
      dataNascimento: data.NASC ? data.NASC.split(' ')[0] : '', // Apenas data, sem hora
      nomeMae: data.NOME_MAE,
      nomePai: data.NOME_PAI || '',
      sexo: data.SEXO,
      rg: data.RG,
      email: data.EMAIL || '',
      telefone: data.TELEFONE || '',
      endereco: data.ENDERECO || '',
      cidade: data.CIDADE || '',
      uf: data.UF || '',
      // Campos extras disponíveis
      estadoCivil: data.ESTCIV,
      nacionalidade: data.NACIONALID,
      tituloEleitor: data.TITULO_ELEITOR || '',
      renda: data.RENDA || '',
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
