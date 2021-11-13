import React from "react";
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import {useHistory} from 'react-router-dom'

import '../components/App.css'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloTableQL } from 'react-tableql'
import { ApolloProvider } from '@apollo/client';

import { VStack, Center, Spinner, Box, Stack, Heading } from "@chakra-ui/react"

import Navbar from '../components/Navbar.js'

//https://github.com/Danilo-Zekovic/react-tableql

  export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})


const TopPairs = () => {

  const history = useHistory();

   const handleRouteTokenPairs = (props) => {
  history.push({
    pathname:"/token-pairs",
    state: {props},
})}
   
 const topLiquidPairs_QUERY = gql`
  query
  pair($date: Int!){
 pairDayDatas( orderBy: dailyVolumeUSD, orderDirection: desc,
   where: {
      date: $date
   }
 ) 
 {
   id
  token0{
    name
    symbol
  }
  token1{
    name
    symbol
  }  
     date
     dailyVolumeToken0
     dailyVolumeToken1
     dailyVolumeUSD
     reserveUSD
     pairAddress
 }
}`

var now = new Date();
var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if(startOfDay.getTimezoneOffset()){
  var timestamp = (startOfDay / 1000)+3600; }
  else{
   var timestamp = (startOfDay / 1000)
  }

const {loading: topLoading } = useQuery(topLiquidPairs_QUERY, {
    variables: {
      date: timestamp
    }})

if(topLoading){
  return (

    <Box
  w="100%"
  h="100vh"
  bgGradient={[
    "linear(to-tr, pink.300,purple.400)",
    "linear(to-t, black.200, teal.500)",
    "linear(to-b, purple.100, pink.300)",
  ]}
>
    <Center h="50%" w="100%">
    <Spinner
    thickness="4px"
    speed="0.65s"
    emptyColor="gray.200"
    color="pink.500"
    size="xl"
    />
    </Center>

    </Box>
    )
}

return (
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
<Navbar/>
<VStack spacing="25px">
    <Heading  size="lg"> Top Pairs by Daily Volume USD </Heading>
<ApolloProvider client={client}>
<ApolloTableQL
query={topLiquidPairs_QUERY} 
styles={
  {
    table:'ReactTable.rt-table.-pagination',
    thead:'ReactTable.rt-thead',
    tbody:'ReactTable .rt-tbody'
  }
}
variables={{date: timestamp }}
onRowClick={data => (handleRouteTokenPairs(data.pairAddress))}
columns={[
  {id:'token0.symbol',label:'Token 1 Symbol'},
  {id:'token1.symbol',label:'Token 2 Symbol',},
  {id:'dailyVolumeUSD', label:'Daily Volume USD', component: data => parseFloat(data).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  sort: (data, property) => data.sort(data.dailyVolumeUSD),},
  ]}
pagination={
{
  pageLimit:5,
  pageNeighbors:2,
  currentPage:1,
  onPageChanged:({currentPage, totalPages, pageLimit, totalRecords}) => {
      }
    }
  }/> 
  </ApolloProvider>
   </VStack>
   </Stack>
    </Box>
 
);

}



export default TopPairs;

