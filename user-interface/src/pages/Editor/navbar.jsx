import React from 'react';
import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Box bg="gray.800" px={8} py={4} color="white">
      <Flex align="center">
        <Heading size="md">Code Editor</Heading>
        <Spacer />
        <Flex gap={4}>
          <Link to="/">
            <Button colorScheme="teal" size="sm">Editor</Button>
          </Link>
          <Button colorScheme="red" size="sm">Sign Out</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
