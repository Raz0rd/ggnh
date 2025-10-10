# 🚀 Deploy no Netlify - CNH Social 2025

## 📋 Pré-requisitos

1. Conta no [Netlify](https://app.netlify.com)
2. Repositório Git (GitHub, GitLab ou Bitbucket)
3. Código do projeto commitado

---

## 🔧 Passo a Passo

### 1️⃣ **Preparar o Repositório**

```bash
# Verificar se build está funcionando
npm run pre-deploy

# Inicializar repositório Git (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Preparar projeto para deploy no Netlify"

# Adicionar repositório remoto (GitHub exemplo)
git remote add origin https://github.com/SEU-USUARIO/cnh-nextjs.git

# Enviar para o GitHub
git push -u origin main
```

---

### 2️⃣ **Criar Site no Netlify**

1. Acesse: https://app.netlify.com
2. Clique em **"Add new site"**
3. Selecione **"Import an existing project"**
4. Escolha seu provedor Git (GitHub/GitLab/Bitbucket)
5. Autorize o Netlify a acessar seus repositórios
6. Selecione o repositório **cnh-nextjs**

---

### 3️⃣ **Configurar Build Settings**

O Netlify detectará automaticamente que é um projeto Next.js.

**Confirme as seguintes configurações:**

```
Build command:   npm run build
Publish directory: .next
```

---

### 4️⃣ **Adicionar Variáveis de Ambiente**

Antes de fazer o deploy, configure as variáveis de ambiente:

1. Na página do site, vá em **"Site settings"**
2. Clique em **"Environment variables"**
3. Clique em **"Add a variable"**
4. Adicione as seguintes variáveis:

| Key | Value |
|-----|-------|
| `UMBRELA_API_KEY` | `84f2022f-a84b-4d63-a727-1780e6261fe8` |
| `UMBRELA_BASE_URL` | `https://api-gateway.umbrellapag.com/api` |

---

### 5️⃣ **Deploy**

1. Clique em **"Deploy site"**
2. Aguarde o build ser concluído (2-5 minutos)
3. Seu site estará disponível em: `https://SEU-SITE.netlify.app`

---

## 🔄 Deploy Contínuo

Após a configuração inicial, todo `git push` para a branch principal disparará um novo deploy automaticamente!

```bash
# Fazer alterações
git add .
git commit -m "Atualizar funcionalidade X"
git push

# Deploy automático será iniciado!
```

---

## 🌐 Domínio Personalizado (Opcional)

### Usar Domínio Netlify Personalizado

1. Vá em **"Site settings" > "Domain management"**
2. Clique em **"Options" > "Edit site name"**
3. Digite o nome desejado: `cnh-social-2025.netlify.app`

### Usar Seu Próprio Domínio

1. Vá em **"Site settings" > "Domain management"**
2. Clique em **"Add custom domain"**
3. Digite seu domínio: `www.seudomain.com.br`
4. Siga as instruções para configurar DNS
5. Netlify fornecerá SSL (HTTPS) automaticamente!

---

## 🔍 Monitoramento e Logs

### Ver Logs de Deploy

1. Acesse **"Deploys"** no menu lateral
2. Clique em qualquer deploy para ver logs detalhados

### Ver Logs de Função (API Routes)

1. Acesse **"Functions"** no menu lateral
2. Clique em qualquer função para ver logs em tempo real

---

## 📊 Recursos do Netlify

✅ **Deploy automático** via Git push  
✅ **Preview deployments** para Pull Requests  
✅ **SSL/HTTPS** automático e gratuito  
✅ **CDN global** para performance otimizada  
✅ **Analytics** (opcional, plano pago)  
✅ **Formulários** integrados (opcional)  
✅ **Funções serverless** para API Routes do Next.js  

---

## ⚙️ Configuração Avançada

### Arquivo `netlify.toml`

O projeto já inclui um arquivo `netlify.toml` com configurações otimizadas:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 🐛 Troubleshooting

### Build falha com erro de módulo

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Atualizar dependências"
git push
```

### Variáveis de ambiente não funcionam

- Certifique-se de que as variáveis foram adicionadas em **Site settings > Environment variables**
- Após adicionar variáveis, faça um **novo deploy** (Trigger deploy > Clear cache and deploy)

### API Routes retornam 404

- Verifique se o plugin `@netlify/plugin-nextjs` está configurado
- Routes devem estar em `src/app/api/*/route.ts`

---

## 📞 Suporte

- [Documentação Netlify](https://docs.netlify.com)
- [Next.js no Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Fórum da Comunidade](https://answers.netlify.com)

---

## ✅ Checklist Final

Antes do deploy, verifique:

- [ ] Código commitado no Git
- [ ] Repositório no GitHub/GitLab/Bitbucket
- [ ] Variáveis de ambiente configuradas
- [ ] Build local funcionando (`npm run build`)
- [ ] Arquivo `netlify.toml` presente
- [ ] `.env.local` NÃO commitado (está no .gitignore)

---

**Seu projeto CNH Social 2025 estará no ar! 🎉**
