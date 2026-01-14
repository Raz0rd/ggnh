# ✅ Checklist Pré-Deploy - CNH Social 2026

## 🔍 Verificações Obrigatórias

### 1. Código e Build
- [ ] `npm install` executa sem erros
- [ ] `npm run build` completa com sucesso
- [ ] Nenhum erro de TypeScript no console
- [ ] Nenhum warning crítico no build
- [ ] Teste local funciona: `npm start`

### 2. Git e Repositório
- [ ] Repositório Git inicializado
- [ ] `.gitignore` está correto (não commita .env.local)
- [ ] Todos os arquivos importantes commitados
- [ ] Repositório remoto configurado (GitHub/GitLab)
- [ ] Branch principal está atualizada

### 3. Variáveis de Ambiente
- [ ] `.env.local.example` existe e está atualizado
- [ ] `.env.local` NÃO está commitado
- [ ] Variáveis de ambiente documentadas
- [ ] API keys estão corretas

### 4. Configurações Netlify
- [ ] `netlify.toml` existe
- [ ] `next.config.mjs` otimizado
- [ ] `.npmrc` configurado
- [ ] Build command correto: `npm run build`
- [ ] Publish directory: `.next`

### 5. Funcionalidades
- [ ] Login funciona (teste com CPF real)
- [ ] Questionário salva respostas
- [ ] Seleção de autoescola funciona
- [ ] Agendamento de data funciona
- [ ] Geração de PIX funciona (teste local)
- [ ] Validação biométrica carrega
- [ ] Todas as páginas renderizam sem erro

### 6. Assets e Imagens
- [ ] Todas as imagens estão em `/public`
- [ ] Logo Gov.br carrega
- [ ] Banners carregam
- [ ] Ícones SVG funcionam
- [ ] Favicon configurado

### 7. Performance
- [ ] Imagens otimizadas
- [ ] Código minificado no build
- [ ] Sem console.logs desnecessários em produção
- [ ] Lazy loading implementado onde necessário

### 8. SEO e Meta Tags
- [ ] Título das páginas configurado
- [ ] Meta descriptions adicionadas
- [ ] Open Graph tags (opcional)

### 9. Segurança
- [ ] Headers de segurança configurados
- [ ] CORS configurado corretamente
- [ ] Validação de inputs implementada
- [ ] Sanitização de dados
- [ ] Rate limiting considerado

### 10. Integração Umbrela
- [ ] API Key Umbrela válida
- [ ] URL base correta: `https://api-gateway.umbrellapag.com/api`
- [ ] Endpoints testados
- [ ] Tratamento de erros implementado

---

## 🚀 Passo a Passo para Deploy

### 1. Preparar Código
```bash
# Instalar dependências
npm install

# Rodar build local
npm run build

# Testar build
npm start
```

### 2. Commitar Mudanças
```bash
git add .
git commit -m "Preparar para deploy no Netlify"
git push origin main
```

### 3. Configurar Netlify
1. Criar conta no Netlify
2. Conectar repositório
3. Configurar variáveis de ambiente
4. Iniciar deploy

### 4. Após Deploy
- [ ] Site acessível via URL Netlify
- [ ] Testar todas as funcionalidades em produção
- [ ] Verificar logs de erro
- [ ] Configurar domínio personalizado (opcional)
- [ ] Habilitar HTTPS (automático)

---

## 🐛 Troubleshooting Comum

### Build falha
- Verificar erros no log do Netlify
- Rodar `npm run build` localmente
- Limpar cache: `rm -rf .next node_modules`
- Reinstalar: `npm install`

### Páginas retornam 404
- Verificar rotas no `src/app`
- Verificar `output: 'standalone'` no `next.config.mjs`

### API Routes não funcionam
- Verificar variáveis de ambiente no Netlify
- Verificar headers CORS
- Verificar logs de função serverless

### Variáveis de ambiente não carregam
- Verificar nome exato das variáveis
- Fazer redeploy após adicionar variáveis
- Clear cache and redeploy

---

## 📞 Suporte

- **Documentação Netlify:** https://docs.netlify.com
- **Next.js Docs:** https://nextjs.org/docs
- **Umbrela API:** Ver `umbrela.md`

---

## ✨ Pronto para Deploy?

Se todas as caixas estão marcadas, execute:

```bash
deploy.bat
```

Ou siga o guia completo em: [DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md)
