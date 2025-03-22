import React, { useState } from "react";
import { Box, Flex, Button, Textarea, Heading, Text, Select, Textarea as CodeOutput } from "@chakra-ui/react";
import MonacoEditor from "@monaco-editor/react";
import Navbar from "./Navbar";  // ✅ Import the Navbar

const MainEditor = () => {
  const [code, setCode] = useState(`console.log('Hello, World!');`);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [hasRun, setHasRun] = useState(false);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Simulated code execution function
  const runCode = () => {
    try {
      // Simulate execution status
      if (code.trim() === "") {
        throw new Error("No code to run!");
      }

      // Mock execution output
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

  return (
    <Box bg="gray.900" minH="100vh" color="gray.300" overflow="hidden">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content with sticky footer */}
      <Flex direction="column" height="calc(100vh - 80px)">
        
        <Flex flex="1" overflow="hidden">
          
          {/* Left Side: Problem Statement */}
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

          {/* Right Side: Code Editor */}
          <Box width="65%" p={4} display="flex" flexDirection="column">
            
            {/* Language Selector */}
            <Flex justify="space-between" mb={2}>
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
          position="sticky"
          bottom="0"
          zIndex="1000"
          gap={4}
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
