import React, { useState, useEffect, useMemo } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

function Complex3DLoader() {
  const [time, setTime] = useState(0);
  const [isInitialAnimation, setIsInitialAnimation] = useState(true);

  // Generate brain-like structure points
  const brainPoints = useMemo(() => {
    const points: Point3D[] = [];
    const numPoints = 100;
    
    // Create points in a brain-like ellipsoid shape
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      // Ellipsoid parameters (stretched in x and z directions for brain shape)
      const a = 1.3; // x-axis stretch
      const b = 1.0; // y-axis
      const c = 1.1; // z-axis stretch
      
      points.push({
        x: a * 80 * Math.sin(phi) * Math.cos(theta),
        y: b * 60 * Math.sin(phi) * Math.sin(theta),
        z: c * 70 * Math.cos(phi)
      });
    }
    
    return points;
  }, []);

  // Generate random electric paths
  const electricPaths = useMemo(() => {
    const paths: Point3D[][] = [];
    const numPaths = 8;
    
    for (let i = 0; i < numPaths; i++) {
      const path: Point3D[] = [];
      let currentPoint = { ...brainPoints[Math.floor(Math.random() * brainPoints.length)] };
      
      for (let j = 0; j < 5; j++) {
        path.push({ ...currentPoint });
        currentPoint = {
          x: currentPoint.x + (Math.random() - 0.5) * 40,
          y: currentPoint.y + (Math.random() - 0.5) * 40,
          z: currentPoint.z + (Math.random() - 0.5) * 40
        };
      }
      paths.push(path);
    }
    
    return paths;
  }, [brainPoints]);

  const transformPoint = (point: Point3D, time: number): Point3D => {
    const rotateY = time * 0.0005;
    const rotateZ = time * 0.0003;

    const cosY = Math.cos(rotateY);
    const sinY = Math.sin(rotateY);
    const cosZ = Math.cos(rotateZ);
    const sinZ = Math.sin(rotateZ);

    const rotated = {
      x: point.x * cosY * cosZ - point.y * sinZ + point.z * sinY,
      y: point.x * sinZ + point.y * cosZ,
      z: -point.x * sinY * cosZ + point.z * cosY
    };

    const scale = 200 / (200 + rotated.z);
    return {
      x: rotated.x * scale,
      y: rotated.y * scale,
      z: rotated.z
    };
  };

  // Generate neural connections
  const generateConnections = (points: Point3D[]): [number, number][] => {
    const connections: [number, number][] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = Math.sqrt(
          Math.pow(points[i].x - points[j].x, 2) +
          Math.pow(points[i].y - points[j].y, 2) +
          Math.pow(points[i].z - points[j].z, 2)
        );
        if (dist < 50) {
          connections.push([i, j]);
        }
      }
    }
    return connections;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 16);
    }, 16);

    // Set initial animation to false after zoom completes
    const timeout = setTimeout(() => {
      setIsInitialAnimation(false);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const transformedPoints = brainPoints.map(p => transformPoint(p, time));
  const connections = generateConnections(brainPoints);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
      <div className={`w-[800px] h-[800px] relative ${isInitialAnimation ? 'brain-zoom' : ''}`}>
        <svg 
          viewBox="-100 -100 200 200" 
          className="w-full h-full"
        >
          {/* Neural connections */}
          {connections.map(([i, j], index) => {
            const p1 = transformedPoints[i];
            const p2 = transformedPoints[j];
            const depth = (p1.z + p2.z) / 2;
            const opacity = (depth + 100) / 200;
            
            return (
              <line
                key={`connection-${index}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#8B5CF6"
                strokeWidth="0.5"
                opacity={opacity * 0.5}
              />
            );
          })}

          {/* Electric paths */}
          {electricPaths.map((path, pathIndex) => {
            const transformedPath = path.map(p => transformPoint(p, time));
            const pathString = transformedPath
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
              .join(' ');

            return (
              <path
                key={`electric-${pathIndex}`}
                d={pathString}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2"
                className="electric-line"
                style={{
                  filter: 'drop-shadow(0 0 3px #4ADE80)',
                  animationDelay: `${pathIndex * 0.2}s`
                }}
              />
            );
          })}

          {/* Brain points */}
          {transformedPoints.map((point, index) => (
            <circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill="#8B5CF6"
              opacity={(point.z + 100) / 200}
              style={{
                filter: 'drop-shadow(0 0 2px #8B5CF6)'
              }}
            />
          ))}
        </svg>
        
        {/* Enhanced glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(74, 222, 128, 0.1) 50%, transparent 70%)',
            filter: 'blur(40px)',
            mixBlendMode: 'screen'
          }}
        />
      </div>
    </div>
  );
}

export default Complex3DLoader;
