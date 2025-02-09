import React, { useEffect, useRef } from "react";
import { initAnimation } from "./animation";
import { Helmet } from "react-helmet-async"; 
import "../login/Login.css"; // Ensure styles are applied
import Form from "./Logbox";

const AnimatedBackground = ({ children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cleanup = initAnimation(canvasRef);
    return cleanup; // Remove event listeners when component unmounts
  }, []);

  return (
    <>
      <Helmet>
        <title>CodeCampus</title>
      </Helmet>

      {/* Background Container */}
      <div id="large-header" className="large-header relative w-full h-screen">
        <div className="hover-area"></div>
        <canvas ref={canvasRef} id="demo-canvas"></canvas>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-start z-10">
          <Form/>
          
          {/* Render children inside AnimatedBackground */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </>
  );
};

export default AnimatedBackground;
