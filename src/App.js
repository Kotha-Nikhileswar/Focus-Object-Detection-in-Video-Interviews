import React, { useState, useRef, useEffect, useCallback } from 'react';
import WebcamComponent from './components/WebcamComponent';
import EventLogger from './components/EventLogger';
import ReportGenerator from './components/ReportGenerator';
import FaceDetection from './components/FaceDetection';
import ObjectDetection from './components/ObjectDetection';

function App() {
  const [events, setEvents] = useState([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [interviewStartTime, setInterviewStartTime] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const addEvent = useCallback((eventMessage, eventType = 'info') => {
    const timestamp = new Date();
    const newEvent = {
      time: timestamp.toISOString(),
      event: eventMessage,
      type: eventType,
      timestamp: timestamp.getTime()
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    console.log(`Event logged: ${eventMessage} at ${timestamp.toLocaleTimeString()}`);
  }, []);

  const startInterview = () => {
    if (!candidateName.trim()) {
      alert('Please enter candidate name before starting the interview');
      return;
    }
    
    setIsInterviewActive(true);
    setInterviewStartTime(new Date());
    setEvents([]);
    addEvent('Interview session started', 'info');
  };

  const endInterview = () => {
    setIsInterviewActive(false);
    addEvent('Interview session ended', 'info');
  };

  const calculateInterviewDuration = () => {
    if (!interviewStartTime) return 0;
    const endTime = new Date();
    return Math.floor((endTime - interviewStartTime) / 1000 / 60); // Duration in minutes
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Online Interview Proctoring System</h1>
        <div className="candidate-info">
          <input
            type="text"
            placeholder="Enter candidate name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="candidate-input"
            disabled={isInterviewActive}
          />
          <button
            className={`btn ${isInterviewActive ? 'btn-danger' : 'btn-success'}`}
            onClick={isInterviewActive ? endInterview : startInterview}
          >
            {isInterviewActive ? 'End Interview' : 'Start Interview'}
          </button>
        </div>
      </header>

      <div className="main-container">
        <div className="video-section">
          <WebcamComponent 
            videoRef={videoRef}
            canvasRef={canvasRef}
            isActive={isInterviewActive}
            onEvent={addEvent}
          />
        </div>

        <div className="logs-section">
          <EventLogger events={events} />
        </div>
      </div>

      {/* Face Detection Component */}
      {isInterviewActive && (
        <FaceDetection
          videoRef={videoRef}
          canvasRef={canvasRef}
          onEvent={addEvent}
        />
      )}

      {/* Object Detection Component */}
      {isInterviewActive && (
        <ObjectDetection
          videoRef={videoRef}
          onEvent={addEvent}
        />
      )}

      <div className="report-section">
        <ReportGenerator
          events={events}
          candidateName={candidateName}
          interviewDuration={calculateInterviewDuration()}
          isInterviewActive={isInterviewActive}
        />
      </div>
    </div>
  );
}

export default App;