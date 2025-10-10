'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { label: 'Dados Pessoais', href: 'https://contas.acesso.gov.br/alteracao_cadastro', icon: 'person' },
  { label: 'Segurança da Conta', href: 'https://contas.acesso.gov.br/seguranca', icon: 'password' },
  { label: 'Privacidade', href: 'https://contas.acesso.gov.br/privacidade', icon: 'privado' },
  { label: 'Ajuda da conta gov.br', href: 'https://www.gov.br/governodigital/pt-br/conta-gov-br/ajuda-da-conta-gov.br', icon: 'duvida' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMenuOpen) {
      setOpacity(1);
    } else {
      const timer = setTimeout(() => setOpacity(0), 240);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="border-white-gray flex h-[60px] items-center border-b bg-white px-4 shadow-md">
      <div className="flex items-center">
        <Link href="/">
          <Image src="/govbr.svg" alt="gov.br" width={120} height={40} className="h-8 w-auto" />
        </Link>
      </div>
      
      <div className="ml-auto flex items-center space-x-4">
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full px-1 py-1 transition-colors hover:bg-[#D9E3F2]"
              style={{ outline: 'none', border: 'none', background: isMenuOpen ? '#D9E3F2' : undefined }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu do usuário"
            >
              <Image src="/avatar.svg" alt="Avatar" width={32} height={32} className="h-[29px] w-[29px] rounded-full border border-gray-300 bg-white" />
              <svg
                className={`h-[12px] w-[12px] text-[#333333] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 32 32"
                fill="currentColor"
              >
                <path d="M29.604 10.528 17.531 23.356a2.102 2.102 0 0 1-3.062 0L2.396 10.528c-.907-.964-.224-2.546 1.1-2.546h25.008c1.324 0 2.007 1.582 1.1 2.546z" />
              </svg>
            </button>

            <div
              className={`absolute right-0 z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10 transition-all duration-300 ${!isMenuOpen && 'pointer-events-none'}`}
              style={{ minWidth: 300, maxHeight: isMenuOpen ? '600px' : '0px', opacity }}
            >
              <div className="flex flex-col items-center px-0 pb-4 pt-6">
                <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                  <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="mb-1 text-center">
                  <div className="text-base font-bold leading-tight text-gray-800" style={{ wordBreak: 'break-word' }}>
                    Olá, <span className="font-bold">{user.nome?.toUpperCase() || 'USUÁRIO'}</span>
                  </div>
                </div>
                <a href="https://contas.acesso.gov.br/alteracao_cadastro" target="_blank" rel="noopener noreferrer" className="text-blue mb-2 text-sm font-medium hover:underline">
                  Minha área gov.br
                </a>
              </div>

              <div className="w-full border-gray-200 px-0 pb-2 pt-2">
                <div className="px-3 pb-1 pt-2 text-xs font-semibold text-gray-700">Minha conta</div>
                <div className="px-3">
                  <div className="h-px w-full bg-gray-200" />
                </div>
                <nav className="flex flex-col gap-1">
                  {menuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue flex h-[44px] items-center gap-3 rounded px-3 py-2 text-sm font-medium text-gray-800 hover:bg-[#CBD5E5]"
                    >
                      <span className="h-5 w-5 text-blue-700" style={{ display: 'inline-flex' }}>
                        <Image src={`/popover-icons/${item.icon}.svg`} alt={item.icon} width={20} height={20} className="h-5 w-5" />
                      </span>
                      {item.label}
                    </a>
                  ))}
                  <button
                    onClick={logout}
                    className="text-blue flex h-[44px] items-center gap-3 rounded px-3 py-2 text-sm font-medium text-gray-800 hover:bg-[#CBD5E5]"
                  >
                    <span className="h-5 w-5 text-blue-700" style={{ display: 'inline-flex' }}>
                      <Image src="/popover-icons/logout.svg" alt="logout" width={20} height={20} className="h-5 w-5" />
                    </span>
                    Sair
                  </button>
                </nav>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-blue flex items-center rounded-full px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600"
            style={{ outline: 'none', border: 'none' }}
          >
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
