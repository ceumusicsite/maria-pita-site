@echo off
cd /d "%~dp0"
cls
echo.
echo ========================================
echo   MARIA PITA - INICIAR PROJETO
echo ========================================
echo.
echo Este script vai:
echo 1. Iniciar o BACKEND (porta 8000)
echo 2. Iniciar o FRONTEND (porta 3000)
echo.
echo ========================================
echo.
pause
echo.
echo [1/2] Iniciando Backend...
echo.
cd backend
start "Backend Maria Pita" cmd /k "py server.py"
echo Backend iniciado em nova janela!
echo.
timeout /t 3 /nobreak > nul
echo [2/2] Iniciando Frontend...
echo.
cd ..\frontend
start "Frontend Maria Pita" cmd /k "npm start"
echo Frontend iniciado em nova janela!
echo.
echo ========================================
echo   PROJETO INICIADO COM SUCESSO!
echo ========================================
echo.
echo Backend: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
echo Aguarde as janelas abrirem...
echo Nao feche as janelas do Backend e Frontend!
echo.
echo ========================================
pause

