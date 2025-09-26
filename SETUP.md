# Installation and Setup Instructions

## Quick Start

1. **Open Command Prompt or PowerShell**
2. **Navigate to the project directory:**
   ```bash
   cd "c:\Users\nikhi\OneDrive\Desktop\Tutedude SDE Assignment\interview-proctoring-system"
   ```
3. **Run the setup script:**
   ```bash
   setup.bat
   ```
   OR manually install:
   ```bash
   npm install
   npm start
   ```

## Manual Installation Steps

If the automated setup doesn't work:

### 1. Install Node.js
- Download from: https://nodejs.org/
- Install the LTS version
- Restart your terminal

### 2. Install Dependencies
```bash
npm install react react-dom react-scripts
```

### 3. Start the Application
```bash
npm start
```

### 4. Access the Application
- Open browser to: http://localhost:3000
- Allow webcam access when prompted

## Project Structure

```
interview-proctoring-system/
├── public/
│   └── index.html           # Main HTML template
├── src/
│   ├── components/
│   │   ├── WebcamComponent.js      # Webcam capture and recording
│   │   ├── FaceDetection.js        # Face detection logic
│   │   ├── ObjectDetection.js      # Object detection logic
│   │   ├── EventLogger.js          # Real-time event logging
│   │   └── ReportGenerator.js      # Report generation and export
│   ├── utils/
│   │   └── helpers.js              # Utility functions
│   ├── App.js                      # Main application component
│   ├── index.js                    # React entry point
│   └── index.css                   # Global styles
├── README.md                       # Project documentation
├── package.json                    # Project dependencies
└── setup.bat                       # Windows setup script
```

## Features Implemented

### ✅ Webcam Integration
- Live video feed display
- MediaRecorder API for video recording
- Local video download functionality

### ✅ Face Detection
- Real-time face presence monitoring
- Looking away detection (>5 seconds)
- No face detection alerts (>10 seconds)
- Multiple face detection

### ✅ Object Detection  
- Unauthorized object detection (phone, book, laptop)
- Periodic scanning every 3 seconds
- Pattern-based recognition system

### ✅ Event Logging
- Real-time event display with timestamps
- Event categorization (info, warning, suspicious, error)
- Complete event history tracking

### ✅ Report Generation
- Integrity score calculation (100 - 5 points per suspicious event)
- CSV export functionality
- PDF report generation
- Comprehensive interview statistics

### ✅ User Interface
- Single-page application design
- Real-time event log panel
- Video controls and status indicators
- Professional report display

## Troubleshooting

### Cannot start development server
1. Ensure Node.js is installed: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
4. Check for permission issues

### Webcam not working
1. Check browser permissions
2. Ensure camera is not used by other applications
3. Try different browsers (Chrome recommended)

### Build errors
1. Check Node.js version (14+ recommended)
2. Update npm: `npm update -g npm`
3. Clear cache and reinstall dependencies

## Development Notes

The application uses:
- **React 18** for UI components
- **MediaRecorder API** for video recording
- **getUserMedia API** for webcam access
- **Canvas API** for image processing
- **Basic Computer Vision** for detection algorithms

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+ 
- ✅ Edge 79+
- ⚠️ Safari 11+ (limited support)

## Privacy Considerations

- All processing is done client-side
- No data is sent to external servers
- Video recordings stay on local machine
- User consent required for camera access

## Performance Tips

1. Close unnecessary applications
2. Use good lighting conditions
3. Position camera at eye level
4. Ensure stable internet for initial load
5. Use Chrome for best performance

## Next Steps for Production

1. Integrate real MediaPipe Face Detection library
2. Add TensorFlow.js COCO-SSD model
3. Implement cloud storage options
4. Add user authentication
5. Create admin dashboard
6. Add mobile device support