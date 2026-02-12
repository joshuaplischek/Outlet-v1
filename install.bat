@echo off
echo ========================================
echo Fensterpreiswert Outlet Portal Setup
echo ========================================
echo.

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please check your Node.js installation
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure EmailJS credentials in src/app/services/email.service.ts
echo 2. Add product images to public/images/products/
echo 3. Update company information in Impressum and Datenschutz pages
echo.
echo To start the development server, run:
echo   npm start
echo.
echo Or double-click: start-dev-server.bat
echo.
pause
