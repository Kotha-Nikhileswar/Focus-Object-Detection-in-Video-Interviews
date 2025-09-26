import { useEffect, useRef, useCallback } from 'react';

const ObjectDetection = ({ videoRef, onEvent }) => {
  const detectionIntervalRef = useRef(null);

  // Advanced object detection using computer vision techniques
  const detectObjects = useCallback((video) => {
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return [];
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const detectedObjects = [];
    
    // Phone Detection: Look for rectangular dark objects with reflective surfaces
    const phoneRegions = detectPhones(data, canvas.width, canvas.height);
    phoneRegions.forEach(region => {
      if (region.confidence > 0.5) {
        detectedObjects.push({
          class: 'cell phone',
          confidence: region.confidence,
          bbox: region.bbox
        });
      }
    });
    
    // Book Detection: Look for white/light rectangular objects with text patterns
    const bookRegions = detectBooks(data, canvas.width, canvas.height);
    bookRegions.forEach(region => {
      if (region.confidence > 0.4) {
        detectedObjects.push({
          class: 'book',
          confidence: region.confidence,
          bbox: region.bbox
        });
      }
    });
    
    // Laptop Detection: Look for dark rectangles with bright screen areas
    const laptopRegions = detectLaptops(data, canvas.width, canvas.height);
    laptopRegions.forEach(region => {
      if (region.confidence > 0.45) {
        detectedObjects.push({
          class: 'laptop',
          confidence: region.confidence,
          bbox: region.bbox
        });
      }
    });
    
    return detectedObjects;
  }, []);

  // Phone detection algorithm
  const detectPhones = useCallback((data, width, height) => {
    const regions = [];
    const blockSize = 24;
    
    for (let y = 0; y < height - blockSize * 3; y += blockSize) {
      for (let x = 0; x < width - blockSize * 2; x += blockSize) {
        let darkPixels = 0;
        let reflectivePixels = 0;
        let edgeStrength = 0;
        let totalPixels = 0;
        
        // Analyze rectangular region (phone aspect ratio ~2:1)
        for (let by = y; by < y + blockSize * 3; by += 2) {
          for (let bx = x; bx < x + blockSize * 2; bx += 2) {
            const index = (by * width + bx) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            const brightness = (r + g + b) / 3;
            const saturation = Math.max(r, g, b) - Math.min(r, g, b);
            
            // Phone characteristics: dark body with some reflective/bright spots
            if (brightness < 80 && saturation < 30) {
              darkPixels++;
            }
            
            // Reflective spots (screen reflections, logos)
            if (brightness > 180 && saturation < 40) {
              reflectivePixels++;
            }
            
            // Edge detection for rectangular shape
            if (bx < x + blockSize * 2 - 2) {
              const nextIndex = (by * width + bx + 2) * 4;
              const nextBrightness = (data[nextIndex] + data[nextIndex + 1] + data[nextIndex + 2]) / 3;
              edgeStrength += Math.abs(brightness - nextBrightness);
            }
            
            totalPixels++;
          }
        }
        
        const darkRatio = darkPixels / totalPixels;
        const reflectiveRatio = reflectivePixels / totalPixels;
        const avgEdgeStrength = edgeStrength / totalPixels;
        
        // Phone detection criteria
        if (darkRatio > 0.4 && darkRatio < 0.8 && 
            reflectiveRatio > 0.02 && reflectiveRatio < 0.15 && 
            avgEdgeStrength > 15) {
          
          const confidence = Math.min(
            0.3 + (darkRatio - 0.4) * 0.5 + 
            reflectiveRatio * 2 + 
            (avgEdgeStrength - 15) / 50,
            0.95
          );
          
          regions.push({
            confidence,
            bbox: [x, y, blockSize * 2, blockSize * 3]
          });
        }
      }
    }
    
    return regions;
  }, []);

  // Book detection algorithm  
  const detectBooks = useCallback((data, width, height) => {
    const regions = [];
    const blockSize = 32;
    
    for (let y = 0; y < height - blockSize * 2; y += blockSize) {
      for (let x = 0; x < width - blockSize * 3; x += blockSize) {
        let whitePixels = 0;
        let blackPixels = 0;
        let textPattern = 0;
        let totalPixels = 0;
        
        // Analyze rectangular region (book aspect ratio ~3:2)
        for (let by = y; by < y + blockSize * 2; by += 2) {
          for (let bx = x; bx < x + blockSize * 3; bx += 2) {
            const index = (by * width + bx) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            const brightness = (r + g + b) / 3;
            const isGrayscale = Math.abs(r - g) < 20 && Math.abs(g - b) < 20;
            
            // Book characteristics: mostly white/light with black text
            if (brightness > 200 && isGrayscale) {
              whitePixels++;
            }
            
            if (brightness < 60 && isGrayscale) {
              blackPixels++;
            }
            
            // Text pattern detection (alternating light/dark)
            if (bx < x + blockSize * 3 - 4) {
              const nextIndex = (by * width + bx + 4) * 4;
              const nextBrightness = (data[nextIndex] + data[nextIndex + 1] + data[nextIndex + 2]) / 3;
              
              if (Math.abs(brightness - nextBrightness) > 80) {
                textPattern++;
              }
            }
            
            totalPixels++;
          }
        }
        
        const whiteRatio = whitePixels / totalPixels;
        const blackRatio = blackPixels / totalPixels;
        const textRatio = textPattern / totalPixels;
        
        // Book detection criteria
        if (whiteRatio > 0.3 && whiteRatio < 0.8 && 
            blackRatio > 0.05 && blackRatio < 0.3 && 
            textRatio > 0.1) {
          
          const confidence = Math.min(
            0.2 + whiteRatio * 0.4 + 
            blackRatio * 1.5 + 
            textRatio * 2,
            0.9
          );
          
          regions.push({
            confidence,
            bbox: [x, y, blockSize * 3, blockSize * 2]
          });
        }
      }
    }
    
    return regions;
  }, []);

  // Laptop detection algorithm
  const detectLaptops = useCallback((data, width, height) => {
    const regions = [];
    const blockSize = 40;
    
    for (let y = 0; y < height - blockSize * 2; y += blockSize) {
      for (let x = 0; x < width - blockSize * 3; x += blockSize) {
        let screenBrightness = 0;
        let keyboardDarkness = 0;
        let screenPixels = 0;
        let keyboardPixels = 0;
        let hasScreenGlow = false;
        
        // Analyze screen area (top half)
        for (let by = y; by < y + blockSize; by += 3) {
          for (let bx = x; bx < x + blockSize * 3; bx += 3) {
            const index = (by * width + bx) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            const brightness = (r + g + b) / 3;
            screenBrightness += brightness;
            screenPixels++;
            
            // Screen glow detection (bluish light)
            if (b > r && b > g && brightness > 100) {
              hasScreenGlow = true;
            }
          }
        }
        
        // Analyze keyboard area (bottom half)
        for (let by = y + blockSize; by < y + blockSize * 2; by += 3) {
          for (let bx = x; bx < x + blockSize * 3; bx += 3) {
            const index = (by * width + bx) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            const brightness = (r + g + b) / 3;
            keyboardDarkness += brightness;
            keyboardPixels++;
          }
        }
        
        screenBrightness /= screenPixels;
        keyboardDarkness /= keyboardPixels;
        
        // Laptop detection criteria
        if (screenBrightness > 90 && keyboardDarkness < 100 && 
            screenBrightness > keyboardDarkness + 30 && hasScreenGlow) {
          
          const brightnessDiff = screenBrightness - keyboardDarkness;
          const confidence = Math.min(
            0.25 + (brightnessDiff - 30) / 200 + 
            (hasScreenGlow ? 0.2 : 0),
            0.88
          );
          
          regions.push({
            confidence,
            bbox: [x, y, blockSize * 3, blockSize * 2]
          });
        }
      }
    }
    
    return regions;
  }, []);

  const performObjectDetection = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      const predictions = detectObjects(videoRef.current);
      
      // Filter for unauthorized objects with specific confidence thresholds
      const unauthorizedObjects = predictions.filter(prediction => {
        const className = prediction.class.toLowerCase();
        const confidence = prediction.confidence || 0;
        
        return (
          (className.includes('cell phone') || className.includes('phone')) ||
          (className.includes('book')) ||
          (className.includes('laptop') || className.includes('computer'))
        ) && confidence > 0.4;
      });

      unauthorizedObjects.forEach(obj => {
        const confidence = (obj.confidence * 100).toFixed(1);
        const className = obj.class;
        const message = `🚨 Unauthorized object detected: ${className} (${confidence}% confidence)`;
        onEvent(message, 'suspicious');
      });

      // Debug logging
      if (predictions.length > 0) {
        const detectedItems = predictions.map(p => `${p.class} (${(p.confidence * 100).toFixed(1)}%)`).join(', ');
        console.log('Objects detected:', detectedItems);
      }

    } catch (error) {
      console.error('Object detection error:', error);
      onEvent('Object detection error: ' + error.message, 'error');
    }
  }, [detectObjects, onEvent]);

  useEffect(() => {
    onEvent('Advanced object detection system initialized', 'info');
    
    // Start detection interval (every 3 seconds as specified)
    detectionIntervalRef.current = setInterval(() => {
      performObjectDetection();
    }, 3000);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      onEvent('Object detection monitoring stopped', 'info');
    };
  }, [performObjectDetection, onEvent]);

  return null; // This component doesn't render anything visible
};

export default ObjectDetection;