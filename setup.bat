@echo off
REM Script de configuracao inicial para Windows

echo.
echo ================================
echo   SETUP - Net Diagnostics
echo ================================
echo.

echo [1/4] Criando ambiente virtual Python...
cd backend
python -m venv .venv
echo Ambiente virtual criado!
echo.

echo [2/4] Instalando dependencias Python...
call .venv\Scripts\activate && pip install -r requirements.txt
echo Dependencias Python instaladas!
echo.

echo [3/4] Instalando dependencias do frontend...
cd ..\frontend
call npm install
echo Dependencias Node.js instaladas!
echo.

echo [4/4] Criando banco de dados...
cd ..\backend
python create_and_populate_db.py
cd ..
echo Banco de dados criado!
echo.

echo ================================
echo   SETUP CONCLUIDO!
echo ================================
echo.
echo Para iniciar a aplicacao, execute:
echo   run.bat
echo.
echo Ou inicie separadamente:
echo   Backend:  run.bat backend
echo   Frontend: run.bat frontend
echo.

pause

