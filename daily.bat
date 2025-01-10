@echo off

:: Variável especial no Windows que se refere ao diretório atual do script
cd /d "%~dp0"

node script.js

pause