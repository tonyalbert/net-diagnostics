@echo off
REM Script para rodar a aplicação Beegol no Windows

echo.
echo ================================
echo   Diagnosticos de Rede
echo ================================
echo.

if "%1"=="" goto run
if "%1"=="help" goto help
if "%1"=="install" goto install
if "%1"=="db-setup" goto db-setup
if "%1"=="backend" goto backend
if "%1"=="frontend" goto frontend
if "%1"=="clean" goto clean
goto help

:help
echo Comandos disponiveis:
echo.
echo   run.bat              - Roda backend e frontend
echo   run.bat install      - Instala dependencias
echo   run.bat db-setup     - Cria banco de dados
echo   run.bat backend      - Roda apenas backend
echo   run.bat frontend     - Roda apenas frontend
echo   run.bat clean        - Limpa arquivos temporarios
echo.
goto end

:install
echo [1/2] Instalando dependencias do backend...
cd backend
python -m venv .venv
echo.
echo Para instalar as dependencias do Python, execute:
echo   backend\.venv\Scripts\activate
echo   pip install -r backend\requirements.txt
echo.
cd ..

echo [2/2] Instalando dependencias do frontend...
cd frontend
call npm install
cd ..
echo.
echo Instalacao concluida!
goto end

:db-setup
echo Criando banco de dados...
cd backend
python create_and_populate_db.py
cd ..
echo.
echo Banco de dados criado com sucesso!
goto end

:backend
echo Iniciando backend na porta 5000...
echo Backend: http://localhost:5000
cd backend
call .venv\Scripts\activate
python run.py
goto end

:frontend
echo Iniciando frontend na porta 5173...
echo Frontend: http://localhost:5173
cd frontend
call npm run dev
goto end

:run
echo Iniciando aplicacao completa...
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Abrindo backend...
start cmd /k "cd backend && call .venv\Scripts\activate && python run.py"
timeout /t 2 /nobreak >nul
echo Abrindo frontend...
start cmd /k "cd frontend && npm run dev"
echo.
echo Aplicacao iniciada!
echo Feche as janelas para encerrar.
goto end

:clean
echo Limpando arquivos temporarios...
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"
for /d /r . %%d in (.pytest_cache) do @if exist "%%d" rd /s /q "%%d"
del /s /q *.pyc >nul 2>&1
if exist frontend\dist rd /s /q frontend\dist
echo Limpeza concluida!
goto end

:end
echo.

