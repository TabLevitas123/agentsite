import React, { useState, useEffect, useMemo } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

const Complex3DLoader = () => {
  const [time, setTime] = useState(0);
  const PHI = (1 + Math.sqrt(5)) / 2;

  // Generate vertices for multiple platonic solids
  const geometries = useMemo(() => {
    // Icosahedron vertices
    const icosahedron = [
      [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
      [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
      [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]
    ].map(([x, y, z]) => ({x, y, z}));

    // Octahedron vertices
    const octahedron = [
      [1, 0, 0], [-1, 0, 0], [0, 1, 0],
      [0, -1, 0], [0, 0, 1], [0, 0, -1]
    ].map(([x, y, z]) => ({x, y, z}));

    // Cube vertices
    const cube = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ].map(([x, y, z]) => ({x, y, z}));

    // Normalize and scale vertices
    const normalize = (vertices: Point3D[], scale = 80) => {
      return vertices.map(v => {
        const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return {
          x: (v.x / len) * scale,
          y: (v.y / len) * scale,
          z: (v.z / len) * scale
        };
      });
    };

    return {
      icosahedron: normalize(icosahedron),
      octahedron: normalize(octahedron),
      cube: normalize(cube)
    };
  }, []);

  // Interpolate between shapes
  const interpolateVertices = (time: number) => {
    const period = 6000; // Total cycle time in ms
    const t = (time % period) / period;
    
    let sourceVertices: Point3D[], targetVertices: Point3D[];
    let morphT = 0;

    if (t < 0.33) {
      sourceVertices = geometries.icosahedron;
      targetVertices = geometries.octahedron;
      morphT = (t * 3) % 1;
    } else if (t < 0.66) {
      sourceVertices = geometries.octahedron;
      targetVertices = geometries.cube;
      morphT = ((t - 0.33) * 3) % 1;
    } else {
      sourceVertices = geometries.cube;
      targetVertices = geometries.icosahedron;
      morphT = ((t - 0.66) * 3) % 1;
    }

    // Smooth easing function
    morphT = (1 - Math.cos(morphT * Math.PI)) / 2;

    // Interpolate vertices
    const maxVertices = Math.max(sourceVertices.length, targetVertices.length);
    const vertices: Point3D[] = [];

    for (let i = 0; i < maxVertices; i++) {
      const source = sourceVertices[i % sourceVertices.length];
      const target = targetVertices[i % targetVertices.length];
      vertices.push({
        x: source.x + (target.x - source.x) * morphT,
        y: source.y + (target.y - source.y) * morphT,
        z: source.z + (target.z - source.z) * morphT
      });
    }

    return vertices;
  };

  const transformPoint = (point: Point3D, time: number): Point3D => {
    const rotateX = time * 0.0007;
    const rotateY = time * 0.0005;
    const rotateZ = time * 0.0003;

    const cosX = Math.cos(rotateX);
    const sinX = Math.sin(rotateX);
    const cosY = Math.cos(rotateY);
    const sinY = Math.sin(rotateY);
    const cosZ = Math.cos(rotateZ);
    const sinZ = Math.sin(rotateZ);

    const rotated = {
      x: point.x * cosY * cosZ - point.y * cosY * sinZ + point.z * sinY,
      y: point.x * (sinX * sinY * cosZ + cosX * sinZ) + 
         point.y * (-sinX * sinY * sinZ + cosX * cosZ) - 
         point.z * sinX * cosY,
      z: point.x * (-cosX * sinY * cosZ + sinX * sinZ) + 
         point.y * (cosX * sinY * sinZ + sinX * cosZ) + 
         point.z * cosX * cosY
    };

    const scale = 200 / (200 + rotated.z);
    return {
      x: rotated.x * scale,
      y: rotated.y * scale,
      z: rotated.z
    };
  };

  // Generate dynamic edges
  const generateEdges = (vertices: Point3D[]) => {
    const edges: [number, number][] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dist = Math.sqrt(
          Math.pow(vertices[i].x - vertices[j].x, 2) +
          Math.pow(vertices[i].y - vertices[j].y, 2) +
          Math.pow(vertices[i].z - vertices[j].z, 2)
        );
        if (dist < 160) {
          edges.push([i, j]);
        }
      }
    }
    return edges;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 16);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Current vertices and transformed points
  const currentVertices = interpolateVertices(time);
  const transformedPoints = currentVertices.map(p => transformPoint(p, time));
  const edges = generateEdges(currentVertices);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="w-[400px] h-[400px] relative">
        <svg 
          viewBox="-150 -150 300 300" 
          className="w-full h-full"
          style={{ transform: 'translateY(-10%)' }}
        >
          {/* Inner connective lines */}
          {transformedPoints.map((point, i) => (
            transformedPoints.slice(i + 1).map((target, j) => {
              const dist = Math.sqrt(
                Math.pow(point.x - target.x, 2) + 
                Math.pow(point.y - target.y, 2)
              );
              if (dist < 100) {
                const opacity = (1 - dist / 100) * 0.3;
                return (
                  <line
                    key={`inner-${i}-${j}`}
                    x1={point.x}
                    y1={point.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#4ADE80"
                    strokeWidth="0.5"
                    opacity={opacity}
                  />
                );
              }
              return null;
            })
          ))}

          {/* Main structure edges */}
          {edges.map(([i, j], index) => {
            const p1 = transformedPoints[i];
            const p2 = transformedPoints[j];
            const depth = (p1.z + p2.z) / 2;
            const opacity = (depth + 100) / 200;
            
            return (
              <line
                key={`edge-${index}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={depth > 0 ? '#4ADE80' : '#8B5CF6'}
                strokeWidth="2"
                opacity={opacity}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 3px ${depth > 0 ? '#4ADE80' : '#8B5CF6'})`
                }}
              />
            );
          })}

          {/* Vertices */}
          {transformedPoints.map((point, index) => (
            <circle
              key={`vertex-${index}`}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={point.z > 0 ? '#4ADE80' : '#8B5CF6'}
              opacity={(point.z + 100) / 200}
              style={{
                filter: `drop-shadow(0 0 3px ${point.z > 0 ? '#4ADE80' : '#8B5CF6'})`
              }}
            />
          ))}
        </svg>
        
        {/* Enhanced glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(74, 222, 128, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)',
            filter: 'blur(40px)',
            mixBlendMode: 'screen'
          }}
        />
      </div>
    </div>
  );
};

export default Complex3DLoader;
