import React from "react";
import {useHistory} from 'react-router-dom'

import '../components/App.css'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import { Box, Stack, VStack, Button, ButtonGroup, Heading } from "@chakra-ui/react"

import uniswapLogo from '../uniswap-logo.png'

const NavbarHome = React.lazy(() => import('../components/NavbarHome.jsx'))





export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})



const MainPage = () => {


  const history = useHistory();

  const handleRouteTT = () => {
    history.push("/top-tokens");
  }

  const handleRouteI = () => {
    history.push("/info");
  }

  const handleRouteTP = () => {
    history.push("/top-pairs");
  }


//Code block below adapted from DappUniversity github url - https://github.com/dappuniversity/uniswap-tutorial
//Which in turn was adapted from the following documentation - https://uniswap.org/docs/v2/API/overview/
// Forms - https://www.w3.org/WAI/tutorials/forms/


return (
<div className = "">
  <Box
  w="100%"
  h="100vh"
  bgGradient={[
  "linear(to-tr, pink.300,purple.400)",
  "linear(to-t, black.200, teal.500)",
  "linear(to-b, purple.100, pink.300)",
  ]}
  >
  <Stack>
  <NavbarHome/>

  <VStack>
    <Heading size="xl"> Uniswap Token Analyser </Heading>
    <img src={uniswapLogo} width="150" height="150" className="mb-4" alt="" />
    <ButtonGroup size="lg" variant="solid" colorScheme="pink" spacing="4">
<VStack>
  <Button onClick = {handleRouteTT} > Top Tokens </Button>  
  <Button onClick = {handleRouteTP} > Top Pairs </Button>
  <Button onClick = {handleRouteI} > Info </Button>
</VStack>
</ButtonGroup>
</VStack>
</Stack>
</Box>
</div>
                    );


};
export default MainPage;