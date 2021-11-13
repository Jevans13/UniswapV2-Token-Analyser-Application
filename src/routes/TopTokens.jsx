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

import {Tag, TagLabel, Box, Center, Spinner, Stack, VStack, Heading } from "@chakra-ui/react"

import '../components/App.css'
import Navbar from '../components/Navbar.js'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})

const TopTokens = () => {

  const history = useHistory();

  const handleRouteToken = (props) => {
    history.push({
      pathname:"/Token",
      state: {props},
    })}
    
    //https://github.com/Danilo-Zekovic/react-tableql
    //Table data query:

    const DAY_DATA = gql`
    query
    tokens($date: Int!){
      tokenDayDatas(first:100, orderBy: dailyVolumeUSD, orderDirection: desc,
      where: {date: $date}
      skip: 0) {
        id
        token {
          symbol
          name
          id
        }
        date
        priceUSD
        totalLiquidityToken
        totalLiquidityUSD
        totalLiquidityETH
        dailyVolumeETH
        dailyVolumeToken
        dailyVolumeUSD
      }
    }
    `
    const { loading: topLoading } = useQuery(DAY_DATA)



    var now = new Date();
    var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if(startOfDay.getTimezoneOffset()){
      var timestamp = (startOfDay / 1000)+3600; }
      else{
        var timestamp = (startOfDay / 1000)
      }


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
      h="100vh" 
      w="100%" 
      color="black" bgGradient={[
      "linear(to-tr, pink.300,purple.400)",
      "linear(to-t, black.200, teal.500)",
      "linear(to-b, purple.100, pink.300)",
      ]}>
      <Stack>

        <Navbar/>
        <VStack spacing="25px">
          <Heading  size="lg"> Top Tokens by Daily Volume USD </Heading>
          <ApolloProvider client={client}>

            <ApolloTableQL
            query={DAY_DATA}  
            variables = {{date: timestamp }}
            onRowClick={(data => handleRouteToken((data.token.id)))}

            columns={[
            {id:'token.symbol',label:'Token Symbol', nodeStyle: 'nodeStyle1',},
            {id: 'totalLiquidityUSD', label:'Total Liquidity USD',
            component: data => parseFloat(data).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')},
            {id:'dailyVolumeUSD', label:'Daily Volume USD', component: data => parseFloat(data).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), 
            sort: (data, property) => data.sort(data.dailyVolumeUSD) ,nodeStyle: data => {
              if ((data.dailyVolumeUSD/data.totalLiquidityUSD)>1) return 'custom-style-class-red'
              if ((data.totalLiquidityUSD/data.dailyVolumeUSD)>10) return 'custom-style-class-green'
            }},
            {id: 'priceUSD' , label: 'Price', component: data => parseFloat(data).toFixed(5).toString(),
            nodeStyle: 'nodeStyle1'}
            ]}
            pagination={
              {
                pageLimit: 5,
                pageNeighbors:2,
                currentPage:1,
                onPageChanged:({currentPage, totalPages, pageLimit, totalRecords}) => {
                }
              }
            }
            styles={{

              table:'ReactTable.rt-table.-pagination',
              thead:'ReactTable.rt-thead',
              tbody:'ReactTable .rt-tbody'

            }}
            />      
            <div>
              <VStack>
                <Tag size="lg" colorScheme="red" borderRadius="full">
                  <TagLabel> Red = Daily Volume {" > "} Liquidity</TagLabel>
                </Tag>
                <Tag size="lg" colorScheme="green" borderRadius="full">
                  <TagLabel> Green = Liquidity {" > "} 10x Daily Volume</TagLabel>
                </Tag>
              </VStack>


            </div>

          </ApolloProvider>
        </VStack>
      </Stack>
    </Box>

            );

    }



    export default TopTokens;

