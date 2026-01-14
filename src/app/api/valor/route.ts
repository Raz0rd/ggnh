import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const valorMin = parseInt(process.env.VALOR_MIN || '3722');
  const valorMax = parseInt(process.env.VALOR_MAX || '6033');
  
  // Gerar valor aleatório entre min e max
  const valorCentavos = Math.floor(Math.random() * (valorMax - valorMin + 1)) + valorMin;
  const valorReais = (valorCentavos / 100).toFixed(2).replace('.', ',');
  
  return NextResponse.json({
    valorCentavos,
    valorReais,
    valorFormatado: `R$ ${valorReais}`
  });
}
