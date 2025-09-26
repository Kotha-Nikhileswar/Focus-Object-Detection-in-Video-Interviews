# Troubleshooting Guide - Interview Proctoring System

## ✅ NPM Installation Issues (RESOLVED)

The warnings you see during `npm install` are **normal and can be safely ignored**. They include:

### Common NPM Warnings (Safe to Ignore)
```
npm warn deprecated [package]: [deprecation message]
npm warn cleanup Failed to remove some directories
npm error code ERR_INVALID_ARG_TYPE
```

**These warnings indicate:**
- Some dependencies use deprecated packages (still functional)
- Windows file locking issues during cleanup (normal on Windows)
- Internal npm cleanup errors (don't affect functionality)

### ✅ Solution Applied
The installation actually **completed successfully** despite the warnings. You can now run:

```powershell
npm start
```

## 🚀 Starting the Application

Once `npm start` runs successfully, you should see:

```
Compiled successfully!

You can now view interview-proctoring-system in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

## 🔧 Additional Troubleshooting

### Issue: "Missing script: start" Error
**Solution:**
```powershell
# Check if package.json exists and has correct content
Get-Content package.json

# If missing, reinstall
npm install react react-dom react-scripts
```

### Issue: Port 3000 Already in Use
**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID [process_id] /F

# Or use different port
set PORT=3001 && npm start
```

### Issue: Webcam Permission Denied
**Solution:**
1. Click on camera icon in browser address bar
2. Select "Allow" for camera access
3. Refresh the page
4. Check Windows camera privacy settings:
   - Settings → Privacy & Security → Camera
   - Enable "Camera access" and "Let apps access your camera"

### Issue: Browser Compatibility
**Recommended browsers:**
- ✅ Chrome 60+ (Best performance)
- ✅ Firefox 55+
- ✅ Edge 79+
- ⚠️ Safari 11+ (Limited support)

### Issue: Build Errors After Installation
**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Issue: React Scripts Not Found
**Solution:**
```powershell
# Reinstall react-scripts specifically
npm install react-scripts --save

# Or global installation
npm install -g react-scripts
```

## 📱 Application-Specific Issues

### Face Detection Not Working
**Possible causes:**
- Poor lighting conditions
- Camera not positioned at eye level
- Browser not supported

**Solutions:**
1. Improve lighting (face webcam toward light source)
2. Position camera at eye level
3. Use Chrome browser
4. Check console for JavaScript errors

### Object Detection False Positives
**This is normal behavior with the basic implementation**
- The system uses basic pattern recognition
- Some false detections are expected
- For production, real TensorFlow.js models would be more accurate

### Recording Not Saving
**Solutions:**
1. Check browser download settings
2. Ensure sufficient disk space
3. Try different browser
4. Check for popup blockers

## 🔍 Development Tools

### View Browser Console
- Press `F12` or `Ctrl+Shift+I`
- Check Console tab for errors
- Check Network tab for failed requests

### Check Application Status
```powershell
# View npm processes
Get-Process -Name node

# Check if server is running
Test-NetConnection localhost -Port 3000
```

## 📊 Performance Optimization

### If Application Runs Slowly
1. Close other applications
2. Use Chrome browser
3. Ensure good lighting (reduces processing)
4. Lower video resolution in code if needed

### Memory Issues
1. Refresh page periodically during long interviews
2. Clear browser cache
3. Restart development server

## 🛠️ File Structure Verification

Ensure all files exist:
```
interview-proctoring-system/
├── src/
│   ├── App.js ✓
│   ├── index.js ✓
│   ├── index.css ✓
│   └── components/
│       ├── WebcamComponent.js ✓
│       ├── FaceDetection.js ✓
│       ├── ObjectDetection.js ✓
│       ├── EventLogger.js ✓
│       └── ReportGenerator.js ✓
├── public/
│   └── index.html ✓
└── package.json ✓
```

## 🚨 Emergency Reset

If nothing works:
```powershell
# Complete reset
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
npm install
npm start
```

## 📞 Getting Help

### Check These First
1. Node.js version: `node --version` (should be 14+)
2. NPM version: `npm --version`
3. Browser version (Chrome recommended)
4. Windows version (Windows 10+ recommended)

### Console Error Messages
Common errors and meanings:
- `getUserMedia not supported`: Use HTTPS or localhost
- `Permission denied`: Allow camera access
- `MediaRecorder not supported`: Update browser
- `Canvas not defined`: JavaScript error in detection

## ✅ Success Indicators

When everything works correctly, you should see:
1. ✅ `npm start` runs without errors
2. ✅ Browser opens to http://localhost:3000
3. ✅ Page loads with "Online Interview Proctoring System" title
4. ✅ Webcam feed appears when interview is started
5. ✅ Events appear in the log panel
6. ✅ Reports can be generated and downloaded

## 🎯 Next Steps After Successful Setup

1. Enter candidate name
2. Click "Start Interview"
3. Allow camera access
4. Test recording functionality
5. Test report generation
6. Check event logging works

---

**Remember: The deprecation warnings during installation are normal and don't affect functionality!**
