import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Textarea, Heading, Text, Select, IconButton } from "@chakra-ui/react";
import { FiClock, FiMaximize, FiMinimize } from "react-icons/fi";  // ✅ Timer & Full-Screen Icons
import MonacoEditor from "@monaco-editor/react";
import Navbar from "./Navbar";  // ✅ Import Navbar

const MainEditor = () => {
  const [code, setCode] = useState(`console.log('Hello, World!');`);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [hasRun, setHasRun] = useState(false);

  // Timer states
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Full-screen mode state
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const runCode = () => {
    try {
      if (code.trim() === "") {
        throw new Error("No code to run!");
      }

      const simulatedOutput = `Execution Successful!\nLanguage: ${language}`;
      setOutput(simulatedOutput);
      setHasRun(true);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setHasRun(false);
    }
  };

  const submitCode = () => {
    if (!hasRun) {
      alert("Please run the code before submitting!");
      return;
    }
    alert(`Submit Successful!`);
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  return (
    <Box
      bg="gray.900"
      minH="100vh"
      color="gray.300"
      overflow="hidden"
      position="relative"
    >
      {/* Navbar */}
      <Navbar />

      {/* Full-screen mode */}
      <Flex
        direction="column"
        height={isFullScreen ? "100vh" : "calc(100vh - 80px)"}
        position={isFullScreen ? "fixed" : "relative"}
        top={isFullScreen ? "0" : "auto"}
        left={isFullScreen ? "0" : "auto"}
        width={isFullScreen ? "100vw" : "auto"}
        zIndex={isFullScreen ? "9999" : "auto"}
        bg="gray.900"
      >
        <Flex flex="1" overflow="hidden">
          
          {/* Problem Statement (Hidden in Full-Screen Mode) */}
          {!isFullScreen && (
            <Box width="35%" p={4} borderRight="1px solid #2d2d2d" overflowY="auto">
              <Heading size="sm" mb={4}>Problem Statement</Heading>
              <Text fontSize="14px" mb={4}>
                You are given a Binary Tree of 'N' nodes with integer values. Find 
                the LCA (Lowest Common Ancestor) of three nodes: N1, N2, and N3.
              </Text>
              <Textarea
                isReadOnly
                value={`For example: LCA of (7, 8, 10) is 1`}
                size="sm"
                height="70%"
                bg="gray.800"
                color="white"
                border="none"
                fontSize="14px"
                resize="none"
              />
            </Box>
          )}

          {/* Code Editor and Output */}
          <Box width={isFullScreen ? "100%" : "65%"} p={4} display="flex" flexDirection="column">
            
            {/* Language Selector with Timer and Full-screen Button */}
            <Flex justify="space-between" align="center" mb={2}>
              <Flex align="center" gap={2}>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  width="200px"
                  bg="gray.800"
                  color="gray.300"
                  borderColor="gray.700"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                </Select>
              </Flex>

              {/* Timer and Full-screen Buttons */}
              <Flex align="center" gap={2}>
                {/* Timer with Clock Icon */}
                <IconButton
                  icon={<FiClock />}
                  aria-label="Timer"
                  onClick={toggleTimer}
                  colorScheme={isRunning ? "red" : "green"}
                  size="sm"
                />
                <Text fontSize="sm" color="gray.300">{formatTime(seconds)}</Text>

                {/* Full-screen Toggle Button */}
                <IconButton
                  icon={isFullScreen ? <FiMinimize /> : <FiMaximize />}
                  aria-label="Full-screen"
                  onClick={toggleFullScreen}
                  colorScheme="blue"
                  size="sm"
                />
              </Flex>
            </Flex>

            <Box flex="1" overflow="auto">
              <MonacoEditor
                height="400px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                options={{
                  selectOnLineNumbers: true,
                  minimap: { enabled: false },
                  wordWrap: "on",
                }}
              />
            </Box>

            {/* Execution Status Output */}
            <Box mt={4} p={2} bg="gray.800" color="gray.100" borderRadius="md" overflowY="auto" height="100px">
              <Text fontSize="sm" color={output.includes("Error") ? "red.400" : "green.400"}>
                {output || "Run the code to see the output..."}
              </Text>
            </Box>
          </Box>
        </Flex>

        {/* Sticky Footer with Buttons */}
        <Flex
          bg="gray.800"
          p={4}
          justify="center"
          align="center"
          boxShadow="md"
          position={isFullScreen ? "fixed" : "sticky"}
          bottom="0"
          zIndex="1000"
          gap={4}
          width="100%"
        >
          <Button colorScheme="green" px={6} onClick={runCode}>
            Run
          </Button>
          <Button colorScheme="orange" px={6} onClick={submitCode} isDisabled={!hasRun}>
            Submit
          </Button>
        </Flex>

      </Flex>
    </Box>
  );
};

export default MainEditor;
