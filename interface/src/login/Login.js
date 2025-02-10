import React from "react";
import "./Login.css"; 
import AnimatedBackground from "./AnimatedBackground";
import Header from "./Header"

function Login() {
  return (
    <AnimatedBackground>
      {/* Transparent Header on Animated Background */}
      <Header />

      {/* Main Content (Below Transparent Header) */}
      <div>
        Login Page Content Here
      </div>
    </AnimatedBackground>
  );
}

export default Login;

