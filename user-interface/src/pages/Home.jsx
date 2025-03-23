import { Button } from '@chakra-ui/react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Home() {

    const navigate = useNavigate();

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }

  return (
    <div>
        Home <br/>
        <Button onClick={handleLogout}>Log out</Button>
    </div>
  )
}
