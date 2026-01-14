'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UtmCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Verificar se já tem UTMs salvos
    const savedUtm = localStorage.getItem('utmParams');
    if (savedUtm) return; // Já tem UTMs, não sobrescrever

    // Capturar UTMs da URL
    const utmParams: Record<string, string | null> = {
      utm_source: searchParams.get('utm_source'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_medium: searchParams.get('utm_medium'),
      utm_content: searchParams.get('utm_content'),
      utm_term: searchParams.get('utm_term'),
      keyword: searchParams.get('keyword'),
      device: searchParams.get('device'),
      network: searchParams.get('network'),
      src: searchParams.get('src'),
      sck: searchParams.get('sck')
    };

    // Verificar se tem algum parâmetro preenchido
    const hasUtm = Object.values(utmParams).some(v => v !== null);
    
    if (hasUtm) {
      localStorage.setItem('utmParams', JSON.stringify(utmParams));
      console.log('📊 UTMs capturados:', utmParams);
    }
  }, [searchParams]);

  return null; // Componente invisível
}
