'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar as CalendarIcon, Clock, Car } from 'lucide-react';

function AgendamentoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [telefone, setTelefone] = useState('');
  const [telefoneConfirmado, setTelefoneConfirmado] = useState(false);
  const [editandoTelefone, setEditandoTelefone] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  
  // Calcular data mínima (hoje + 7 dias)
  const dataMinima = new Date();
  dataMinima.setDate(dataMinima.getDate() + 7);
  dataMinima.setHours(0, 0, 0, 0);
  
  // Iniciar calendário no mês da data mínima
  const [mesAtual, setMesAtual] = useState(new Date(dataMinima.getFullYear(), dataMinima.getMonth(), 1));
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPagamento, setIsLoadingPagamento] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const autoescola = searchParams.get('autoescola');
    const categoria = searchParams.get('categoria');
    const cep = searchParams.get('cep');

    if (!autoescola || !categoria || !cep) {
      router.push('/enderecos');
      return;
    }
  }, [user, searchParams, router]);

  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarTelefone(e.target.value);
    setTelefone(formatted);
    if (errorMessage) setErrorMessage('');
  };

  const handleConfirmarTelefone = () => {
    const numbers = telefone.replace(/\D/g, '');
    if (numbers.length < 10) {
      setErrorMessage('Digite um telefone válido');
      return;
    }
    setTelefoneConfirmado(true);
    setErrorMessage('');
  };

  const getCategoriaLabel = (cat: string | null) => {
    if (cat === 'B') return 'Automóvel';
    if (cat === 'A') return 'Motocicleta';
    if (cat === 'AB') return 'Automóvel e Motocicleta';
    return 'Automóvel';
  };

  const getAutoescolaInfo = (id: string | null) => {
    if (id === '1') {
      return {
        nome: 'Escola de Condutores Moto São José',
        endereco: 'Rua Ministro Antônio Coelho, Vila Velha, Fortaleza. Região Geográfica Imediata de Fortaleza, Região Geográfica Intermediária de Fortaleza, Ceará. Região Nordeste, 60347-230, Brasil'
      };
    }
    return {
      nome: 'Academia de Condutores Especializada',
      endereco: 'Rua Ministro Antônio Coelho, Vila Velha, Fortaleza. Região Geográfica Imediata de Fortaleza, Região Geográfica Intermediária de Fortaleza, Ceará. Região Nordeste, 60347-230, Brasil'
    };
  };

  const getDiasDoMes = () => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasAntes = primeiroDia.getDay();
    const diasNoMes = ultimoDia.getDate();

    const dias: (Date | null)[] = [];

    // Dias do mês anterior
    const mesAnterior = new Date(ano, mes, 0);
    for (let i = diasAntes - 1; i >= 0; i--) {
      dias.push(new Date(ano, mes - 1, mesAnterior.getDate() - i));
    }

    // Dias do mês atual
    for (let dia = 1; dia <= diasNoMes; dia++) {
      dias.push(new Date(ano, mes, dia));
    }

    // Completar até 42 (6 semanas)
    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push(new Date(ano, mes + 1, i));
    }

    return dias;
  };

  const formatarData = (data: Date | null) => {
    if (!data) return 'Selecione uma data no calendário';
    
    const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    return `${diasSemana[data.getDay()]}, ${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
  };

  const handleContinuar = async () => {
    if (!dataSelecionada) return;

    setIsLoadingPagamento(true);
    
    // Salvar telefone, data e CEP no localStorage
    const userBasicData = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('userBasicData') || '{}')
      : {};
    
    const cep = searchParams.get('cep');
    
    localStorage.setItem('userBasicData', JSON.stringify({
      ...userBasicData,
      telefone: telefone.replace(/\D/g, ''), // Salvar sem formatação
      dataAgendamento: dataSelecionada.toISOString(),
      dataAgendamentoFormatada: formatarData(dataSelecionada),
      cep: cep?.replace(/\D/g, '') || ''
    }));
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Preparar parâmetros para a página de pagamento
    const schoolId = searchParams.get('autoescola');
    const category = searchParams.get('categoria');
    const date = dataSelecionada.toISOString().split('T')[0];
    
    router.push(`/pagamento?cep=${cep}&schoolId=${schoolId}&category=${category}&date=${date}`);
  };

  const mesNome = mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const autoescolaInfo = getAutoescolaInfo(searchParams.get('autoescola'));
  const categoria = getCategoriaLabel(searchParams.get('categoria'));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto max-w-2xl px-4 py-8">
        {/* Título */}
        <div className="mb-8 border-l-4 border-blue-600 pl-4">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Agendamento de Início das Aulas</h1>
          <p className="text-sm text-gray-600">CNH Social 2026 - Escolha a data de início do seu curso</p>
        </div>

        {/* Campo de Telefone */}
        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-gray-900">Informe seu telefone</h2>
          <p className="mb-4 text-sm text-gray-600">
            A autoescola entrará em contato para confirmar seu agendamento
          </p>

          <label htmlFor="telefone" className="mb-2 block text-sm font-medium text-gray-700">
            Número de telefone
          </label>
          <div className="flex gap-2">
            <input
              id="telefone"
              type="text"
              value={telefone}
              onChange={handleTelefoneChange}
              placeholder="(11) 99999-9999"
              maxLength={15}
              disabled={telefoneConfirmado && !editandoTelefone}
              className={`flex-1 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${
                errorMessage
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } ${telefoneConfirmado && !editandoTelefone ? 'bg-gray-100' : ''}`}
            />
            {telefoneConfirmado && !editandoTelefone && (
              <button
                onClick={() => setEditandoTelefone(true)}
                className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Editar
              </button>
            )}
          </div>
          {errorMessage && (
            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          )}

          <button
            onClick={() => {
              if (editandoTelefone) {
                handleConfirmarTelefone();
                setEditandoTelefone(false);
              } else {
                handleConfirmarTelefone();
              }
            }}
            disabled={telefoneConfirmado && !editandoTelefone}
            className={`mt-4 w-full rounded-lg px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors ${
              telefoneConfirmado && !editandoTelefone
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {editandoTelefone ? 'Salvar telefone' : 'Confirmar telefone'}
          </button>

          <div className="mt-4 flex items-start gap-2 rounded-md bg-blue-50 p-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Importante:</span> A autoescola utilizará este número para entrar em contato e confirmar a data exata de início das suas aulas.
            </p>
          </div>
        </div>

        {/* Calendário */}
        {telefoneConfirmado && (
          <>
            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                Escolha a data de início
              </h2>

              {/* Navegação do mês */}
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={() => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1))}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  ««
                </button>
                <button
                  onClick={() => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1))}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  ‹
                </button>
                <span className="text-center font-medium text-gray-900">{mesNome}</span>
                <button
                  onClick={() => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1))}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  ›
                </button>
                <button
                  onClick={() => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1))}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  »»
                </button>
              </div>

              {/* Dias da semana */}
              <div className="mb-2 grid grid-cols-7 gap-1">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(dia => (
                  <div key={dia} className="py-2 text-center text-xs font-medium text-gray-600">
                    {dia}
                  </div>
                ))}
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-1">
                {getDiasDoMes().map((dia, index) => {
                  const mesDoCalendario = dia?.getMonth() === mesAtual.getMonth();
                  const diaSelecionado = dataSelecionada && dia && 
                    dataSelecionada.getDate() === dia.getDate() &&
                    dataSelecionada.getMonth() === dia.getMonth();
                  
                  // Verificar se a data é válida (>= data mínima)
                  const diaValido = dia && dia >= dataMinima;
                  const diaDesabilitado = !mesDoCalendario || !diaValido;

                  return (
                    <button
                      key={index}
                      onClick={() => dia && mesDoCalendario && diaValido && setDataSelecionada(dia)}
                      disabled={diaDesabilitado}
                      className={`aspect-square rounded py-2 text-sm transition-colors ${
                        diaDesabilitado
                          ? 'cursor-not-allowed text-gray-300'
                          : diaSelecionado
                          ? 'bg-blue-600 font-bold text-white'
                          : 'font-semibold text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {dia?.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-md bg-yellow-50 p-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Atenção:</span> As datas exibidas são uma <strong>previsão de início</strong> das aulas. A autoescola confirmará a data exata após o contato. Datas disponíveis a partir de <strong>{new Intl.DateTimeFormat('pt-BR').format(dataMinima)}</strong> (mínimo 7 dias).
                </p>
              </div>
            </div>

            {/* Resumo do Agendamento */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Resumo do Agendamento</h2>

              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-gray-700">
                  {autoescolaInfo.endereco}
                </p>

                <div className="flex items-start gap-2">
                  <Car className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{categoria}</p>
                    <p className="text-xs text-gray-600">Habilitação para conduzir veículos de passeio, utilitários e pequenos caminhões</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Previsão de Início Selecionada</p>
                    <p className="text-sm font-bold text-blue-600">{formatarData(dataSelecionada)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão Continuar */}
            {dataSelecionada && (
              <button
                onClick={handleContinuar}
                disabled={isLoadingPagamento}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isLoadingPagamento ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Processando...</span>
                  </>
                ) : (
                  'Informar telefone e continuar'
                )}
              </button>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Loading Overlay Pagamento */}
      {isLoadingPagamento && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">Carregando dados do pagamento</h2>
          <p className="text-sm text-gray-600">Aguarde enquanto preparamos sua página de pagamento...</p>
        </div>
      )}
    </div>
  );
}

export default function AgendamentoPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    }>
      <AgendamentoContent />
    </Suspense>
  );
}
