import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Button,
  Textarea,
  Heading,
  Text,
  Spinner,


} from "@chakra-ui/react";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/tabs"

import { CiAlarmOn,CiAlarmOff } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import {showToast} from "./showToaster.jsx";
import { ToastContainer, toast } from 'react-toastify';
import { MdTimer,MdTimerOff  } from "react-icons/md";
import {  FiMaximize, FiMinimize, FiPlay, FiSave } from "react-icons/fi";
import MonacoEditor from "@monaco-editor/react";
import Navbar from "./navbar";
import LanguageSelector from "./editor-pages/LanguageSelector";
import { CODE_SNIPPETS } from "./constants.jsx";
import Output from "./editor-pages/Output";
import { executeCode, submitCode } from "./api.jsx";
import ResultPanel from "./editor-pages/ResultPanel";

const MainEditor = () => {
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


  // New state for focus tracking
  const [focusChangeCount, setFocusChangeCount] = useState(0);
  const [isWarningShown, setIsWarningShown] = useState(false);
  const focusChangeLimit = 3;
  const navigate = useNavigate(); // If using React Router

  // Focus change detection
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

  // Handle focus change count
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
        navigate("/"); // Using React Router
        // OR window.location.href = "/"; // If not using React Router
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

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
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
    setStatus("run")
    setOutput("Running code...");
    setIsError(false);

    try {
      const sourceCode = editorRef.current.getValue();
      const result = await executeCode(language, sourceCode);

      if (result.stderr) {
        setIsError(true);
        setOutput(result.stderr);
        showToast("Execution Failed", "Code contains errors", "error");
      } else {
        setOutput(result.output);
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
    setStatus("submit")
    setIsSubmitting(true);
    setExecutionResult("Running tests...");
    setIsError(false);

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
      <Box bg="gray.900" minH="100vh" color="gray.300" overflow="hidden" position="relative">
        <Navbar />
        <Flex direction="column" height={isFullScreen ? "100vh" : "calc(100vh - 80px)"}>
          <Flex flex="1" overflow="hidden">
            {!isFullScreen && (
                <Box width="35%" p={4} borderRight="1px solid #2d2d2d" overflowY="auto" >
                  <Heading size="sm" mb={4}>Problem Statement</Heading>
                  <Text fontSize="14px" mb={4}>
                    You are given a Binary Tree of 'N' nodes with integer values. Find the LCA (Lowest Common Ancestor) of three nodes: N1, N2, and N3.
                  </Text>
                  <Textarea
                      readOnly
                      value={`For example: LCA of (7, 8, 10) is 1`}
                      size="sm"
                      height="70%"
                      bg="gray.800"
                      color="white"
                      border="none"
                      fontSize="14px"
                      resize="auto"
                  />
                </Box>
            )}

            <Box width={isFullScreen ? "100%" : "65%"} pt={2} display="flex" flexDirection="column" >

              <Box position="relative" zIndex="dropdown" >
                <Flex justify="space-between" align="center" mb={2}>
                  <LanguageSelector language={language} onSelect={onSelect} />
                  <Flex align="center" gap={2}>
                    <Button
                        padding={2}
                        colorPalette="grey"
                        variant="outline"
                        leftIcon={<FiPlay />}
                        colorScheme="blue"
                        size="sm"
                        onClick={handleRunCode}
                        isLoading={isExecuting}
                        loadingText="Running"
                    >
                      Run
                    </Button>
                    <Button
                        padding={2}
                        colorPalette="grey"
                        variant="outline"
                        leftIcon={<FiSave />}
                        colorScheme="green"
                        size="sm"
                        onClick={handleSubmitCode}
                        isLoading={isSubmitting}
                        loadingText="Submitting"
                    >
                      Submit
                    </Button>

                    <Button
                        padding={2}
                        colorPalette="grey"
                        variant="outline"
                        className="bg-{#282828}"
                        size="sm"
                        onClick={toggleTimer}

                    >
                      {!timerstatus ? <MdTimer color={"white"} /> : <MdTimerOff  color={"white"}/>}
                    </Button>


                    <Text fontSize="sm" color="white">{formatTime(seconds)}</Text>
                    <Button
                        padding={2}
                        colorPalette="grey"
                        variant="outline"
                        aria-label="Full-screen"
                        onClick={toggleFullScreen}
                        colorScheme="gray"
                        size="sm"


                    >
                      {isFullScreen ? <FiMinimize /> : <FiMaximize />}
                    </Button>

                  </Flex>
                </Flex>
              </Box>

              <Box flex="1" overflow="auto"  mb={4} position="relative" zIndex="base" height="auto">
                <MonacoEditor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    onMount={onMount}
                    options={{
                      selectOnLineNumbers: true,
                      minimap: { enabled: false },
                      wordWrap: "on",
                      automaticLayout: true,
                      fontSize: 14,
                    }}


                    loading={<Spinner color="blue.500" size="xl" />}
                />
              </Box>

              <Box flex="1" overflow="auto" borderTop="1px white"  p={2}>
                <ResultPanel output={output}
                             isError={isError}
                             isLoading={isExecuting || isSubmitting}
                             status={status}
                />
                <Tabs variant="enclosed" height="100%">
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
        <ToastContainer position="bottom-left"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark" />
      </Box>

  );
};

export default MainEditor;