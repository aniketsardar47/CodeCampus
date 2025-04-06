import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  IconButton,
  Spinner,
  Heading,
  Textarea,
  Toast,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/tabs';
import { CiAlarmOn, CiAlarmOff } from "react-icons/ci";
import { MdTimer, MdTimerOff, MdLightMode, MdDarkMode } from "react-icons/md";
import { FiMaximize, FiMinimize, FiPlay, FiSave } from "react-icons/fi";
import MonacoEditor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./navbar";
import LanguageSelector from "./editor-pages/LanguageSelector";
import { CODE_SNIPPETS } from "./constants.jsx";
import Output from "./editor-pages/Output";
import { executeCode, submitCode } from "./api.jsx";
import ResultPanel from "./editor-pages/ResultPanel";
import { showToast } from "./showToaster";
const MainEditor = () => {
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
  const [status, setStatus] = useState("run");
  const [activeTab, setActiveTab] = useState("console");
  const navigate = useNavigate();

  // Focus tracking functionality from second code
  const [focusChangeCount, setFocusChangeCount] = useState(0);
  const [isWarningShown, setIsWarningShown] = useState(false);
  const focusChangeLimit = 3;

  // Define theme colors from first code
  const currentTheme = {
    bg: darkMode ? "#1e1e1e" : "#ffffff",
    text: darkMode ? "#e0e0e0" : "#333333",
    border: darkMode ? "#3e3e42" : "#e1e1e1",
    problemBg: darkMode ? "#252526" : "#f8f9fa",
    tabSelected: darkMode ? "#3794ff" : "#0078d7",
    icon: darkMode ? "#e0e0e0" : "#333333",
    button: darkMode ? "#333333" : "#e1e1e1",
    buttonText: darkMode ? "#ffffff" : "#333333",
    buttonHover: darkMode ? "#3e3e42" : "#d1d1d1",
  };

  // Focus change detection from second code
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

  // Handle focus change count from second code
  useEffect(() => {
    if (focusChangeCount > 0 && focusChangeCount <= focusChangeLimit) {
      const remainingAttempts = focusChangeLimit - focusChangeCount;

      if (!isWarningShown) {
        showToast(
          "Warning",
          `Please stay focused! ${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining before you'll be redirected.`,
          "warning"
        );
        setIsWarningShown(true);

        const timer = setTimeout(() => setIsWarningShown(false), 5000);
        return () => clearTimeout(timer);
      }
    } else if (focusChangeCount > focusChangeLimit) {
      showToast("Redirecting", "You've exceeded the focus change limit", "error");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [focusChangeCount, focusChangeLimit, isWarningShown, navigate]);

  // Timer functionality from first code
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
    showToast("Theme", `Switched to ${!darkMode ? "dark" : "light"} mode`, "info");
  };

  const toggleTimer = () => {
    const action = isRunning ? "paused" : "started";
    setTimerstatus(!timerstatus);
    setIsRunning((prev) => !prev);
    showToast("Timer", `Timer ${action}`, "info");
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
    showToast("View", isFullScreen ? "Exited fullscreen" : "Entered fullscreen", "info");
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    editor.updateOptions({ contextmenu: false });
    showToast("Editor", "Editor ready", "success");
  };

  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setCode(CODE_SNIPPETS[selectedLanguage]);
    showToast("Language", `Switched to ${selectedLanguage}`, "success");
  };

  const handleRunCode = async () => {
    if (!editorRef.current) {
      showToast("Error", "Editor is not ready", "error");
      return;
    }

    setIsExecuting(true);
    setStatus("run");
    setOutput("Running code...");
    setIsError(false);
    setActiveTab("console");

    try {
      const sourceCode = editorRef.current.getValue();
      const result = await executeCode(language, sourceCode);

      if (result.stderr) {
        setIsError(true);
        setOutput(result.stderr);
        showToast("Execution Failed", "Code contains errors", "error");
      } else {
        setOutput(result.output || "Code executed successfully with no output");
        showToast("Success", "Code executed successfully", "success");
      }
    } catch (error) {
      setIsError(true);
      setOutput(`Error: ${error.message}`);
      showToast("Execution Error", error.message, "error");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!editorRef.current) {
      showToast("Error", "Editor is not ready", "error");
      return;
    }
    setStatus("submit");
    setIsSubmitting(true);
    setExecutionResult("Running tests...");
    setIsError(false);
    setActiveTab("results");

    try {
      const sourceCode = editorRef.current.getValue();
      const submission = await submitCode(language, sourceCode);

      if (!submission.success) {
        setIsError(true);
        setExecutionResult(submission.details || submission.message);
        showToast("Submission Failed", submission.message, "error");
      } else {
        setExecutionResult({
          summary: submission.message,
          details: submission.results,
          executionTime: submission.executionTime,
        });
        showToast(
          "Submission Successful",
          submission.message,
          submission.passed ? "success" : "warning"
        );
      }
    } catch (error) {
      setIsError(true);
      setExecutionResult(`Error: ${error.message}`);
      showToast("Submission Error", error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      bg={currentTheme.bg}
      color={currentTheme.text}
      minHeight="100vh"
      overflow="hidden"
      position="relative"
      fontFamily="'Inter', sans-serif"
    >
      <Navbar darkMode={darkMode} />
      <Flex
        direction="column"
        height={isFullScreen ? "100vh" : "calc(100vh - 80px)"}
      >
        <Flex flex={1} overflow="hidden">
          {!isFullScreen && (
            <Box
              width="35%"
              p={4}
              borderRight={`1px solid ${currentTheme.border}`}
              overflowY="auto"
              bg={currentTheme.problemBg}
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Sum of Infinite Array</Heading>
                <Text fontSize="sm" opacity={0.8}>
                  Moderate
                </Text>
              </Flex>

              <Box
                mb={4}
                p={3}
                bg={darkMode ? "#2a2a2a" : "#f8f9fa"}
                borderRadius="4px"
                borderLeft={`4px solid ${currentTheme.tabSelected}`}
              >
                <Text fontSize="sm" mb={2}>
                  <strong>Problem Statement:</strong> Given an array "A" of N integers and you have also defined the new array "B" as a concatenation of array "A" for an infinite number of times. For example, if the given array "A" is [1,2,3] then, infinite array "B" is [1,2,3,1,2,3,1,2,3,...].
                </Text>
                <Text fontSize="sm">
                  Your task is to find the sum of the subarray from index "L" to "R" (both inclusive) in the infinite array "B" for each query. Note: The value of the sum can be very large, return the answer as modulus 10^9+7.
                </Text>
              </Box>

              <Box mb={4}>
                <Heading size="sm" mb={2}>
                  Constraints:
                </Heading>
                <Box as="ul" fontSize="sm" pl={5} mb={4}>
                  <li>1 ≤ T ≤ 100</li>
                  <li>1 ≤ N ≤ 10^4</li>
                  <li>1 ≤ A[i] ≤ 10^9</li>
                  <li>1 ≤ Q ≤ 10^4</li>
                  <li>1 ≤ L ≤ R ≤ 10^18</li>
                </Box>
              </Box>

              <Box>
                <Heading size="sm" mb={2}>
                  Example:
                </Heading>
                <Box
                  bg={darkMode ? "#2a2a2a" : "#f8f9fa"}
                  p={3}
                  borderRadius="4px"
                  mb={2}
                >
                  <Text fontSize="sm" mb={1}>
                    <strong>Input:</strong> A = [1,2,3], Q = 2, queries = [[1,3], [4,6]]
                  </Text>
                  <Text fontSize="sm">
                    <strong>Output:</strong> [6, 6]
                  </Text>
                </Box>
              </Box>
            </Box>
          )}

          <Box width={isFullScreen ? "100%" : "65%"} display="flex" flexDirection="column">
            <Flex
              justify="space-between"
              align="center"
              mb={2}
              px={2}
              position="relative"
              zIndex={1000}
            >
              <Box position="relative" zIndex={1001}>
                <LanguageSelector language={language} onSelect={onSelect} darkMode={darkMode} />
              </Box>
              <Flex align="center" gap={2}>
                <IconButton
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  icon={darkMode ? <MdLightMode /> : <MdDarkMode />}
                  variant="ghost"
                  color={currentTheme.icon}
                  _hover={{ bg: currentTheme.buttonHover }}
                />
                <Button
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  leftIcon={<FiPlay />}
                  colorScheme="blue"
                  variant="solid"
                  isLoading={isExecuting}
                  loadingText="Running"
                >
                  Run
                </Button>
                <Button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting}
                  leftIcon={<FiSave />}
                  colorScheme="green"
                  variant="solid"
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                >
                  Submit
                </Button>
                <IconButton
                  onClick={toggleTimer}
                  aria-label={isRunning ? "Pause timer" : "Start timer"}
                  icon={!timerstatus ? <MdTimer /> : <MdTimerOff />}
                  variant="ghost"
                  color={currentTheme.icon}
                  _hover={{ bg: currentTheme.buttonHover }}
                />
                <Text fontSize="sm" minWidth="50px" textAlign="center">
                  {formatTime(seconds)}
                </Text>
                <IconButton
                  onClick={toggleFullScreen}
                  aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                  icon={isFullScreen ? <FiMinimize /> : <FiMaximize />}
                  variant="ghost"
                  color={currentTheme.icon}
                  _hover={{ bg: currentTheme.buttonHover }}
                />
              </Flex>
            </Flex>

            <Box flex={1} overflow="auto" mb={4} position="relative" zIndex="base" height="auto">
              <MonacoEditor
                height="100%"
                language={language}
                theme={darkMode ? "vs-dark" : "light"}
                value={code}
                onChange={handleEditorChange}
                onMount={onMount}
                options={{
                  selectOnLineNumbers: true,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  automaticLayout: true,
                  fontSize: 14,
                  contextmenu: false, // From second code
                }}
                loading={<Spinner color="blue.500" size="xl" />}
              />
            </Box>

            <Box flex={1} overflow="auto" borderTop="1px solid" borderColor={currentTheme.border} p={2}>
              <ResultPanel
                output={output}
                isError={isError}
                isLoading={isExecuting || isSubmitting}
                status={status}
              />
              <Tabs variant="enclosed" height="100%" index={activeTab === "console" ? 0 : 1} onChange={(index) => setActiveTab(index === 0 ? "console" : "results")}>
                <TabList>
                  <Tab>Console</Tab>
                  <Tab>Test Results</Tab>
                </TabList>
                <TabPanels height="calc(100% - 30px)" overflowY="auto">
                  <TabPanel p={0} height="100%">
                    <Output
                      output={output}
                      isError={isError}
                      isLoading={isExecuting}
                    />
                  </TabPanel>
                  <TabPanel p={0} height="100%">
                    <Output
                      output={executionResult}
                      isError={isError}
                      isLoading={isSubmitting}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        </Flex>
      </Flex>
      <ToastContainer />
    </Box>
  );
};

export default MainEditor;