@echo off
echo Setting up Interview Proctoring System...

echo.
echo Step 1: Installing React and dependencies...
call npm install react react-dom react-scripts web-vitals --save

echo.
echo Step 2: Installing development dependencies...
call npm install --save-dev

echo.
echo Step 3: Verifying installation...
if exist "node_modules\react\package.json" (
    echo ✅ React installed successfully
) else (
    echo ❌ React installation failed
)

echo.
echo Step 4: Starting development server...
echo You can now run: npm start
echo.

echo Setup complete! 
echo.
echo To start the application:
echo 1. Open Command Prompt/PowerShell
echo 2. Navigate to this directory
echo 3. Run: npm start
echo 4. Open browser to http://localhost:3000
echo.

pause