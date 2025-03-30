import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <div className="logo">
            <span className="code">Code</span>
            <span className="curly">{'{'}</span>
            <span className="campus">Campus</span>
            <span className="curly">{'}'}</span>
          </div>
          <button className="login-btn" onClick={handleLogin}>
            Log In
          </button>
        </div>
      </header>

      <main className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Revolutionize Coding Education</h1>
            <p className="subtitle">
              The all-in-one platform for teachers to assign coding tasks and for students to 
              solve them in an integrated environment with progress tracking.
            </p>
            <div className="cta-buttons">
              <button className="primary-btn" onClick={handleLogin}>
                Get Started
              </button>
              <button className="secondary-btn">
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="code-editor-preview">
              <div className="editor-header">
                <div className="window-controls">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="file-name">assignment.js</div>
              </div>
              <div className="editor-content">
                <pre><code>{`function sumArray(arr) {
  // Student's code will appear here
  return arr.reduce((a, b) => a + b, 0);
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="features">
        <div className="container">
          <h2>Why Choose Code {`{Campus}`}?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Integrated Coding Environment</h3>
              <p>Students can solve assignments right in the browser with syntax highlighting and auto-completion.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Teachers can monitor student progress and view submission history for each assignment.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Assignment Management</h3>
              <p>Easily create, organize, and grade coding assignments with deadlines and requirements.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Code {`{Campus}`}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;