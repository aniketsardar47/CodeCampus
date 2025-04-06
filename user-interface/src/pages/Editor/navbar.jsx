import React from 'react';
import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = ({ darkMode }) => {
  const bgColor = darkMode ? 'gray.800' : 'gray.100';
  const textColor = darkMode ? 'white' : 'gray.800';
  const buttonVariant = darkMode ? 'outline' : 'solid';
  const buttonColorScheme = darkMode ? 'gray' : 'blue';

  return (
    <Box bg={bgColor} px={8} py={5} color={textColor}>
      <Flex align="center">
        <Heading size="md" color={textColor}>Code Editor</Heading>
        <Spacer />
        <Flex gap={4}>
          <Link to="/">
            <Button
              padding={2}
              colorScheme={buttonColorScheme}
              variant={buttonVariant}
            >
              Home
            </Button>
          </Link>
          <Button
            padding={2}
            colorScheme={buttonColorScheme}
            variant={buttonVariant}
          >
            Sign Out
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
