import React, { useState, useRef, useEffect } from 'react';

const WebcamComponent = ({ videoRef, canvasRef, isActive, onEvent }) => {
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [isActive]);

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      onEvent('Webcam access granted and started', 'success');
    } catch (error) {
      console.error('Error accessing webcam:', error);
      onEvent('Failed to access webcam: ' + error.message, 'error');
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (isRecording) {
      stopRecording();
    }
  };

  const startRecording = () => {
    if (!stream) {
      onEvent('Cannot start recording: No webcam stream available', 'error');
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      setRecordedChunks([]);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
        onEvent('Recording stopped', 'info');
      };

      mediaRecorder.start();
      setIsRecording(true);
      onEvent('Recording started', 'success');
    } catch (error) {
      console.error('Error starting recording:', error);
      onEvent('Failed to start recording: ' + error.message, 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) {
      onEvent('No recording available to download', 'warning');
      return;
    }

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-recording-${new Date().toISOString().slice(0, 19)}.webm`;
    link.click();
    URL.revokeObjectURL(url);
    
    onEvent('Recording downloaded successfully', 'success');
  };

  return (
    <div className="webcam-container">
      <h3>
        Webcam Feed 
        <span className={`status-indicator ${stream ? 'status-active' : 'status-inactive'}`}></span>
        {stream ? 'Active' : 'Inactive'}
      </h3>
      
      <div className="video-container">
        <video
          ref={videoRef}
          className="video-feed"
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
          width="640"
          height="480"
        />
      </div>

      <div className="video-controls">
        <button
          className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!stream}
        >
          {isRecording ? '⏹ Stop Recording' : '🔴 Start Recording'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={downloadRecording}
          disabled={recordedChunks.length === 0}
        >
          📥 Download Recording
        </button>

        <div className="recording-status">
          {isRecording && (
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              🔴 Recording in progress...
            </span>
          )}
          
          {recordedChunks.length > 0 && !isRecording && (
            <span style={{ color: 'green', fontWeight: 'bold' }}>
              ✅ Recording available for download
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamComponent;