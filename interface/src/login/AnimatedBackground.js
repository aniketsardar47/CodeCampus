import React, { useEffect, useRef } from "react";
import { initAnimation } from "./animation";
import "../login/Login.css"; // Ensure styles are applied

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cleanup = initAnimation(canvasRef);
    return cleanup; // Remove event listeners when component unmounts
  }, []);

  return (
    <div id="large-header" className="large-header">
      <div className="hover-area"></div>
      <canvas ref={canvasRef} id="demo-canvas"></canvas>
      <h1 className="main-title">
        Crow777 Radio <span className="thin">Belief is the enemy of knowing.</span>
      </h1>
    </div>
  );
};

export default AnimatedBackground;
