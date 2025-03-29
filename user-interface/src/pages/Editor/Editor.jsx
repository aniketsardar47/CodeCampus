import React, {useEffect, useState} from 'react'
import {Box, Button, Flex, Heading, IconButton, Select, Text, Textarea} from "@chakra-ui/react";
import Navbar from "@/pages/Editor/navbar.jsx";
import {FiClock, FiMaximize, FiMinimize} from "react-icons/fi";
import MonacoEditor from "@monaco-editor/react";
import Submit from "@/pages/Editor/Submit.jsx";

export default function Editor() {
    const [code, setCode] = useState(`console.log('Hello, World!');`);
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState("");

    // Timer states
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
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
            <Navbar />

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
                    {!isFullScreen && (
                        <Box width="35%" p={4} borderRight="1px solid #2d2d2d" overflowY="auto">
                            <Heading size="sm" mb={4}>Problem Statement</Heading>
                            <Text fontSize="14px" mb={4}>
                                You are given a Binary Tree of 'N' nodes with integer values. Find
                                the LCA (Lowest Common Ancestor) of three nodes: N1, N2, and N3.
                            </Text>
                            <Textarea
                                readOnly  // Changed from isReadOnly to readOnly
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

                    <Box width={isFullScreen ? "100%" : "65%"} p={4} display="flex" flexDirection="column">
                        <Flex justify="space-between" align="center" mb={2}>
                            <Flex align="center" gap={2}>
                                {/*<Select*/}
                                {/*    value={language}*/}
                                {/*    onChange={handleLanguageChange}*/}
                                {/*    width="200px"*/}
                                {/*    bg="gray.800"*/}
                                {/*    color="gray.300"*/}
                                {/*    borderColor="gray.700"*/}
                                {/*>*/}
                                {/*    <option value="javascript">JavaScript</option>*/}
                                {/*    <option value="python">Python</option>*/}
                                {/*    <option value="java">Java</option>*/}
                                {/*    <option value="cpp">C++</option>*/}
                                {/*    <option value="c">C</option>*/}
                                {/*</Select>*/}
                            </Flex>

                            <Flex align="center" gap={2}>
                                <IconButton
                                    icon={<FiClock />}
                                    aria-label="Timer"
                                    onClick={toggleTimer}
                                    colorScheme={isRunning ? "red" : "green"}
                                    size="sm"
                                />
                                <Text fontSize="sm" color="gray.300">{formatTime(seconds)}</Text>

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

                        <Box mt={4} p={2} bg="gray.800" color="gray.100" borderRadius="md" overflowY="auto" height="100px">
                            <Text fontSize="sm" color={output.includes("Error") ? "red.400" : "green.400"}>
                                {output || "Run the code to see the output..."}
                            </Text>
                        </Box>

                        {/* Fixed Submit component rendering */}
                        {Submit && <Submit />}
                    </Box>
                </Flex>

                <Flex
                    bg="gray.800"
                    p={4}
                    justify="center"
                    align="center"
                    boxShadow="md"
                    bottom="0"
                    zIndex="1000"
                    gap={4}
                    width="100%"
                >
                    <Button colorScheme="green" px={6}>
                        Run
                    </Button>
                </Flex>
            </Flex>
        </Box>
    )
}