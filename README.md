# CNH Social 2025 - Next.js

Aplicação web para o programa CNH Social 2025, desenvolvida com Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **React Context API** - Gerenciamento de estado

## 📁 Estrutura do Projeto

```
cnh-nextjs/
├── src/
│   ├── app/                           # Páginas e rotas (App Router)
│   │   ├── api/                       # API Routes (Proxy)
│   │   │   └── cpf/[cpf]/route.ts     # Proxy para API de CPF
│   │   ├── login/page.tsx             # Página de login (2 etapas)
│   │   ├── questionario/page.tsx      # Questionário 6 perguntas
│   │   ├── cnh-social-termos/page.tsx # Termos de uso
│   │   ├── enderecos/page.tsx         # Seleção de autoescolas
│   │   ├── agendamento/page.tsx       # Agendamento de avaliação
│   │   ├── pagamento/page.tsx         # Pagamento via PIX
│   │   ├── sucesso/page.tsx           # Confirmação + Comprovante + Biometria
│   │   ├── validacao-biometrica/page.tsx  # Validação Face ID + Animação
│   │   ├── atualizar-biometria/page.tsx   # Chatbot Typebot (Atualização)
│   │   ├── biometria/page.tsx         # Aviso biometria desatualizada (fallback)
│   │   ├── layout.tsx                 # Layout principal
│   │   ├── page.tsx                   # Página inicial
│   │   └── globals.css                # Estilos globais
│   ├── components/                    # Componentes reutilizáveis
│   │   ├── Header.tsx                 # Cabeçalho com menu
│   │   ├── Footer.tsx                 # Rodapé
│   │   ├── LoadingOverlay.tsx         # Overlay de loading
│   │   ├── ProcessingOverlay.tsx      # Overlay de processamento
│   │   ├── AnalyzingOverlay.tsx       # Overlay de análise
│   │   └── CepModal.tsx               # Modal de CEP
│   └── contexts/                      # Contextos React
│       └── AuthContext.tsx            # Auth e estado global
├── public/                            # Arquivos estáticos
│   ├── govbr.svg
│   ├── avatar.svg
│   └── banner-*.png
└── package.json
```

## 🛠️ Instalação e Execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 3. Build para produção

```bash
npm run build
npm start
```

### 4. Deploy no Netlify

```bash
# Deploy automático (Windows)
deploy.bat

# Ou manualmente:
npm run build
git add .
git commit -m "Deploy para Netlify"
git push
```

📖 **Guia completo:** [DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md)

## 📦 Recursos Implementados

### ✅ Página Inicial (Home)
- Hero section com call-to-action
- Informações sobre o programa CNH Social
- Estatísticas (150.000 vagas, 27 estados, 5M beneficiados)
- Banners promocionais
- Design responsivo

### ✅ Sistema de Autenticação
- Login em 2 etapas (CPF → Senha)
- Integração com API via proxy Next.js (proteção do endpoint)
- Context API para gerenciamento de estado
- Persistência no localStorage
- Controle de progresso do usuário
- Loading states com spinners inline

### ✅ Questionário
- 6 perguntas com navegação entre etapas
- Barra de progresso visual
- Validação de respostas obrigatórias
- Overlay de processamento após conclusão
- Redirecionamento automático para termos

### ✅ Termos de Uso
- Exibição completa dos termos CNH Social
- Toggle de aceitação dos termos
- Modal de confirmação de CEP
- Validação e formatação de CEP
- Overlay "Analisando suas informações"
- Redirecionamento com parâmetro de CEP

### ✅ Seleção de Autoescolas (/enderecos)
- Busca de localização via CEP (integração ViaCEP)
- Exibição de cidade/UF baseado no CEP
- Lista de autoescolas parceiras
- Sistema de seleção de categoria (A, B, AB)
- Aviso de autoescolas não encontradas na região
- Cards informativos com rating e distância
- Loading no botão ao selecionar autoescola

### ✅ Agendamento (/agendamento)
- Campo de telefone com máscara (XX) XXXXX-XXXX
- Botão "Editar" após confirmar telefone
- Telefone permanece visível (desabilitado quando confirmado)
- Calendário completo com navegação de mês
- **Data mínima: hoje + 7 dias** (datas anteriores desabilitadas)
- Calendário inicia automaticamente no mês da data mínima
- Seleção de data com dia destacado em azul
- Aviso: "As datas são uma previsão de início" + data mínima
- Resumo com endereço completo da autoescola
- Categoria e descrição da habilitação
- Data selecionada em azul negrito
- Loading overlay "Carregando dados do pagamento"
- Redireciona para /pagamento
- Footer incluído

### ✅ Pagamento (/pagamento)
- Parâmetros URL: cep, schoolId, category, date
- Título: "Quase lá! Finalize sua inscrição"
- Taxa: R$ 22,74 (grande e em azul)
- Lista de benefícios (check verde):
  - Emissão da CNH Digital
  - Acesso à plataforma nacional
  - Custos de integração
- Aviso amarelo: "Sua vaga está reservada!" (60 minutos)
- QR Code PIX (placeholder)
- Código PIX Copia e Cola
- Botão "Copiar" com feedback visual
- Selo: "Pagamento 100% seguro via IUGU"
- Timer countdown: "Tempo restante: XX:XX"
- "O que acontece após o pagamento?" (3 cards)
- Resumo da inscrição
- Botão de simulação (apenas em desenvolvimento)
- Footer incluído

