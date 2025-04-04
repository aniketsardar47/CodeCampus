import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Button,
  Textarea,
  Heading,
  Text,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { useColorMode,useColorModeValue } from "@/components/ui/color-mode";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/tabs"
import { CiAlarmOn, CiAlarmOff } from "react-icons/ci";
import { useToast } from "@chakra-ui/toast";
import { MdTimer, MdTimerOff } from "react-icons/md";
import { FiMaximize, FiMinimize, FiPlay, FiSave, FiSun, FiMoon } from "react-icons/fi";
import MonacoEditor from "@monaco-editor/react";
import LanguageSelector from "./editor-pages/LanguageSelector";
import { CODE_SNIPPETS } from "./constants.jsx";
import Output from "./editor-pages/Output";
import { executeCode, submitCode } from "./api.jsx";
import ResultPanel from "./editor-pages/ResultPanel";

const MainEditor = () => {
  const { colorMode, toggleColorMode } = useColorMode();
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
  const toast = useToast();
  const [timerstatus, setTimerstatus] = useState(false);
  const [status, setStatus] = useState("run");

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const editorBg = useColorModeValue("white", "#1e1e1e");
  const panelBg = useColorModeValue("white", "gray.800");
  const buttonBg = useColorModeValue("gray.100", "gray.700");

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
    <Box bg={bgColor} minH="100vh" color={textColor} overflow="hidden" position="relative">
      <Flex direction="column" height={isFullScreen ? "100vh" : "calc(100vh - 60px)"}>
        {/* Top Bar */}
        <Flex 
          p={3} 
          bg={useColorModeValue("gray.800", "gray.900")} 
          color="white" 
          justify="space-between" 
          align="center"
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <Flex align="center">
            <Heading size="md" mr={4} color={useColorModeValue("blue.400", "blue.300")}>
              Code<span style={{ color: useColorModeValue("#4cc9f0", "#4cc9f0") }}>{'{'}</span>Campus<span style={{ color: useColorModeValue("#4cc9f0", "#4cc9f0") }}>{'}'}</span>
            </Heading>
          </Flex>
          <Flex align="center" gap={3}>
            <Text fontSize="sm" color={useColorModeValue("gray.300", "gray.400")}>
              {formatTime(seconds)}
            </Text>
            <IconButton
              icon={timerstatus ? <MdTimerOff /> : <MdTimer />}
              onClick={toggleTimer}
              aria-label="Toggle timer"
              variant="ghost"
              color={useColorModeValue("gray.300", "gray.400")}
              _hover={{ bg: "transparent", color: "white" }}
            />
            <IconButton
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              aria-label="Toggle theme"
              variant="ghost"
              color={useColorModeValue("gray.300", "gray.400")}
              _hover={{ bg: "transparent", color: "white" }}
            />
            <IconButton
              icon={isFullScreen ? <FiMinimize /> : <FiMaximize />}
              onClick={toggleFullScreen}
              aria-label="Toggle fullscreen"
              variant="ghost"
              color={useColorModeValue("gray.300", "gray.400")}
              _hover={{ bg: "transparent", color: "white" }}
            />
          </Flex>
        </Flex>

        <Flex flex="1" overflow="hidden">
          {!isFullScreen && (
            <Box 
              width="35%" 
              p={4} 
              borderRight="1px solid" 
              borderColor={borderColor}
              overflowY="auto" 
              bg={panelBg}
            >
              <Heading size="md" mb={4} color={useColorModeValue("blue.600", "blue.400")}>
                Problem Statement
              </Heading>
              <Text fontSize="md" mb={4} color={textColor}>
                You are given a Binary Tree of 'N' nodes with integer values. Find the LCA (Lowest Common Ancestor) of three nodes: N1, N2, and N3.
              </Text>
              <Box 
                bg={useColorModeValue("blue.50", "blue.900")}
                color={useColorModeValue("blue.800", "blue.200")}
                px={3} 
                py={1} 
                rounded="md" 
                display="inline-block" 
                mb={4}
                border="1px solid"
                borderColor={useColorModeValue("blue.200", "blue.800")}
              >
                Lab: JavaScript Basics
              </Box>
              <Textarea
                readOnly
                value={`For example: LCA of (7, 8, 10) is 1`}
                size="sm"
                height="70%"
                bg={useColorModeValue("gray.100", "gray.700")}
                color={textColor}
                border="none"
                fontSize="14px"
                resize="auto"
                _focus={{ boxShadow: "none" }}
              />
            </Box>
          )}

          <Box width={isFullScreen ? "100%" : "65%"} pt={2} display="flex" flexDirection="column">
            <Box position="relative" zIndex="dropdown">
              <Flex justify="space-between" align="center" mb={2} px={4}>
                <LanguageSelector language={language} onSelect={onSelect} colorMode={colorMode} />
                <Flex align="center" gap={2}>
                  <Button
                    leftIcon={<FiPlay />}
                    colorScheme="blue"
                    size="sm"
                    onClick={handleRunCode}
                    isLoading={isExecuting}
                    loadingText="Running"
                    variant="solid"
                  >
                    Run
                  </Button>
                  <Button
                    leftIcon={<FiSave />}
                    colorScheme="green"
                    size="sm"
                    onClick={handleSubmitCode}
                    isLoading={isSubmitting}
                    loadingText="Submitting"
                    variant="solid"
                  >
                    Submit
                  </Button>
                </Flex>
              </Flex>
            </Box>

            <Box flex="1" overflow="auto" mb={4} position="relative" zIndex="base" height="auto">
              <MonacoEditor
                height="100%"
                language={language}
                theme={colorMode === "light" ? "vs" : "vs-dark"}
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

            <Box flex="1" overflow="auto" borderTop="1px solid" borderColor={borderColor} p={2} bg={panelBg}>
              <ResultPanel 
                output={output}
                isError={isError}
                isLoading={isExecuting || isSubmitting}
                status={status}
                colorMode={colorMode}
              />
              <Tabs variant="enclosed" height="100%">
                <TabList>
                  <Tab _selected={{ color: "white", bg: useColorModeValue("blue.500", "blue.600") }}>
                    Console
                  </Tab>
                  <Tab _selected={{ color: "white", bg: useColorModeValue("blue.500", "blue.600") }}>
                    Test Results
                  </Tab>
                </TabList>
                <TabPanels height="calc(100% - 40px)" overflowY="auto">
                  <TabPanel p={0} height="100%">
                    <Output
                      output={output}
                      isError={isError}
                      isLoading={isExecuting}
                      colorMode={colorMode}
                    />
                  </TabPanel>
                  <TabPanel p={0} height="100%">
                    <Output
                      output={executionResult}
                      isError={isError}
                      isLoading={isSubmitting}
                      colorMode={colorMode}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default MainEditor;