import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Box, Text, Code, Spinner } from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster";

const Submit = ({ code, onResponse }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setOutput(null);

    try {
      let language = "python"; // Default language
      if (code.includes("public class") || code.includes("System.out.println")) {
        language = "java";
      } else if (code.includes("#include") || code.includes("using namespace")) {
        language = "cpp";
      }

      const response = await fetch('https://ebac-106-211-117-209.ngrok-free.app/api/v2/execute', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          language: "python",
          version: "3.12.0",
          files: [{
            name: "script.py",
            content: "print('Hello, World!')"
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setOutput(data);
      if (onResponse) {
        onResponse(data);
      }
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Box>
        <Button
            colorScheme="orange"
            px={6}
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Executing..."
            disabled={isLoading}
        >
          Submit
        </Button>

        {output && (
            <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Execution Output:</Text>
              <Code display="block" whiteSpace="pre-wrap" p={2} mt={2}>
                {output.run?.output || "No output"}
              </Code>

              {output.run?.stderr && (
                  <>
                    <Text fontWeight="bold" mt={4}>
                      Errors:
                    </Text>
                    <Code display="block" whiteSpace="pre-wrap" p={2} mt={2} colorScheme="red">
                      {output.run.stderr}
                    </Code>
                  </>
              )}
            </Box>
        )}

        {isLoading && !output && (
            <Box mt={4} textAlign="center">
              <Spinner size="xl" />
              <Text mt={2}>Executing your code...</Text>
            </Box>
        )}
      </Box>
  );
};

Submit.propTypes = {
  code: PropTypes.string.isRequired,
  onResponse: PropTypes.func,
};

export default Submit;
