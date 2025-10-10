# 🔧 Guia de Correção de Erros de Build

## ❌ Erro Resolvido: TypeScript Spread Operator

### Problema
```
Type error: A spread argument must either have a tuple type or be passed to a rest parameter.
```

### Solução
**Antes:**
```typescript
const azulGov = [19, 81, 180];
doc.setFillColor(...azulGov); // ❌ Erro
```

**Depois:**
```typescript
const azulGov: [number, number, number] = [19, 81, 180];
doc.setFillColor(...azulGov); // ✅ Correto
```

**Motivo:** TypeScript precisa saber que o array tem exatamente 3 elementos (tupla) para permitir o spread operator.

---

## 🛠️ Comandos Úteis

### Verificar Erros de Tipo Antes do Build
```bash
npm run type-check
```

### Verificar Tipos + Build (Pré-Deploy)
```bash
npm run pre-deploy
```

### Build Local
```bash
npm run build
```

### Limpar Cache e Rebuildar
```bash
# Windows
rmdir /s /q .next node_modules
npm install
npm run build

# Linux/Mac
rm -rf .next node_modules
npm install
npm run build
```

---

## 🚨 Erros Comuns

### 1. Module not found
**Erro:**
```
Module not found: Can't resolve 'componente'
```

**Solução:**
- Verificar import paths (case-sensitive)
- Verificar se o arquivo existe
- Verificar tsconfig.json paths

### 2. Type errors
**Erro:**
```
Type 'X' is not assignable to type 'Y'
```

**Solução:**
- Adicionar tipos corretos
- Usar `as` para type assertion (cuidado!)
- Verificar interfaces/types

### 3. Build timeout
**Erro:**
```
Build exceeded maximum time
```

**Solução:**
- Otimizar imports (usar dynamic imports)
- Remover código não utilizado
- Verificar loops infinitos

### 4. Out of memory
**Erro:**
```
JavaScript heap out of memory
```

**Solução:**
```bash
# Aumentar memória do Node
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

---

## 📋 Checklist Antes de Fazer Deploy

```bash
# 1. Verificar tipos
npm run type-check

# 2. Build local
npm run build

# 3. Testar localmente
npm start

# 4. Verificar no navegador
# Abrir: http://localhost:3000

# 5. Se tudo OK, fazer deploy
git add .
git commit -m "Fix: TypeScript errors"
git push
```

---

## 🔍 Debug no Netlify

### Ver Logs Completos
1. Acesse: https://app.netlify.com
2. Clique no seu site
3. Vá em "Deploys"
4. Clique no deploy com erro
5. Veja "Deploy log"

### Fazer Redeploy
1. "Trigger deploy"
2. "Clear cache and deploy"

### Variáveis de Ambiente
1. Site settings
2. Environment variables
3. Verificar se estão corretas

---

## 💡 Dicas

### Sempre Teste Localmente Primeiro
```bash
npm run pre-deploy
```

### Use o Script de Deploy
```bash
deploy.bat
```

### Mantenha Dependências Atualizadas
```bash
npm outdated
npm update
```

---

## 🆘 Se Nada Funcionar

1. **Limpar tudo:**
```bash
rmdir /s /q .next node_modules
npm cache clean --force
npm install
npm run build
```

2. **Verificar versões:**
```bash
node --version  # Deve ser 18+
npm --version   # Deve ser 9+
```

3. **Criar issue** no repositório com:
   - Logs completos do erro
   - Comando executado
   - Sistema operacional
   - Versões (node, npm)

---

## ✅ Status Atual

- [x] ~~Erro de spread operator~~ ✅ **CORRIGIDO**
- [x] Build local funcionando
- [x] Deploy configurado para Netlify
- [x] Scripts de verificação criados

---

**Próximo Deploy:** Deve funcionar perfeitamente! 🚀
