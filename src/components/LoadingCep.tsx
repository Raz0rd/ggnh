'use client';

import { useEffect, useState } from 'react';

interface LoadingCepProps {
  onComplete?: () => void;
}

export default function LoadingCep({ onComplete }: LoadingCepProps) {
  const [progress, setProgress] = useState(0);
  const [currentDot, setCurrentDot] = useState(0);

  useEffect(() => {
    // Animação da barra de progresso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // Animação dos pontos
    const dotInterval = setInterval(() => {
      setCurrentDot((prev) => (prev + 1) % 5);
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0d3a7a] via-[#1351B4] to-[#1a5cc4]">
      <div className="w-full max-w-md px-8">
        {/* Barra das Cores do Brasil (Fixa) */}
        <div className="mb-16">
          <div className="h-1 w-full overflow-hidden rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-blue-600" />
        </div>

        {/* Conteúdo Central */}
        <div className="text-center">
          {/* Título */}
          <h1 className="mb-3 text-4xl font-bold text-white">CNH Social 2026</h1>
          <p className="mb-12 text-lg text-blue-200">
            Conectando brasileiros à mobilidade e autonomia
          </p>

          {/* Círculo de Loading (Radar/Sonar) */}
          <div className="relative mx-auto mb-12 h-48 w-48">
            {/* Círculo externo mais grosso */}
            <div className="absolute inset-0 rounded-full border-[6px] border-blue-300/30" />
            
            {/* Parte branca giratória no círculo maior (loading circular) */}
            <div className="absolute inset-0">
              <svg className="h-full w-full animate-spin-slow" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  stroke="white"
                  strokeWidth="6"
                  strokeDasharray="30 250"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </svg>
            </div>
            
            {/* Círculo médio */}
            <div className="absolute inset-6 rounded-full border-[5px] border-blue-400/40" />
            
            {/* Círculo interno menor */}
            <div className="absolute inset-14 rounded-full border-[4px] border-blue-300/50" />
            
            {/* Centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-white shadow-lg shadow-white/50" />
            </div>

            {/* Pontos decorativos animados com movimento */}
            <div className="absolute -left-3 top-16 h-3 w-3 animate-float rounded-full bg-red-400/50 shadow-lg shadow-red-400/30" />
            <div className="absolute -right-3 top-24 h-2.5 w-2.5 animate-float rounded-full bg-green-400/50 shadow-lg shadow-green-400/30" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
            <div className="absolute right-2 bottom-12 h-2.5 w-2.5 animate-float rounded-full bg-yellow-300/50 shadow-lg shadow-yellow-300/30" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
          </div>

          {/* Texto de Status */}
          <p className="mb-8 text-base text-white">
            Analisando sua localização e perfil socioeconômico...
          </p>

          {/* Indicadores de Progresso (Bolinhas) */}
          <div className="mb-12 flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentDot
                    ? 'bg-white scale-125'
                    : index < currentDot
                    ? 'bg-green-400'
                    : 'bg-blue-700'
                }`}
              />
            ))}
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-blue-700/50 p-4 backdrop-blur-sm">
              <div className="mb-1 text-2xl font-bold text-white">150</div>
              <div className="text-xs text-blue-200">mil+</div>
              <div className="mt-1 text-xs text-blue-100">CNH</div>
              <div className="text-xs text-blue-200">Disponíveis</div>
            </div>

            <div className="rounded-lg bg-blue-700/50 p-4 backdrop-blur-sm">
              <div className="mb-1 text-2xl font-bold text-white">5.570</div>
              <div className="mt-2 text-xs text-blue-100">Municípios</div>
            </div>

            <div className="rounded-lg bg-blue-700/50 p-4 backdrop-blur-sm">
              <div className="mb-1 text-2xl font-bold text-white">27</div>
              <div className="mt-2 text-xs text-blue-100">Estados</div>
            </div>
          </div>

          {/* Barra de Progresso Inferior */}
          <div className="mt-12">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-800">
              <div
                className="h-full bg-green-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
