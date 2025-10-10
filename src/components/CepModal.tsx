'use client';

import { useState } from 'react';

interface CepModalProps {
  isOpen: boolean;
  onConfirm: (cep: string) => void;
}

export default function CepModal({ isOpen, onConfirm }: CepModalProps) {
  const [cep, setCep] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    // Limpar erro quando usuário digitar
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleContinue = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      setErrorMessage('CEP inválido. Digite um CEP válido.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Etapa 1: Buscando autoescolas
      setLoadingMessage('Buscando autoescolas mais próximas...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Etapa 2: Cidade encontrada
      setLoadingMessage('Cidade encontrada...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Etapa 3: Finalizando
      setLoadingMessage('Finalizando busca...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onConfirm(cepLimpo);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Erro ao buscar CEP. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="rounded-lg border-2 border-blue-400 bg-blue-50 p-6">
          <h3 className="mb-4 text-lg font-bold text-blue-900">Confirme sua Localização</h3>
          <p className="mb-4 text-sm text-gray-700">
            Informe seu CEP para localizar autoescolas credenciadas próximas a você
          </p>
          
          <div className="mb-1">
            <label htmlFor="cep" className="mb-2 block text-sm font-medium text-gray-700">
              CEP da sua região
            </label>
            <input
              id="cep"
              type="text"
              value={cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              maxLength={9}
              className={`w-full rounded-md border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errorMessage 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">
                {errorMessage}
              </p>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={isLoading || cep.replace(/\D/g, '').length !== 8}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>{loadingMessage}</span>
              </>
            ) : (
              'Continuar para Próxima Etapa'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