### ✅ Sucesso (/sucesso)
- Banner azul com ícone de check grande
- Título: "Inscrição Realizada com Sucesso!"
- Card verde com emoji de festa: "Parabéns!"
- Loading "Finalizando inscrição..." (2 segundos)
- **Número de Protocolo** gerado automaticamente (CNH2025XXXXXX)
- Resumo do Agendamento:
  - Nome do candidato (em azul, maiúsculas)
  - Data prevista de início
  - Categoria selecionada
- **Botão Download Comprovante** (verde):
  - Gera HTML com dados da inscrição
  - Inclui protocolo, CPF, categoria, valor pago
  - Nome do arquivo: Comprovante_CNH_Social_{protocolo}.html
  - Loading "Gerando comprovante..."
- **Aviso de Validação Biométrica** (card azul):
  - Ícone de reconhecimento facial
  - Mensagem informativa simples
  - Botão "Validar Biometria Agora"
  - Redireciona para /validacao-biometrica
- Card azul com "Próximos Passos"
- Botão "Voltar para Início"
- Footer incluído

### ✅ Validação Biométrica (/validacao-biometrica)
- Layout centralizado simples
- Logo Gov.br no topo
- **3 Estados:**
  1. **Idle (Inicial)**: Instruções e botão "Iniciar Validação Facial"
  2. **Scanning**: Animação Face ID com barra de scan (8 segundos)
  3. **Error**: Ícone vermelho de erro + mensagem de biometria desatualizada
- **Animação Face ID:**
  - SVG com scan bar animado
  - Efeito de varredura vertical
  - Transição automática para estado de erro
- Botão vermelho "Atualizar Biometria Agora"
- Redireciona para `/atualizar-biometria`
- Sem Header/Footer (página independente)

### ✅ Atualizar Biometria (/atualizar-biometria)
- **Barra Gov.br** no topo (azul #1351B4)
  - Logo GovBR
  - Menu: Acesso à informação, Participe, Serviços, Legislação, Órgãos
- Logo Gov.br centralizada
- **Card Chatbot Typebot:**
  - Fundo branco
  - Bordas arredondadas
  - Sombra elevada
  - Widget Typebot integrado (validacnhs)
  - API Host: sendbot.chat
  - Altura: 600px
- **Footer:**
  - Ícones de dispositivo e servidor
  - Versões: 3.0.1213 / 3.0.4801
- Background: Padrão pontilhado cinza
- Sem Header/Footer do sistema

### ✅ Biometria (/biometria)
- Página de alerta urgente (fallback)
- Card vermelho de alerta
- Botão de redirecionamento externo
- Sem Header/Footer

### ✅ Componentes Reutilizáveis
- **Header**: Menu do usuário com dropdown animado
- **Footer**: Links institucionais gov.br (presente em todas as páginas)
- **LoadingOverlay**: Overlay de carregamento fullscreen
- **ProcessingOverlay**: Overlay de processamento de dados
- **AnalyzingOverlay**: Overlay de análise de informações
- **CepModal**: Modal para captura e validação de CEP com loading sequencial

## 🎨 Design System

### Cores Principais
- **Azul Gov.br**: `#1351B4`
- **Azul Hover**: `#0C3E8F`
- **Fundo Azul Claro**: `#EBF1FA`

### Tipografia
- Font System: System UI (padrão do sistema)
- Escalas responsivas com Tailwind

## 📄 Fluxo da Aplicação

1. **Home** → Apresentação do programa
2. **Login** → CPF + Senha (2 etapas)
3. **Questionário** → 6 perguntas obrigatórias
4. **Termos** → Aceite de termos + CEP
5. **Autoescolas** → Seleção de categoria e autoescola
6. **Agendamento** → Telefone + Data (mín. 7 dias) + Loading
7. **Pagamento** → Taxa R$ 22,74 via PIX + Timer 60min
8. **Sucesso** → Protocolo + Comprovante PDF + Aviso Biometria
9. **Validação Biométrica** → Face ID Scan Animation (8s) → Erro
10. **Atualizar Biometria** → Chatbot Typebot + Barra Gov.br

## 📄 Próximas Etapas

- [x] Página de Login
- [x] Página do Questionário (6 perguntas)
- [x] Página de Termos de Uso
- [x] Página de Endereços
- [x] Página de Agendamento
- [x] Página de Pagamento (PIX - R$ 22,74)
- [x] Página de Sucesso com Comprovante
- [x] Página de Validação Biométrica (Face ID)
- [x] Página Chatbot Typebot (Atualização Biometria)
- [x] Página de Aviso de Biometria (fallback)
- [x] Animação Face ID com 3 estados
- [x] Integração Typebot Widget
- [ ] Geração de PDF real (não HTML)
- [ ] Integração Gateway de Pagamento Real
- [ ] Integração com Backend Real
- [ ] Sistema de Notificações por E-mail
- [ ] Geração de QR Code Dinâmico PIX
- [ ] API de Verificação Biométrica Real

## 🔒 Segurança

- Validação de dados no frontend
- Proteção de rotas autenticadas
- Sanitização de inputs
- Conformidade com LGPD

## 📱 Responsividade

Totalmente responsivo com breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚀 Deploy

### Netlify (Recomendado)

O projeto está configurado para deploy automático no Netlify:

1. **Configuração automática** via `netlify.toml`
2. **Deploy contínuo** via Git push
3. **SSL/HTTPS gratuito**
4. **CDN global**
5. **Funções serverless** para API Routes

**Instruções completas:** [DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md)

### Variáveis de Ambiente (Produção)

Configure no Netlify:

```
UMBRELA_API_KEY=84f2022f-a84b-4d63-a727-1780e6261fe8
UMBRELA_BASE_URL=https://api-gateway.umbrellapag.com/api
```

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

© 2025 Governo Federal. Todos os direitos reservados.
