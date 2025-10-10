import Image from 'next/image';

const footerSections = [
  {
    title: 'ESTRATÉGIAS E GOVERNANÇA DIGITAL',
    items: ['Transformação Digital', 'Governo Digital', 'Dados Abertos'],
  },
  {
    title: 'PLATAFORMAS E SERVIÇOS DIGITAIS',
    items: ['Portal de Serviços', 'Aplicativos Móveis', 'Canais Digitais'],
  },
  {
    title: 'IDENTIDADE',
    items: ['Login Único', 'Conta gov.br', 'Certificação Digital'],
  },
  {
    title: 'ACESSIBILIDADE E USUÁRIO',
    items: ['Padrões de Acessibilidade', 'Experiência do Usuário', 'Inclusão Digital'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-blue-800 py-6 text-white md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-bold md:mb-4 md:text-lg">{section.title}</h3>
              <ul className="space-y-1 text-xs opacity-90 md:space-y-2 md:text-sm">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-6 border-t border-white/20 pt-6 text-center md:mt-8 md:pt-8">
          <div className="mb-3 flex justify-center md:mb-4">
            <Image src="/govbr-branco.png" alt="gov.br" width={120} height={40} className="h-6 w-auto md:h-8" />
          </div>
          <p className="text-xs opacity-90 md:text-sm">© 2025 Governo Federal. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
