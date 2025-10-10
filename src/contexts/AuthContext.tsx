'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
}

interface UserProgress {
  hasCompletedQuestionnaire: boolean;
  hasAcceptedTerms: boolean;
}

interface AuthContextType {
  user: User | null;
  userProgress: UserProgress;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  completeQuestionnaire: () => void;
  acceptTerms: () => void;
  updateUserPhone: (phone: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    hasCompletedQuestionnaire: false,
    hasAcceptedTerms: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tentar carregar de 'user' primeiro, depois 'usuarioLogado' e 'userBasicData'
    const storedUser = localStorage.getItem('user') || 
                       localStorage.getItem('usuarioLogado') || 
                       localStorage.getItem('userBasicData');
    const storedProgress = localStorage.getItem('userProgress');

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Garantir que temos o nome completo
        setUser({
          nome: userData.nome || userData.nomeCompleto || '',
          cpf: userData.cpf || '',
          email: userData.email || '',
          telefone: userData.telefone || '',
        });
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('userBasicData');
      }
    }

    if (storedProgress) {
      try {
        setUserProgress(JSON.parse(storedProgress));
      } catch (error) {
        console.error('Erro ao carregar progresso do usuário:', error);
        localStorage.removeItem('userProgress');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    const userWithEmail = {
      ...userData,
      email: userData.email || 'usuario@email.com',
    };
    setUser(userWithEmail);
    
    const progress = {
      hasCompletedQuestionnaire: false,
      hasAcceptedTerms: false,
    };
    setUserProgress(progress);
    
    localStorage.setItem('user', JSON.stringify(userWithEmail));
    localStorage.setItem('userProgress', JSON.stringify(progress));
  };

  const logout = () => {
    setUser(null);
    setUserProgress({
      hasCompletedQuestionnaire: false,
      hasAcceptedTerms: false,
    });
    localStorage.removeItem('user');
    localStorage.removeItem('userProgress');
  };

  const completeQuestionnaire = () => {
    const newProgress = { ...userProgress, hasCompletedQuestionnaire: true };
    setUserProgress(newProgress);
    localStorage.setItem('userProgress', JSON.stringify(newProgress));
  };

  const acceptTerms = () => {
    const newProgress = { ...userProgress, hasAcceptedTerms: true };
    setUserProgress(newProgress);
    localStorage.setItem('userProgress', JSON.stringify(newProgress));
  };

  const updateUserPhone = (phone: string) => {
    if (user) {
      const updatedUser = { ...user, telefone: phone };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProgress,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        completeQuestionnaire,
        acceptTerms,
        updateUserPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
