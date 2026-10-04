@echo off
setlocal
cd /d "%~dp0"
where python >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Python no esta disponible en PATH.
  echo Puedes usar cualquier servidor estatico equivalente.
  pause
  exit /b 1
)
echo Iniciando ABYSSAL HAND 404...
python server.py
set ERR=%ERRORLEVEL%
if not "%ERR%"=="0" pause
exit /b %ERR%
