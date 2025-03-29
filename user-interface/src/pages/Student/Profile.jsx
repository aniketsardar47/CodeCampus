import { Flex,  Text, Spacer ,Button} from '@chakra-ui/react'
import React from 'react'

export default function Profile() {
  return (
    <Flex
        p={'10px'}
        bg={'white'}
        h={'95vh'}
        borderRadius={'10px'}
        direction={'column'}
        
        color={'teal'}
    >
        <Text>Dashboard</Text>
        <Spacer/>
        <Button w={100} colorPalette="teal">Log out</Button>
    </Flex>
  )
}
