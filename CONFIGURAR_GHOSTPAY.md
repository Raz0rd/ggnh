# ⚡ Configuração Rápida - GhostPay

Guia rápido para configurar o gateway GhostPay no projeto CNH Social 2026.

---

## 🚀 Configuração em 3 Passos

### 1️⃣ Obter Credenciais

Acesse o painel do GhostPay e copie:
- **Secret Key**
- **Company ID**

### 2️⃣ Configurar Variáveis de Ambiente

Edite o arquivo `.env.local`:

```bash
nano .env.local
```

Adicione:

```env
# Gateway de Pagamento
PAYMENT_GATEWAY=ghostpay

# Credenciais GhostPay
GHOSTPAY_API_KEY=sua-secret-key-aqui
GHOSTPAY_COMPANY_ID=sua-company-id-aqui
```

### 3️⃣ Reiniciar Aplicação

```bash
# Se estiver usando PM2
pm2 restart cnh-social

# Se estiver usando systemd
sudo systemctl restart cnh-social

# Verificar logs
pm2 logs cnh-social
```

---

## ✅ Testar Integração

### Teste via cURL:

```bash
curl -X POST http://localhost:3000/api/generate-pix \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2274,
    "customer": {
      "name": "Teste GhostPay",
      "phone": "11999999999",
      "document": {
        "number": "12345678900",
        "type": "cpf"
      }
    },
    "itemType": "recharge"
  }'
```

### Resposta Esperada:

```json
{
  "success": true,
  "transactionId": "abc123xyz",
  "pixCode": "00020126580014br.gov.bcb.pix...",
  "qrCode": "data:image/png;base64,..."
}
```

---

## 🔄 Alternar entre Gateways

### Usar GhostPay:
```env
PAYMENT_GATEWAY=ghostpay
```

### Usar Umbrela:
```env
PAYMENT_GATEWAY=umbrela
```

Sempre reinicie a aplicação após alterar o gateway.

---

## 🐛 Problemas Comuns

### ❌ Erro: "Credenciais não configuradas"

**Solução:**
```bash
# Verificar se variáveis existem
cat .env.local | grep GHOSTPAY

# Se não existirem, adicionar
echo "GHOSTPAY_API_KEY=sua-chave" >> .env.local
echo "GHOSTPAY_COMPANY_ID=sua-company-id" >> .env.local
```

### ❌ Erro: "Erro na API de pagamento: 401"

**Causa:** Credenciais inválidas

**Solução:**
1. Verificar credenciais no painel GhostPay
2. Confirmar que não há espaços extras
3. Copiar e colar novamente

### ❌ Gateway não muda

**Solução:**
```bash
# 1. Editar .env.local
nano .env.local

# 2. Salvar (Ctrl+O, Enter, Ctrl+X)

# 3. Reiniciar OBRIGATÓRIO
pm2 restart cnh-social

# 4. Verificar logs
pm2 logs cnh-social --lines 20
```

---

## 📋 Checklist

- [ ] Credenciais GhostPay obtidas
- [ ] `.env.local` atualizado
- [ ] `PAYMENT_GATEWAY=ghostpay` configurado
- [ ] Aplicação reiniciada
- [ ] Teste executado com sucesso
- [ ] Logs verificados (sem erros)

---

## 📞 Suporte

**Documentação completa:** [INTEGRACAO_GHOSTPAY.md](./INTEGRACAO_GHOSTPAY.md)

**Logs em tempo real:**
```bash
pm2 logs cnh-social -f
```

---

**Pronto! GhostPay configurado! 👻✅**
