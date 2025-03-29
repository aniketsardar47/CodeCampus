import { Button, Heading } from '@chakra-ui/react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function TeachDash() {

    const navigate = useNavigate();

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }

  return (
    <div>
      <Heading>Teacher Dashboard</Heading>
        <Button w={100} onClick={handleLogout} >Log out</Button>
      
    </div>
  )
}
