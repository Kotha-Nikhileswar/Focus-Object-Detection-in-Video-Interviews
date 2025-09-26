# Online Interview Proctoring System

A React.js-based online interview proctoring system that monitors candidates during virtual interviews using webcam, face detection, and object detection technologies.

## Features

### 🎥 Webcam Integration
- **Live Video Feed**: Captures and displays candidate's webcam feed
- **Video Recording**: Records the entire interview session using MediaRecorder API
- **Download Recording**: Allows downloading recorded video locally

### 👤 Face Detection & Monitoring
- **Focus Monitoring**: Detects when candidate looks away from camera (>5 seconds)
- **Absence Detection**: Alerts when no face is detected (>10 seconds)
- **Multiple Face Detection**: Identifies when multiple people are present
- **Real-time Analysis**: Continuous monitoring throughout the interview

### 📱 Object Detection
- **Unauthorized Object Detection**: Identifies cell phones, books, and laptops
- **TensorFlow.js Integration**: Uses COCO-SSD model for object recognition
- **Periodic Scanning**: Analyzes video frames every 3 seconds
- **Suspicious Activity Logging**: Records when unauthorized objects are detected

### 📊 Real-time Event Logging
- **Live Event Feed**: Displays events as they happen with timestamps
- **Event Classification**: Categorizes events (info, warning, suspicious, error)
- **Event Statistics**: Shows counts of different event types
- **Searchable History**: Complete log of all interview events

### 📈 Integrity Scoring & Reporting
- **Integrity Score Calculation**: 100 - (5 points per suspicious event)
- **Comprehensive Reports**: Detailed analysis of interview session
- **CSV Export**: Downloadable spreadsheet format
- **PDF Reports**: Professional formatted reports
- **Interview Statistics**: Duration, focus lost events, suspicious activities

## Installation

1. **Clone or Download** the project
2. **Navigate to project directory**:
   ```bash
   cd interview-proctoring-system
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start Development Server**:
   ```bash
   npm start
   ```

5. **Open Browser**: Navigate to `http://localhost:3000`

## Usage

### Starting an Interview
1. Enter the candidate's name
2. Click "Start Interview"
3. Allow webcam access when prompted
4. The system will begin monitoring automatically

### During the Interview
- **Webcam feed** displays in the main panel
- **Event log** shows real-time monitoring alerts
- **Recording controls** allow starting/stopping video capture
- **System monitors** for face detection and unauthorized objects

### Generating Reports
1. End the interview session
2. Click "Download CSV Report" for spreadsheet format
3. Click "Download PDF Report" for formatted document
4. Reports include:
   - Candidate information
   - Interview duration
   - Event counts and details
   - Integrity score
   - Complete event timeline

## Technical Implementation

### Face Detection
- Uses basic computer vision principles
- Analyzes skin tone and facial regions
- Monitors for presence and attention
- Configurable sensitivity thresholds

### Object Detection
- Implements pattern recognition for common objects
- Analyzes shape, color, and texture patterns
- Detects phones, books, and laptops
- Real-time frame analysis

### Event System
- Timestamped event logging
- Type-based event classification
- Real-time UI updates
- Persistent event storage

### Report Generation
- Dynamic integrity scoring
- Multiple export formats
- Professional formatting
- Comprehensive statistics

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Partial support (some features may be limited)
- **Edge**: Full support

## Privacy & Security

- **Local Processing**: All analysis done client-side
- **No Data Upload**: Video and events stay on local machine
- **User Consent**: Explicit permission required for webcam access
- **Secure Recording**: Files saved locally only

## System Requirements

- **Modern Browser**: Chrome 60+, Firefox 55+, Safari 11+
- **Webcam**: Working camera with microphone
- **Internet Connection**: For initial loading (detection works offline)
- **Storage**: Minimum 1GB free space for recordings

## Troubleshooting

### Webcam Issues
- **Permission Denied**: Check browser camera permissions
- **No Video**: Ensure camera is not used by other applications
- **Poor Quality**: Adjust lighting and camera position

### Detection Issues
- **False Positives**: Adjust lighting conditions
- **Missed Detections**: Ensure proper camera angle and distance
- **Performance**: Close other applications to free up resources

### Recording Problems
- **No Audio**: Check microphone permissions
- **Large Files**: Consider shorter recording segments
- **Browser Crashes**: Try reducing video quality settings

## Future Enhancements

- Integration with real MediaPipe and TensorFlow.js
- Cloud storage options
- Advanced analytics dashboard
- Multi-language support
- Mobile device support
- Custom detection training

## License

This project is for educational and demonstration purposes. Please ensure compliance with local privacy laws and regulations when implementing in production environments.

## Support

For technical issues or questions about implementation, please refer to the code comments and documentation within each component file.