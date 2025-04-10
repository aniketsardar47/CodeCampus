import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MonacoEditor from "@monaco-editor/react";
import { MdTimer, MdTimerOff, MdLightMode, MdDarkMode } from "react-icons/md";
import { FiMaximize, FiMinimize, FiPlay, FiSave } from "react-icons/fi";
import Navbar from "./navbar";
import { CODE_SNIPPETS } from "./constants.jsx";
import { executeCode, submitCode } from "./api.jsx";
import ResultPanel from "./editor-pages/ResultPanel";
import { useParams } from "react-router-dom";
import { showToast } from "./showToaster";
import { getSubmission, submitAssignment, updateLock } from "@/api/user";
import Loader from "@/components/Loader";
import { Center, Container } from "@chakra-ui/react";

const MainEditor = () => {

  const token = localStorage.getItem('token');
  let { submissionId } = useParams();
  submissionId = submissionId.replace(':','');
  console.log(submissionId)

  const [details,setDetails] = useState(); //assignment,submission,user data
  const [dataLoad,setDataLoad] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const editorRef = useRef();
  const [code, setCode] = useState(CODE_SNIPPETS["javascript"]);
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [output, setOutput] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerstatus, setTimerstatus] = useState(false);
  const [activeTab, setActiveTab] = useState("console");
  const [userInput, setUserInput] = useState("");

  const navigate = useNavigate();
  const [focusChangeCount, setFocusChangeCount] = useState(0);
  const [isWarningShown, setIsWarningShown] = useState(false);
  const focusChangeLimit = 50;

  const theme = {
    light: {
      bg: '#f5f5f5',
      text: '#262626',
      panelBg: '#ffffff',
      border: '#e5e7eb',
      button: '#f3f4f6',
      buttonHover: '#e5e7eb',
      buttonText: '#374151',
      editorBg: '#ffffff',
      tabSelected: '#4361ee',
      tabUnselected: '#f3f4f6',
      icon: '#4b5563',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      outputBg: '#ffffff',
      consoleHeader: '#f9fafb',
      consoleText: '#1f2937',
      consoleBorder: '#e5e7eb',
      problemBg: '#ffffff',
      problemText: '#374151',
      problemBorder: '#e5e7eb'
    },
    dark: {
      bg: '#1e1e1e',
      text: '#e5e5e5',
      panelBg: '#252526',
      border: '#3e3e42',
      button: '#2d2d30',
      buttonHover: '#3e3e40',
      buttonText: '#ffffff',
      editorBg: '#1e1e1e',
      tabSelected: '#4361ee',
      tabUnselected: '#2d30',
      icon: '#ffffff',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FFA000',
      outputBg: '#1e1e1e',
      consoleHeader: '#252526',
      consoleText: '#e5e5e5',
      consoleBorder: '#3e3e42',
      problemBg: '#252526',
      problemText: '#e5e5e5',
      problemBorder: '#3e3e42'
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  useEffect(()=>{
    const getDetails = async () => {
      const res = await getSubmission(token,submissionId);
      setDetails(res.data);
    }

    getDetails();
  },[token,submissionId]);

  useEffect(()=>{
    if(details != undefined){
      setDataLoad(false);
    }
  })

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setFocusChangeCount(prev => prev + 1);
      }
    };

    const handleBlur = () => {
      setFocusChangeCount(prev => prev + 1);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (focusChangeCount > 0 && focusChangeCount <= focusChangeLimit) {
      const remainingAttempts = focusChangeLimit - focusChangeCount;

      if (!isWarningShown) {
        showToast(
          "Warning",
          `Please stay focused! ${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining before you'll be redirected.`,
          "warning"
        );
        // setIsWarningShown(true);

        const timer = setTimeout(() => setIsWarningShown(false), 5000);
        return () => clearTimeout(timer);
      }
    } else if (focusChangeCount > focusChangeLimit) {
      async () => {
        await updateLock(token,{submissionId:submissionId,key:true});
      }
      showToast("Redirecting", "You've exceeded the focus change limit", "error");
      setTimeout(() => {
        navigate("/student");
      }, 2000);
    }
  }, [focusChangeCount, focusChangeLimit, isWarningShown, navigate]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    showToast(`Switched to ${!darkMode ? 'dark' : 'light'} mode`);
  };

  const toggleTimer = () => {
    const action = isRunning ? "paused" : "started";
    setTimerstatus(!timerstatus);
    setIsRunning((prev) => !prev);
    showToast(`Timer ${action}`);
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
    showToast(isFullScreen ? "Exited fullscreen" : "Entered fullscreen");
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    editor.updateOptions({ contextmenu: false });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      showToast("Error: ","Copy is not ALLOWED!!!!","error");
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      showToast("Error: ","Pasting is not ALLOWED!!!!","error");
    });
    showToast("Editor", "Editor ready", "success");
  };

  
  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setCode(CODE_SNIPPETS[selectedLanguage]);
    showToast(`Switched to ${selectedLanguage}`);
  };

  const handleRunCode = async () => {
    if (!editorRef.current) {
      showToast("Editor is not ready", true);
      return;
    }

    setIsExecuting(true);
    setOutput(null);
    setIsError(false);
    setActiveTab("console");

    try {
      const sourceCode = editorRef.current.getValue();
      const result = await executeCode(language, sourceCode, userInput); // Pass userInput to executeCode

      if (result.stderr) {
        setIsError(true);
        setOutput(result.stderr);
        showToast("Code contains errors", true);
      } else {
        setOutput(result.output || "Code executed successfully with no output");
        showToast("Code executed successfully");
      }
    } catch (error) {
      setIsError(true);
      setOutput(`Error: ${error.message}`);
      showToast(error.message, true);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!editorRef.current) {
      showToast("Editor is not ready", true);
      return;
    }
    setIsSubmitting(true);
    setIsError(false);
    setActiveTab("results");

    try {
      const sourceCode = editorRef.current.getValue();
      console.log(sourceCode)
      console.log(output)
      await submitAssignment(token,{id:submissionId,source:sourceCode,result:output});
      showToast("Success","Assignment Submitted successfully!",'success');
    } catch (error) {
      setIsError(true);
      setExecutionResult(`Error: ${error.message}`);
      showToast(error.message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    dataLoad 
    ? 
    <Container fluid alignContent={'center'} bgColor={'white'} h={'100vh'}>
      <Center><Loader/></Center>
    </Container>
    :
    <div style={{
      backgroundColor: currentTheme.bg,
      color: currentTheme.text,
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Inter', sans-serif"
    }}>
      <Navbar darkMode={darkMode} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: isFullScreen ? '100vh' : 'calc(100vh - 80px)'
      }}>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {!isFullScreen && (
            <div style={{
              width: '35%',
              padding: '1rem',
              borderRight: `1px solid ${currentTheme.border}`,
              overflowY: 'auto',
              backgroundColor: currentTheme.problemBg
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: currentTheme.text
                }}>{details.assignment.title}</h2>
                <span style={{
                  fontSize: '0.875rem',
                  color: currentTheme.text,
                  opacity: 0.8
                }}>{/*Moderate*/}</span>
              </div>

              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: darkMode ? '#2a2a2a' : '#f8f9fa',
                borderRadius: '4px',
                borderLeft: `4px solid ${currentTheme.tabSelected}`
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: currentTheme.text,
                  marginBottom: '0.5rem'
                }}>
                  <strong>Problem Statement:</strong> {details.assignment.description}
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: currentTheme.text,
                  marginBottom: '0.5rem'
                }}>Constraints:</h3>
                <ul style={{
                  fontSize: '0.875rem',
                  color: currentTheme.text,
                  paddingLeft: '1.25rem',
                  marginBottom: '1rem'
                }}>
                  {details.assignment.constraints}
                </ul>
              </div>

              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: currentTheme.text,
                  marginBottom: '0.5rem'
                }}>Example:</h3>
                <div style={{
                  backgroundColor: darkMode ? '#2a2a2a' : '#f8f9fa',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  marginBottom: '0.5rem'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: currentTheme.text,
                    marginBottom: '0.25rem'
                  }}>
                     {details.assignment.example}
                  </p>
                  { /*<p style={{
                    fontSize: '0.875rem',
                    color: currentTheme.text
                  }}>
                    <strong>Output:</strong> [6, 6]
                  </p>*/}
                </div>
              </div>
            </div>
          )}

          <div style={{
            width: isFullScreen ? '100%' : '65%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
              padding: '0 0.5rem',
              position: 'relative',
              zIndex: 1000
            }}>
              <div style={{
                position: 'relative',
                zIndex: 1001,
              }}>
                <select
                  value={language}
                  onChange={(e) => onSelect(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    backgroundColor: darkMode ? '#252526' : '#ffffff',
                    color: darkMode ? '#e0e0e0' : '#333333',
                    border: darkMode ? '1px solid #3e3e42' : '1px solid #cccccc',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                    boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                    outline: 'none',
                    minWidth: '180px'
                  }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                
                </select>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <button
                  onClick={toggleTheme}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: currentTheme.icon,
                    fontSize: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  aria-label="Toggle theme"
                >
                  {darkMode ? <MdLightMode /> : <MdDarkMode />}
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  style={{
                    backgroundColor: currentTheme.button,
                    color: currentTheme.buttonText,
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'background-color 0.2s',
                    opacity: isExecuting ? 0.7 : 1,
                    pointerEvents: isExecuting ? 'none' : 'auto'
                  }}
                >
                  <FiPlay />
                  {isExecuting ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: currentTheme.button,
                    color: currentTheme.buttonText,
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'background-color 0.2s',
                    opacity: isSubmitting ? 0.7 : 1,
                    pointerEvents: isSubmitting ? 'none' : 'auto'
                  }}
                >
                  <FiSave />
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={toggleFullScreen}
                  style={{
                    backgroundColor: currentTheme.button,
                    color: currentTheme.buttonText,
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background-color 0.2s'
                  }}
                  aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullScreen ? <FiMinimize /> : <FiMaximize />}
                </button>
              </div>
            </div>

            <div style={{
              flex: 1,
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1
            }}>
              <MonacoEditor
                height="100%"
                language={language}
                theme={darkMode ? 'vs-dark' : 'vs'}
                value={code}
                onChange={handleEditorChange}
                onMount={onMount}
                options={{
                  selectOnLineNumbers: true,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  automaticLayout: true,
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  renderWhitespace: 'none',
                  padding: { top: 10 },
                  lineNumbersMinChars: 3,
                  fixedOverflowWidgets: true,
                }}
              />
            </div>

            {/* Console/Results panel */}
            <div style={{
              height: '30%',
              minHeight: '30%',
              borderTop: `1px solid ${currentTheme.border}`,
              backgroundColor: currentTheme.panelBg,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                borderBottom: `1px solid ${currentTheme.border}`,
                backgroundColor: currentTheme.consoleHeader
              }}>
                <button
                  onClick={() => setActiveTab("console")}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: activeTab === "console" ? currentTheme.tabSelected : currentTheme.tabUnselected,
                    color: activeTab === "console" ? (darkMode ? '#000000' : '#ffffff') : currentTheme.text,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  Console
                </button>
                <button
                  onClick={() => setActiveTab("results")}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: activeTab === "results" ? currentTheme.tabSelected : currentTheme.tabUnselected,
                    color: activeTab === "results" ? (darkMode ? '#000000' : '#ffffff') : currentTheme.text,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  Test Results
                </button>
              </div>
              {activeTab === "console" ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0.75rem',
                    backgroundColor: currentTheme.outputBg,
                    fontFamily: "'Roboto Mono', monospace",
                    whiteSpace: 'pre-wrap',
                    color: darkMode ? '#e0e0e0' : '#1a1a1a'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      color: currentTheme.text
                    }}>
                      Input (for stdin):
                    </div>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '60px',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: `1px solid ${currentTheme.border}`,
                        backgroundColor: currentTheme.editorBg,
                        color: currentTheme.text,
                        fontFamily: "'Roboto Mono', monospace",
                        resize: 'vertical'
                      }}
                      placeholder="Enter input for your program (if needed)"
                    />
                    {isExecuting ? (
                      <div>Running code...</div>
                    ) : output ? (
                      <div style={{
                        color: isError ? (darkMode ? '#ff6b6b' : '#d32f2f') : 'inherit'
                      }}>
                        {output}
                      </div>
                    ) : (
                      <div style={{ opacity: 0.7 }}>
                        Click "Run" to execute your code
                      </div>
                    )}
                  </div>
                  <div style={{
                    borderTop: `1px solid ${currentTheme.border}`,
                    padding: '0.5rem',
                    backgroundColor: currentTheme.panelBg
                  }}>
                    
                  </div>
                </div>
              ) : (
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '0.75rem',
                  backgroundColor: currentTheme.outputBg
                }}>
                  <ResultPanel
                    result={executionResult}
                    isError={isError}
                    isLoading={isSubmitting}
                    darkMode={darkMode}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>

  );
};

export default MainEditor;