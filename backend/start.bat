@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo   Iniciando Backend Maria Pita
echo ========================================
echo.
echo Servidor iniciando na porta 8000...
echo Acesse: http://localhost:8000/docs
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
python server.py
pause





