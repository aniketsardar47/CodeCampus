import {  Button, Container, Flex, Grid, GridItem, Heading, Spacer ,Avatar} from '@chakra-ui/react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

export default function StudDash() {

    const navigate = useNavigate();

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }

  return (
    <Grid templateColumns="1fr 5fr">
      <GridItem
      as='aside'
      minHeight='100vh'
      p={'10px'}
      
      >
        
      <Profile/>

      </GridItem>

      <GridItem
      as="main"
      p="10px"
      >
      <Container fluid h={'100vh'}>
      <Flex bg={'white'} borderRadius={'5px'} color={'black'} p={'5px'} alignItems={'center'} wrap="wrap">
        <Heading>Home</Heading>
        <Spacer/>
        <Button w={100} onClick={handleLogout} colorPalette="teal">Log out</Button>
      </Flex>
      <Heading>Student Dashboard</Heading>
    </Container>
      </GridItem>
    </Grid>
  )
}
