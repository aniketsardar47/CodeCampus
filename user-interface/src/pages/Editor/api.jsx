import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants.jsx";

const Api = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

export const executeCode = async (language, sourceCode, input = "") => {
  try {
    if (!LANGUAGE_VERSIONS[language]) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const response = await Api.post("/execute", {
      language,
      version: LANGUAGE_VERSIONS[language],
      files: [{ content: sourceCode }],
      stdin: input,
      args: [],
      compile_timeout: 5000,
      run_timeout: 5000,
    });

    return {
      success: true,
      output: response.data.run.output,
      stderr: response.data.run.stderr,
      executionTime: response.data.run.time * 1000,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stderr: error.message,
    };
  }
};

export const submitCode = async (language, sourceCode, problemId = "1") => {
  try {
    const executionResult = await executeCode(language, sourceCode);

    if (!executionResult.success || executionResult.stderr) {
      return {
        success: false,
        message: "Code execution failed",
        details: executionResult.stderr,
        executionTime: executionResult.executionTime,
      };
    }

    // Mock test cases
    const testCases = [
      { input: "1\n2\n3", expected: "6" },
      { input: "5\n5\n5", expected: "15" },
    ];

    const testResults = await Promise.all(
        testCases.map(async (testCase) => {
          const testResult = await executeCode(language, sourceCode, testCase.input);
          return {
            input: testCase.input,
            expected: testCase.expected,
            actual: testResult.output.trim(),
            passed: testResult.output.trim() === testCase.expected,
            executionTime: testResult.executionTime,
          };
        })
    );


    const passedTests = testResults.filter(test => test.passed).length;

    return {
      success: true,
      passed: passedTests === testCases.length,
      passedTests,
      totalTests: testCases.length,
      message: passedTests === testCases.length
          ? "All test cases passed!"
          : `${passedTests}/${testCases.length} test cases passed`,
      results: testResults,
      executionTime: executionResult.executionTime,
    };
  } catch (error) {
    return {
      success: false,
      message: "Submission failed",
      details: error.message,
    };
  }
};