import { Box, Text, VStack, HStack, Badge } from "@chakra-ui/react";

const Output = ({ output, isError, isLoading }) => {
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!output || output === "No output to display") {
        return <Text color="gray.500">No output to display</Text>;
    }

    // Handle string output
    if (typeof output === 'string') {
        return (
            <Box
                whiteSpace="pre-wrap"
                fontFamily="monospace"
                color={isError ? "red.400" : "white"}
            >
                {output}
            </Box>
        );
    }

    // Handle test results object
    if (typeof output === 'object' && output.details) {
        return (
            <VStack align="stretch" spacing={4}>
                <Text fontWeight="bold" color={isError ? "red.400" : "green.400"}>
                    {output.summary}
                </Text>

                {output.details.map((test, index) => (
                    <Box
                        key={index}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={test.passed ? "green.500" : "red.500"}
                        bg="gray.800"
                    >
                        <HStack justify="space-between">
                            <Text fontWeight="bold">Test Case {index + 1}</Text>
                            <Badge colorScheme={test.passed ? "green" : "red"}>
                                {test.passed ? "PASSED" : "FAILED"}
                            </Badge>
                        </HStack>
                        <Text mt={2} fontSize="sm">
                            <Text as="span" fontWeight="bold">Input:</Text> {test.input}
                        </Text>
                        <Text fontSize="sm">
                            <Text as="span" fontWeight="bold">Expected:</Text> {test.expected}
                        </Text>
                        <Text fontSize="sm">
                            <Text as="span" fontWeight="bold">Actual:</Text> {test.actual}
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                            Time: {test.executionTime}
                        </Text>
                    </Box>
                ))}
            </VStack>
        );
    }

    // Fallback for any other output type
    return (
        <Box whiteSpace="pre-wrap" fontFamily="monospace">
            {JSON.stringify(output, null, 2)}
        </Box>
    );
};

export default Output;