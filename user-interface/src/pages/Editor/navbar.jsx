import React from 'react';
import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Box bg="gray.800" px={8} py={5} color="white">
      <Flex align="center">
        <Heading size="md">Code Editor</Heading>
        <Spacer />
        <Flex gap={4}>
          <Link to="/">
            <Button padding={2}
                    colorPalette="grey"
                    variant="outline" >Home</Button>
          </Link>
          <Button padding={2}
                  colorPalette="grey"
                  variant="outline">Sign Out</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
