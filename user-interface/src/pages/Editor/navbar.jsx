import React from 'react';
import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {RiArrowLeftLine} from 'react-icons/ri'

const Navbar = ({ darkMode }) => {
  const bgColor = darkMode ? 'gray.800' : 'white';
  const textColor = darkMode ? 'white' : 'gray.800';

  return (
    <Box bg={bgColor} px={5} py={5} mb={5} color={textColor}>
      <Flex align="center">
        <Heading size="xl" color={textColor}>CodeCampus</Heading>
        <Spacer />
        <Flex gap={4}>
          <Link to="/student">
            <Button
              padding={2}
              colorPalette={'blue'}
              variant={'solid'}
            >
              <RiArrowLeftLine />
              Go back
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
