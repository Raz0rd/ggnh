'use client';

import { useState, useEffect, ReactNode } from 'react';

interface CloakerGateProps {
  children: ReactNode;
}

export default function CloakerGate({ children }: CloakerGateProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [isBot, setIsBot] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Verificações anti-bot
    const detectBot = (): boolean => {
      // 1. Detectar webdriver (headless browsers)
      if (navigator.webdriver) return true;
      
      // 2. Detectar automação
      const dominated = (window as any).domAutomation || (window as any).domAutomationController;
      if (dominated) return true;
      
      // 3. Verificar plugins (bots geralmente não têm)
      if (navigator.plugins.length === 0) return true;
      
      // 4. Verificar linguagens
      if (!navigator.languages || navigator.languages.length === 0) return true;
      
      // 5. Detectar PhantomJS
      if ((window as any).callPhantom || (window as any)._phantom) return true;
      
      // 6. Detectar Selenium
      if ((window as any).__selenium_unwrapped || (window as any).__webdriver_evaluate) return true;
      
      // 7. Verificar dimensões da tela (bots podem ter 0)
      if (window.outerWidth === 0 || window.outerHeight === 0) return true;
      
      // 8. Canvas fingerprint test
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return true;
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('test', 2, 2);
        const dataURL = canvas.toDataURL();
        if (dataURL === 'data:,') return true;
      } catch {
        return true;
      }
      
      return false;
    };

    // Simular progresso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Verificar após um pequeno delay (simula processamento)
    const timer = setTimeout(() => {
      const botDetected = detectBot();
      setIsBot(botDetected);
      setIsVerified(true);
      clearInterval(progressInterval);
      setProgress(100);
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  // Ainda verificando - mostra loading
  if (!isVerified) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#0d1b2a]">
        <div className="text-center text-white px-6">
          {/* Shield icon */}
          <svg 
            className="w-20 h-20 mx-auto mb-6 opacity-90" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          {/* Loader */}
          <div className="w-16 h-16 border-4 border-white/10 border-l-blue-500 rounded-full animate-spin mx-auto mb-8"></div>
          
          <h1 className="text-xl font-medium mb-3">Verificando conexão segura</h1>
          <p className="text-white/60 text-sm mb-6">Por favor, aguarde enquanto verificamos sua conexão...</p>
          
          {/* Progress bar */}
          <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Se for bot, mostra loading infinito
  if (isBot) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#0d1b2a]">
        <div className="text-center text-white px-6">
          <svg 
            className="w-20 h-20 mx-auto mb-6 opacity-90" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="w-16 h-16 border-4 border-white/10 border-l-blue-500 rounded-full animate-spin mx-auto mb-8"></div>
          <h1 className="text-xl font-medium mb-3">Carregando...</h1>
          <p className="text-white/60 text-sm">Por favor, aguarde...</p>
        </div>
      </div>
    );
  }

  // Usuário verificado - mostra conteúdo real
  return <>{children}</>;
}
