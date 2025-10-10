@echo off
echo ========================================
echo  Deploy CNH Social 2025 - Netlify
echo  Site: superlative-pithivier-775203
echo ========================================
echo.

echo [1/5] Verificando Netlify CLI...
where netlify >nul 2>&1
if %errorlevel% neq 0 (
    echo Netlify CLI nao encontrado. Instalando...
    call npm install -g netlify-cli
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar Netlify CLI
        pause
        exit /b 1
    )
)

echo.
echo [2/5] Verificando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo [3/5] Verificando tipos e executando build...
call npm run pre-deploy
if %errorlevel% neq 0 (
    echo ERRO: Build falhou! Corrija os erros antes de fazer deploy.
    pause
    exit /b 1
)

echo.
echo [4/5] Conectando ao site Netlify...
echo Site ID: d11e746b-f731-4049-bb1e-76f1d4c1369c
echo.
echo IMPORTANTE: Voce precisara fazer login no Netlify.
echo Pressione qualquer tecla para continuar...
pause >nul

netlify link --id d11e746b-f731-4049-bb1e-76f1d4c1369c

echo.
echo [5/5] Fazendo deploy...
netlify deploy --prod --dir=.next

echo.
echo ========================================
echo  Deploy concluido!
echo ========================================
echo.
echo Seu site esta disponivel em:
echo https://superlative-pithivier-775203.netlify.app
echo.
pause
