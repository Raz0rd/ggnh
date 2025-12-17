# 🚀 Guia de Deploy - Ubuntu Server

## Requisitos do Sistema

- **Ubuntu**: 20.04 LTS ou superior
- **Node.js**: 18.17.0 ou superior
- **NPM**: 9.x ou superior
- **PM2**: Para gerenciamento de processos
- **Nginx**: Para proxy reverso (opcional, mas recomendado)
- **Memória RAM**: Mínimo 2GB
- **Espaço em disco**: Mínimo 2GB

---

## 📋 Passo a Passo

### 1. Atualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Node.js 18.x

```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar instalação
node --version  # Deve mostrar v18.x.x
npm --version   # Deve mostrar 9.x.x
```

### 3. Instalar PM2 (Gerenciador de Processos)

```bash
sudo npm install -g pm2

# Configurar PM2 para iniciar com o sistema
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

### 4. Clonar o Repositório

```bash
# Navegar para o diretório desejado
cd /var/www  # ou outro diretório de sua preferência
# Se não existir, criar:
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

# Clonar repositório
git clone https://github.com/Raz0rd/ggnh.git
cd ggnh
```

### 5. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar variáveis de ambiente
nano .env.local
```

**Conteúdo do `.env.local`:**
```env
# API Umbrela (Pagamentos PIX)
UMBRELA_API_KEY=84f2022f-a84b-4d63-a727-1780e6261fe8
UMBRELA_BASE_URL=https://api-gateway.umbrellapag.com/api

# API de Consulta CPF
CPF_API_BASE=http://74.50.76.90:7000
CPF_API_TOKEN=f9361c92e28d38772782e826d2442d07c5fdd833d9b3efe4beadffae322292da

# Ambiente
NODE_ENV=production
```

### 6. Instalar Dependências

```bash
npm install
```

### 7. Build da Aplicação

```bash
npm run build
```

### 8. Iniciar com PM2

```bash
# Iniciar aplicação
pm2 start npm --name "cnh-social" -- start

# Salvar configuração do PM2
pm2 save

# Verificar status
pm2 status

# Ver logs
pm2 logs cnh-social
```

### 9. Configurar Firewall (UFW)

```bash
# Habilitar firewall
sudo ufw enable

# Permitir SSH
sudo ufw allow 22/tcp

# Permitir porta da aplicação (3000)
sudo ufw allow 3000/tcp

# Se usar Nginx (porta 80 e 443)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verificar status
sudo ufw status
```

---

## 🌐 Configurar Nginx (Opcional, mas Recomendado)

### 1. Instalar Nginx

```bash
sudo apt install -y nginx
```

### 2. Criar Configuração do Site

```bash
sudo nano /etc/nginx/sites-available/cnh-social
```

**Conteúdo:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;  # Alterar para seu domínio

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Ativar Site

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/cnh-social /etc/nginx/sites-enabled/

# Remover site padrão (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 4. Configurar SSL com Let's Encrypt (Opcional)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com.br

# Renovação automática já está configurada
```

---

## 🔄 Comandos Úteis PM2

```bash
# Ver status de todas as aplicações
pm2 status

# Ver logs em tempo real
pm2 logs cnh-social

# Reiniciar aplicação
pm2 restart cnh-social

# Parar aplicação
pm2 stop cnh-social

# Remover aplicação
pm2 delete cnh-social

# Monitorar recursos
pm2 monit

# Ver informações detalhadas
pm2 info cnh-social
```

---

## 🔄 Atualizar Aplicação

```bash
# Navegar para o diretório
cd /var/www/ggnh

# Parar aplicação
pm2 stop cnh-social

# Atualizar código
git pull origin main

# Instalar novas dependências (se houver)
npm install

# Rebuild
npm run build

# Reiniciar aplicação
pm2 restart cnh-social

# Verificar logs
pm2 logs cnh-social --lines 50
```

---

## 🐛 Troubleshooting

### Aplicação não inicia

```bash
# Verificar logs
pm2 logs cnh-social

# Verificar se a porta 3000 está em uso
sudo lsof -i :3000

# Matar processo na porta 3000
sudo kill -9 $(sudo lsof -t -i:3000)
```

### Build falha

```bash
# Limpar cache
rm -rf .next node_modules package-lock.json

# Reinstalar dependências
npm install

# Tentar build novamente
npm run build
```

### Erro de permissões

```bash
# Ajustar permissões do diretório
sudo chown -R $USER:$USER /var/www/ggnh
```

### Nginx retorna 502 Bad Gateway

```bash
# Verificar se a aplicação está rodando
pm2 status

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Memória insuficiente

```bash
# Aumentar limite de memória do Node.js
pm2 delete cnh-social
pm2 start npm --name "cnh-social" --node-args="--max-old-space-size=2048" -- start
pm2 save
```

---

## 📊 Monitoramento

### Verificar uso de recursos

```bash
# CPU e memória
htop

# Espaço em disco
df -h

# Processos Node.js
ps aux | grep node
```

### Logs do sistema

```bash
# Logs do PM2
pm2 logs

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs do sistema
sudo journalctl -u nginx -f
```

---

## 🔒 Segurança

### 1. Configurar Firewall

```bash
# Apenas portas necessárias
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 2. Fail2Ban (Proteção contra ataques)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Atualizar sistema regularmente

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 📝 Checklist de Deploy

- [ ] Ubuntu atualizado
- [ ] Node.js 18.x instalado
- [ ] PM2 instalado e configurado
- [ ] Repositório clonado
- [ ] `.env.local` configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Build executado com sucesso (`npm run build`)
- [ ] Aplicação iniciada com PM2
- [ ] PM2 configurado para iniciar com o sistema
- [ ] Firewall configurado
- [ ] Nginx instalado e configurado (opcional)
- [ ] SSL configurado (opcional)
- [ ] Aplicação acessível via navegador
- [ ] Logs sem erros

---

## 🌐 Acessar Aplicação

### Sem Nginx (porta 3000)
```
http://seu-ip-servidor:3000
```

### Com Nginx (porta 80/443)
```
http://seu-dominio.com.br
https://seu-dominio.com.br  # Se SSL configurado
```

---

## 📞 Suporte

- **Next.js Docs:** https://nextjs.org/docs
- **PM2 Docs:** https://pm2.keymetrics.io/docs
- **Nginx Docs:** https://nginx.org/en/docs/

---

## ✅ Deploy Concluído!

Sua aplicação CNH Social 2025 está rodando em produção no Ubuntu! 🎉
