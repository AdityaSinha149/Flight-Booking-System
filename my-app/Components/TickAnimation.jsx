import React from 'react';

export default function TickAnimation() {
  return (
    <div className="tick-animation-container">
      <div className="checkmark-circle">
        <div className="checkmark-circle-bg"></div>
        <div className="checkmark-check"></div>
      </div>
      <style jsx>{`
        .tick-animation-container {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          z-index: 0;
        }
        
        .checkmark-circle {
          width: 300px;
          height: 300px;
          position: relative;
          display: inline-block;
          vertical-align: top;
          margin: auto;
        }
        
        .checkmark-circle-bg {
          border-radius: 50%;
          position: absolute;
          width: 300px;
          height: 300px;
          background-color: #605DEC;
          animation: circle-fill-animation 0.4s ease-in-out;
          opacity: 0.15;
        }
        
        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: stroke-animation 1s cubic-bezier(0.65, 0, 0.45, 1) forwards 0.2s;
        }
        
        .checkmark-check:before {
          content: '';
          width: 100px;
          height: 50px;
          border-right: 20px solid white;
          border-top: 20px solid white;
          position: absolute;
          top: 125px;
          left: 200px;
          transform: rotate(135deg);
          transform-origin: left top;
          animation: check-animation 0.8s ease-in-out forwards 0.4s;
          opacity: 0;
        }
        
        @keyframes circle-fill-animation {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0.15;
          }
        }
        
        @keyframes check-animation {
          0% {
            opacity: 0;
            transform: rotate(135deg) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: rotate(135deg) scale(1);
          }
        }
        
        @keyframes stroke-animation {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
