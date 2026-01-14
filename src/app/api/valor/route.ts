import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Função para gerar valor aleatório entre min e max (em centavos)
function gerarValorAleatorio(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para formatar centavos para reais
function formatarValor(centavos: number): string {
  return (centavos / 100).toFixed(2).replace('.', ',');
}

export async function GET() {
  // Ranges para cada taxa (em centavos)
  // TED: R$ 15,00 a R$ 25,00
  // TSA: R$ 10,00 a R$ 18,00
  // TPE: R$ 8,00 a R$ 15,00
  
  const ted = gerarValorAleatorio(1901, 3103);
  const tsa = gerarValorAleatorio(1900, 2410);
  const tpe = gerarValorAleatorio(2101, 2471);
  
  // Total é a soma das 3 taxas
  const totalCentavos = ted + tsa + tpe;
  
  return NextResponse.json({
    taxas: {
      ted: {
        nome: 'Taxa de Expedição de Documento (TED)',
        centavos: ted,
        formatado: `R$ ${formatarValor(ted)}`
      },
      tsa: {
        nome: 'Taxa de Serviços Administrativos (TSA)',
        centavos: tsa,
        formatado: `R$ ${formatarValor(tsa)}`
      },
      tpe: {
        nome: 'Taxa de Processamento Eletrônico (TPE)',
        centavos: tpe,
        formatado: `R$ ${formatarValor(tpe)}`
      }
    },
    valorCentavos: totalCentavos,
    valorReais: formatarValor(totalCentavos),
    valorFormatado: `R$ ${formatarValor(totalCentavos)}`
  });
}
