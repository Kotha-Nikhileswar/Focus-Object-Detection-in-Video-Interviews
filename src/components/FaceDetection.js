import { useEffect, useRef, useCallback } from 'react';

const FaceDetection = ({ videoRef, canvasRef, onEvent }) => {
  const faceDetectionRef = useRef(null);
  const lastFaceDetectedRef = useRef(Date.now());
  const lastLookingAwayRef = useRef(Date.now());
  const noFaceTimerRef = useRef(null);
  const lookingAwayTimerRef = useRef(null);

  // Simple face detection fallback using basic computer vision principles
  const detectFaces = useCallback((video, canvas) => {
    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      return { faces: [], lookingAway: false };
    }

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const faces = [];
    
    // Simple center-based face detection for single person interviews
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const faceRegionSize = Math.min(canvas.width, canvas.height) * 0.4;
    
    let skinPixels = 0;
    let totalPixels = 0;
    let avgBrightness = 0;
    
    // Check main face region (center area)
    for (let y = centerY - faceRegionSize/2; y < centerY + faceRegionSize/2; y += 3) {
      for (let x = centerX - faceRegionSize/2; x < centerX + faceRegionSize/2; x += 3) {
        if (y >= 0 && y < canvas.height && x >= 0 && x < canvas.width) {
          const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          const brightness = (r + g + b) / 3;
          avgBrightness += brightness;
          
          // Improved skin color detection
          if (r > 95 && g > 40 && b > 20 && 
              Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
              Math.abs(r - g) > 15 && r > g && r > b &&
              r < 240 && brightness > 50 && brightness < 220) {
            skinPixels++;
          }
          totalPixels++;
        }
      }
    }
    
    const skinRatio = skinPixels / totalPixels;
    avgBrightness /= totalPixels;
    
    // Single face detection logic
    if (skinRatio > 0.12 && avgBrightness > 60 && avgBrightness < 200) {
      faces.push({
        x: centerX - faceRegionSize/4,
        y: centerY - faceRegionSize/4,
        width: faceRegionSize/2,
        height: faceRegionSize/2,
        confidence: skinRatio,
        brightness: avgBrightness
      });
    }
    
    // Check for additional faces in corners (multiple person detection)
    const cornerRegions = [
      { x: 0, y: 0, name: 'top-left' },
      { x: canvas.width - faceRegionSize/2, y: 0, name: 'top-right' },
      { x: 0, y: canvas.height - faceRegionSize/2, name: 'bottom-left' },
      { x: canvas.width - faceRegionSize/2, y: canvas.height - faceRegionSize/2, name: 'bottom-right' }
    ];
    
    cornerRegions.forEach(corner => {
      let cornerSkinPixels = 0;
      let cornerTotalPixels = 0;
      let cornerBrightness = 0;
      
      const regionSize = faceRegionSize / 2;
      
      for (let y = corner.y; y < corner.y + regionSize; y += 4) {
        for (let x = corner.x; x < corner.x + regionSize; x += 4) {
          if (y >= 0 && y < canvas.height && x >= 0 && x < canvas.width) {
            const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            const brightness = (r + g + b) / 3;
            cornerBrightness += brightness;
            
            if (r > 95 && g > 40 && b > 20 && 
                Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                Math.abs(r - g) > 15 && r > g && r > b &&
                r < 240 && brightness > 50 && brightness < 220) {
              cornerSkinPixels++;
            }
            cornerTotalPixels++;
          }
        }
      }
      
      const cornerSkinRatio = cornerSkinPixels / cornerTotalPixels;
      cornerBrightness /= cornerTotalPixels;
      
      // Only detect as additional face if significantly different from center
      if (cornerSkinRatio > 0.15 && cornerBrightness > 60 && cornerBrightness < 200 &&
          faces.length > 0) { // Only if we already detected a center face
        
        // Check if this corner region is significantly separate from center face
        const centerFace = faces[0];
        const distance = Math.sqrt(
          Math.pow(corner.x + regionSize/2 - (centerFace.x + centerFace.width/2), 2) +
          Math.pow(corner.y + regionSize/2 - (centerFace.y + centerFace.height/2), 2)
        );
        
        if (distance > faceRegionSize * 0.6) { // Must be far enough from center
          faces.push({
            x: corner.x,
            y: corner.y,
            width: regionSize,
            height: regionSize,
            confidence: cornerSkinRatio,
            brightness: cornerBrightness,
            region: corner.name
          });
        }
      }
    });
    
    // Determine if looking away
    let lookingAway = false;
    if (faces.length === 1) {
      const face = faces[0];
      // Looking away if face is off-center or poor quality
      const distanceFromCenter = Math.sqrt(
        Math.pow((face.x + face.width/2) - centerX, 2) + 
        Math.pow((face.y + face.height/2) - centerY, 2)
      );
      
      if (distanceFromCenter > faceRegionSize * 0.3 || 
          face.confidence < 0.15 || 
          face.brightness < 70 || face.brightness > 180) {
        lookingAway = true;
      }
    }
    
    return { faces, lookingAway };
  }, []);

  const checkFaceDetection = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const result = detectFaces(videoRef.current, canvasRef.current);
    const currentTime = Date.now();

    if (result.faces && result.faces.length > 0) {
      lastFaceDetectedRef.current = currentTime;
      
      // Clear no face timer
      if (noFaceTimerRef.current) {
        clearTimeout(noFaceTimerRef.current);
        noFaceTimerRef.current = null;
      }

      // Check for multiple faces
      if (result.faces.length > 1) {
        onEvent('Multiple faces detected - Suspicious activity', 'suspicious');
      }

      // Check if looking away
      if (result.lookingAway) {
        if (currentTime - lastLookingAwayRef.current > 5000) { // 5 seconds
          onEvent('Candidate looking away from camera for more than 5 seconds', 'warning');
          lastLookingAwayRef.current = currentTime;
        }
      } else {
        lastLookingAwayRef.current = currentTime;
        // Clear looking away timer
        if (lookingAwayTimerRef.current) {
          clearTimeout(lookingAwayTimerRef.current);
          lookingAwayTimerRef.current = null;
        }
      }
    } else {
      // No face detected
      if (currentTime - lastFaceDetectedRef.current > 10000) { // 10 seconds
        if (!noFaceTimerRef.current) {
          noFaceTimerRef.current = setTimeout(() => {
            onEvent('No face detected for more than 10 seconds', 'warning');
            noFaceTimerRef.current = null;
          }, 1000);
        }
      }
    }
  }, [detectFaces, onEvent]);

  useEffect(() => {
    const interval = setInterval(checkFaceDetection, 1000); // Check every second
    
    return () => {
      clearInterval(interval);
      if (noFaceTimerRef.current) {
        clearTimeout(noFaceTimerRef.current);
      }
      if (lookingAwayTimerRef.current) {
        clearTimeout(lookingAwayTimerRef.current);
      }
    };
  }, [checkFaceDetection]);

  useEffect(() => {
    onEvent('Face detection monitoring started', 'info');
    
    return () => {
      onEvent('Face detection monitoring stopped', 'info');
    };
  }, [onEvent]);

  return null; // This component doesn't render anything visible
};

export default FaceDetection;