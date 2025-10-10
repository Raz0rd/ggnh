'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, User, Clock, Car, Download, AlertTriangle } from 'lucide-react';

export default function SucessoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [protocolo, setProtocolo] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Gerar número de protocolo
    const gerarProtocolo = () => {
      const ano = new Date().getFullYear();
      const random = Math.floor(Math.random() * 900000) + 100000;
      return `CNH${ano}${random}`;
    };

    setProtocolo(gerarProtocolo());

    // Simular finalização da inscrição
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [user, router]);

  const handleDownloadComprovante = async () => {
    setIsDownloading(true);

    // Simular geração do PDF
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Carregar jsPDF dinamicamente
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Configurações de cores
    const azulGov: [number, number, number] = [19, 81, 180];
    const cinzaTexto: [number, number, number] = [60, 60, 60];

    // Header
    doc.setFillColor(...azulGov);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPROVANTE DE INSCRIÇÃO', 105, 18, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('CNH Social 2025', 105, 30, { align: 'center' });

    // Protocolo
    doc.setFillColor(...azulGov);
    doc.roundedRect(20, 50, 170, 25, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Protocolo: ${protocolo}`, 105, 60, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 105, 69, { align: 'center' });

    // Dados da Inscrição
    doc.setTextColor(...cinzaTexto);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados da Inscrição', 20, 90);

    // Box de dados
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, 95, 170, 85, 2, 2, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    let yPos = 105;
    
    // Candidato
    doc.text('Candidato:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(userBasicData.nome?.toUpperCase() || user?.nome?.toUpperCase() || 'CANDIDATO', 55, yPos);
    
    // CPF
    yPos += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('CPF:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(user?.cpf || '***.***.***-**', 55, yPos);
    
    // Data Prevista
    yPos += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Data Prevista:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(dataPrevista, 55, yPos);
    
    // Categoria
    yPos += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Categoria:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(categoria, 55, yPos);
    
    // Valor Pago
    yPos += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Valor Pago:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text('R$ 22,74', 55, yPos);
    
    // Status
    yPos += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', 25, yPos);
    doc.setTextColor(34, 139, 34);
    doc.setFont('helvetica', 'bold');
    doc.text('CONFIRMADO', 55, yPos);

    // Footer
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Este é um comprovante eletrônico válido.', 105, 200, { align: 'center' });
    doc.text('Guarde este documento para futuras referências.', 105, 206, { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} Governo Federal - CNH Social`, 105, 212, { align: 'center' });

    // Download do PDF
    doc.save(`Comprovante_CNH_Social_${protocolo}.pdf`);

    setIsDownloading(false);
  };

  // Recuperar dados do localStorage
  const userBasicData = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('userBasicData') || '{}')
    : {};

  const dataPrevista = 'quarta-feira, 22 de outubro de 2025 às 14:00h';
  const categoria = 'CNH Categoria B - Automóvel';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto max-w-2xl px-4 py-8">
        {/* Banner de Sucesso */}
        <div className="mb-6 rounded-lg bg-blue-600 px-6 py-12 text-center text-white shadow-lg">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white/20 p-4">
              <CheckCircle className="h-16 w-16" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold">Inscrição Realizada com Sucesso!</h1>
          <p className="text-lg opacity-95">
            Sua participação no programa CNH Social foi confirmada
          </p>
        </div>

        {/* Card de Parabéns */}
        {isLoading ? (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
              <div>
                <p className="text-lg font-semibold text-green-800">
                  🎉 Parabéns! Sua inscrição foi realizada com sucesso!
                </p>
                <p className="text-sm text-green-700">Finalizando inscrição...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
            <p className="text-lg font-semibold text-green-800">
              🎉 Parabéns! Sua inscrição foi realizada com sucesso!
            </p>
            <p className="mt-1 text-sm text-green-700">Inscrição finalizada com sucesso!</p>
          </div>
        )}

        {/* Número de Protocolo */}
        <div className="mb-6 rounded-lg border-2 border-blue-600 bg-blue-50 p-6 text-center shadow-sm">
          <p className="mb-2 text-sm font-medium text-blue-900">Número de Protocolo</p>
          <p className="text-3xl font-bold text-blue-600">{protocolo}</p>
          <p className="mt-2 text-xs text-blue-700">Guarde este número para acompanhamento</p>
        </div>

        {/* Resumo do Agendamento */}
        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Resumo do Agendamento</h2>

          <div className="space-y-5">
            {/* Candidato */}
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 flex-shrink-0 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Candidato</p>
                <p className="text-base font-semibold text-blue-600">
                  {userBasicData.nome?.toUpperCase() || user?.nome?.toUpperCase() || 'CANDIDATO'}
                </p>
              </div>
            </div>

            {/* Data Prevista */}
            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Data Prevista</p>
                <p className="text-base text-gray-900">{dataPrevista}</p>
              </div>
            </div>

            {/* Categoria */}
            <div className="flex items-start gap-3">
              <Car className="mt-1 h-5 w-5 flex-shrink-0 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Categoria</p>
                <p className="text-base text-blue-600">{categoria}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Download Comprovante */}
        <div className="mb-6">
          <button
            onClick={handleDownloadComprovante}
            disabled={isDownloading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
          >
            {isDownloading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Gerando comprovante...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Baixar Comprovante em PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Aviso de Biometria */}
        <div className="mb-6 rounded-lg border-2 border-blue-500 bg-blue-50 p-6 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <svg className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="mb-2 text-lg font-bold text-blue-900">Validação Biométrica Necessária</h3>
              <p className="text-sm text-blue-800">
                Para finalizar sua inscrição, precisamos validar sua identidade através do reconhecimento facial. Este processo é rápido e seguro.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/validacao-biometrica')}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Validar Biometria Agora
          </button>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-blue-900">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Próximos Passos
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>A autoescola entrará em contato em até 3 dias úteis para confirmar sua data de início</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Você receberá um e-mail com todas as informações sobre o curso</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Mantenha seus documentos (RG e CPF) em mãos para o primeiro dia de aula</span>
            </li>
          </ul>
        </div>

      </main>

      <Footer />
    </div>
  );
}
