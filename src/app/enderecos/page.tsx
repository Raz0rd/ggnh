'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Bike, Car, Star, MapPin } from 'lucide-react';

interface CepData {
  localidade: string;
  uf: string;
  bairro?: string;
  logradouro?: string;
}

interface Autoescola {
  id: number;
  nome: string;
  rating: number;
  distancia: string;
  imagem: string;
  categorias: Array<'A' | 'B' | 'AB'>;
}

const autoescolasMock: Autoescola[] = [
  {
    id: 1,
    nome: 'Escola de Condutores Moto São José',
    rating: 4.0,
    distancia: '4.5 km',
    imagem: '/banner-promocional-1.png',
    categorias: ['A', 'B', 'AB']
  },
  {
    id: 2,
    nome: 'Academia de Condutores Especializada',
    rating: 4.0,
    distancia: '5.3 km',
    imagem: '/banner-promocional-1.png',
    categorias: ['A', 'B', 'AB']
  }
];

function EnderecosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [cidade, setCidade] = useState<string>('');
  const [uf, setUf] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Record<number, string>>({});
  const [autoescolaSelecionando, setAutoescolaSelecionando] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const cep = searchParams.get('cep');
    if (!cep) {
      router.push('/cnh-social-termos');
      return;
    }

    buscarCep(cep);
  }, [user, searchParams, router]);

  const buscarCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: CepData = await response.json();
      
      if (data.localidade && data.uf) {
        setCidade(data.localidade);
        setUf(data.uf);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setCidade('sua região');
      setUf('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoriaClick = (autoescolaId: number, categoria: string) => {
    setCategoriaSelecionada(prev => ({
      ...prev,
      [autoescolaId]: prev[autoescolaId] === categoria ? '' : categoria
    }));
  };

  const handleSelecionarAutoescola = async (autoescolaId: number) => {
    const categoria = categoriaSelecionada[autoescolaId];
    if (!categoria) return;

    setAutoescolaSelecionando(autoescolaId);
    
    // Buscar nome da autoescola
    const autoescola = autoescolasMock.find(a => a.id === autoescolaId);
    
    // Salvar dados no localStorage
    const userBasicData = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('userBasicData') || '{}')
      : {};
    
    localStorage.setItem('userBasicData', JSON.stringify({
      ...userBasicData,
      autoescola: autoescola?.nome || 'Autoescola Selecionada',
      categoria: categoria,
      categoriaFormatada: categoria === 'A' ? 'Motocicleta' : categoria === 'B' ? 'Automóvel' : 'Automóvel e Motocicleta'
    }));
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirecionar para agendamento com dados
    const cep = searchParams.get('cep');
    router.push(`/agendamento?autoescola=${autoescolaId}&categoria=${categoria}&cep=${cep}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Selecione uma Autoescola</h1>
            <p className="text-lg text-gray-600">
              Encontramos estas opções perto de{' '}
              <span className="font-semibold">
                {cidade || 'Fortaleza'}, {uf || 'CE'}
              </span>
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-base text-gray-700">Buscando autoescolas próximas...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Selecione uma Autoescola</h1>
          <p className="text-lg text-gray-600">
            Encontramos estas opções perto de{' '}
            <span className="font-semibold">
              {cidade}{uf ? `, ${uf}` : ''}
            </span>
          </p>
        </div>

        <div className="space-y-6">
          {/* Aviso de não encontrado */}
          <div className="rounded-md bg-yellow-100 p-4 text-sm text-yellow-800">
            <p>
              <strong>Atenção:</strong> Não encontramos autoescolas do DETRAN na sua região. 
              Exibindo as parceiras mais próximas.
            </p>
          </div>

          {/* Lista de autoescolas */}
          {autoescolasMock.map((autoescola) => (
            <div key={autoescola.id} className="overflow-hidden rounded-lg border bg-white shadow-sm">
              <div className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  {/* Imagem */}
                  <div className="w-full flex-shrink-0 md:w-48">
                    <Image
                      src={autoescola.imagem}
                      alt="Foto da Autoescola"
                      width={192}
                      height={108}
                      className="h-28 w-full rounded-md object-cover"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex-grow">
                    <h3 className="mb-1 text-lg font-bold text-gray-800">{autoescola.nome}</h3>
                    
                    <div className="mb-2 flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{autoescola.rating.toFixed(1)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{autoescola.distancia}</span>
                      </div>
                    </div>

                    <p className="mb-3 text-sm text-gray-500">
                      Localizada próximo a <span className="font-medium">{cidade}</span>, 
                      esta autoescola é credenciada pelo DETRAN e está pronta para te atender.
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-800">
                        Credenciada DETRAN
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800">
                        CNH Social
                      </span>
                    </div>
                  </div>

                  {/* Botões de categoria */}
                  <div className="w-full flex-shrink-0 space-y-2 md:w-48">
                    <button
                      onClick={() => handleCategoriaClick(autoescola.id, 'A')}
                      className={`flex w-full items-center justify-between rounded-md border p-2 text-left transition-colors ${
                        categoriaSelecionada[autoescola.id] === 'A'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Bike className="mr-2 h-5 w-5 text-blue-600" />
                        <span className="font-semibold">Moto (A)</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleCategoriaClick(autoescola.id, 'B')}
                      className={`flex w-full items-center justify-between rounded-md border p-2 text-left transition-colors ${
                        categoriaSelecionada[autoescola.id] === 'B'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Car className="mr-2 h-5 w-5 text-blue-600" />
                        <span className="font-semibold">Carro (B)</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleCategoriaClick(autoescola.id, 'AB')}
                      className={`flex w-full items-center justify-between rounded-md border p-2 text-left transition-colors ${
                        categoriaSelecionada[autoescola.id] === 'AB'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Bike className="mr-1 h-5 w-5 text-blue-600" />
                        <Car className="mr-2 h-5 w-5 text-blue-600" />
                        <span className="font-semibold">Carro+Moto</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão de seleção */}
              <div className="bg-gray-50 px-4 py-3">
                <button
                  onClick={() => handleSelecionarAutoescola(autoescola.id)}
                  disabled={!categoriaSelecionada[autoescola.id] || autoescolaSelecionando !== null}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {autoescolaSelecionando === autoescola.id ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Carregando...</span>
                    </>
                  ) : (
                    'Selecionar Autoescola'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function EnderecosPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    }>
      <EnderecosContent />
    </Suspense>
  );
}
