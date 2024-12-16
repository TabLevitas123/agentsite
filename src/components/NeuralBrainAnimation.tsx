import React from 'react';

const NeuralBrainAnimation = () => {
  const generateBranches = (startX: number, startY: number, angle: number, depth: number) => {
    if (depth <= 0) return null;
    
    const length = 30 / (depth * 0.5);
    const endX = startX + length * Math.cos(angle);
    const endY = startY + length * Math.sin(angle);
    
    return (
      <g className={`branch depth-${depth}`}>
        <path
          d={`M ${startX} ${startY} L ${endX} ${endY}`}
          className="neural-path"
          strokeWidth={0.5 + (1 / depth)}
        />
        <circle 
          cx={endX} 
          cy={endY} 
          r={1 + (1 / depth)} 
          className="neural-node"
        />
        {depth > 1 && (
          <>
            {generateBranches(endX, endY, angle - 0.5, depth - 1)}
            {generateBranches(endX, endY, angle + 0.5, depth - 1)}
          </>
        )}
      </g>
    );
  };

  return (
    <div className="w-full h-96 bg-gray-900">
      <svg
        className="w-full h-full"
        viewBox="0 0 400 300"
      >
        <defs>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#a855f7" />
          </radialGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <style>
            {`
              @keyframes morphSequence {
                0%, 100% { transform: rotate(0deg) scale(1); }
                20% { transform: rotate(180deg) scale(0.2); }
                30% { transform: rotate(360deg) scale(0.1); }
                50% { transform: rotate(540deg) scale(0.2); }
                70% { transform: rotate(720deg) scale(1.2); }
                80% { transform: rotate(900deg) scale(1); }
              }

              @keyframes pathPulse {
                0%, 100% { stroke-opacity: 0.3; }
                50% { stroke-opacity: 0.8; }
              }
              
              @keyframes nodePulse {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.5); }
              }

              @keyframes branchMorph {
                0%, 100% { transform: rotate(0deg) translateX(0); }
                25% { transform: rotate(90deg) translateX(10px); }
                50% { transform: rotate(180deg) translateX(-10px); }
                75% { transform: rotate(270deg) translateX(10px); }
              }
              
              @keyframes pathGrow {
                0% { stroke-dashoffset: 1000; }
                100% { stroke-dashoffset: 0; }
              }

              .neural-container {
                animation: morphSequence 15s infinite ease-in-out;
                transform-origin: center;
              }
              
              .neural-path {
                stroke: url(#nodeGradient);
                fill: none;
                stroke-dasharray: 1000;
                animation: 
                  pathPulse 3s infinite ease-in-out,
                  pathGrow 5s infinite linear;
                filter: url(#glow);
              }
              
              .neural-node {
                fill: url(#nodeGradient);
                filter: url(#glow);
                animation: nodePulse 2s infinite ease-in-out;
                transform-origin: center;
              }
              
              .branch {
                transform-origin: center;
                animation: branchMorph 10s infinite ease-in-out;
              }
              
              .depth-1 { animation-delay: 0s; }
              .depth-2 { animation-delay: 0.2s; }
              .depth-3 { animation-delay: 0.4s; }
              .depth-4 { animation-delay: 0.6s; }

              .branch-container {
                transform-origin: center;
              }

              .branch-container:nth-child(odd) {
                animation: branchMorph 10s infinite ease-in-out;
              }

              .branch-container:nth-child(even) {
                animation: branchMorph 10s infinite ease-in-out reverse;
              }
            `}
          </style>
        </defs>

        {/* Morphing neural network */}
        <g className="neural-container">
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 8;
            const startX = 200 + 50 * Math.cos(angle);
            const startY = 150 + 50 * Math.sin(angle);
            return (
              <g key={i} className="branch-container">
                {generateBranches(startX, startY, angle, 4)}
              </g>
            );
          })}
        </g>

        {/* Central core */}
        <circle
          cx="200"
          cy="150"
          r="20"
          className="neural-node"
          style={{ 
            animation: 'nodePulse 4s infinite ease-in-out',
            transformOrigin: 'center'
          }}
        />
      </svg>
    </div>
  );
};

export default NeuralBrainAnimation;
