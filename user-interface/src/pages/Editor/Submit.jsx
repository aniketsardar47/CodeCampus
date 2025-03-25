import React from 'react';
import PropTypes from 'prop-ts';
import { Button, Box } from '@chakra-ui/react';

const Submit = ({ code, onResponse }) => {
  
  const handleSubmit = () => {
    const modifiedCode = `${code}\n// Submitted by Submit Component`;
    
    if (onResponse) {
      onResponse(modifiedCode);
    }

    
  };

  return (
    <Box>
      <Button colorScheme="orange" px={6} onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

Submit.propTypes = {
  code: PropTypes.string.isRequired,
  onResponse: PropTypes.func.isRequired
};

export default Submit;
