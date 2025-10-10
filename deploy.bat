@echo off
echo ========================================
echo  Deploy CNH Social 2025 - Netlify
echo ========================================
echo.

echo [1/4] Verificando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo [2/4] Verificando tipos e executando build...
call npm run pre-deploy
if %errorlevel% neq 0 (
    echo ERRO: Build falhou! Corrija os erros antes de fazer deploy.
    pause
    exit /b 1
)

echo.
echo [3/4] Adicionando arquivos ao Git...
git add .

echo.
echo [4/4] Fazendo commit...
set /p commit_msg="Digite a mensagem do commit: "
git commit -m "%commit_msg%"

echo.
echo Enviando para o repositorio remoto...
git push

echo.
echo ========================================
echo  Deploy iniciado com sucesso!
echo ========================================
echo.
echo O Netlify detectara o push e iniciara
echo o deploy automaticamente.
echo.
echo Acesse: https://app.netlify.com
echo para acompanhar o progresso.
echo.
pause
