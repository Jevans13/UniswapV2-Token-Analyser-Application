import React, { useState, useEffect } from "react";
import gql from 'graphql-tag'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'

import '../components/App.css'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import {Text, 
  Link, 
  useToast, 
  Input, 
  Center, 
  Spinner, 
  Box, 
  Stack, 
  HStack, 
  VStack, 
  Button, 
  ButtonGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
} from "@chakra-ui/react"

import { Formik, Form, Field, } from 'formik';

const Navbar = React.lazy(() => import('../components/Navbar.js'))
const Analyser = React.lazy(() => import('../components/Analyser.jsx'))
const TokenPrice = React.lazy(() => import('../components/TokenPrice.jsx'))
const ErrorBoundary = React.lazy(() => import('../components/ErrorBoundary.jsx'))

var now = new Date();
var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if(startOfDay.getTimezoneOffset()){
  var timestamp = (startOfDay / 1000)+3600; }
  else{
   var timestamp = (startOfDay / 1000)
  }
const day = 86400;
const today = timestamp
const week = timestamp-(day*7)
const month = timestamp-(day*30)
const year = timestamp-(day*365)

const dates = [today, week, month, year]



export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})

 const DAY_DATA = gql`
query
  tokens($date: [Int!], $tokenAddress: Bytes!){
 tokenDayDatas(first:5, orderBy: date, orderDirection: desc,
 where: {date_in: $date, token: $tokenAddress}
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

 const tokCheck_QUERY = gql`
query
  tokens($tokenAddress: Bytes!){
 tokenDayDatas(first:1,
 where: {token: $tokenAddress}){
    id
    token {
      symbol
      }
 }
}
`

 

function Token(props) {

  const [time, setTime] = useState(0)
  const [timeW, setTimeW] = useState('week')
  const [timeNum, setTimeNum] = useState('1W')

  const[tok, setTok] = useState("0x6b175474e89094c44da98b954eedeac495271d0f")
    

    useEffect(() =>   
    setTok(props.location.state.props),[props])
  const toast = useToast()

  function setTimeAnalyticsW(){
    if(dataL1<1){
      return (
        toast({
          title: "Incomplete data",
          description: "This asset is less than 30D old on Uniswap - consider researching",
          status: "error",
          duration: 9000,
          isClosable: true,
        }))
    }
    else{
    setTime(1)
    setTimeW('week')
    setTimeNum('1W')
  }}

    function setTimeAnalyticsM(){
    if(dataL1<3){
      return (
        toast({
          title: "Incomplete data",
          description: "This asset is less than 30D old on Uniswap - consider researching",
          status: "error",
          duration: 9000,
          isClosable: true,
        }))
    }
    else{
    setTime(2)
    setTimeW('month')
     setTimeNum('1M')
  }}

    function setTimeAnalyticsY(){
    if(dataL1<4){
      setTimeAnalyticsM()
      return (
        toast({
          title: "Incomplete data",
          description: "This asset is less than 1 year old on Uniswap - consider researching",
          status: "error",
          duration: 9000,
          isClosable: true,
        }))
    }
    else{
    setTime(3)
    setTimeW('year')
     setTimeNum('1Y')
  }}


  function validateToken(value) {
    let error
    if (!value) {
      error = "Token is required"
    } 
    getCheck({variables: {
      tokenAddress: value
    }})  
          console.log(value)
          if(typeof checkData!='undefined'){
          console.log(checkData.tokenDayDatas.length)}

    if(!checkLoading && typeof checkData != 'undefined' && checkData.tokenDayDatas.length<1){  
      error = "No data for this address"
}
    return error
  }

    const [getCheck, { loading: checkLoading, data: checkData }] = useLazyQuery(tokCheck_QUERY)

      const { loading: blockLoading, data: blockData } = useQuery(DAY_DATA,   {
    variables: {
      tokenAddress: tok,
      date: dates
    }
  })

      //Accessing query response
  const liq1 = blockData && blockData.tokenDayDatas[0].totalLiquidityUSD
  const liq2 = blockData && blockData.tokenDayDatas[time].totalLiquidityUSD
  const vol1 = blockData && blockData.tokenDayDatas[0].dailyVolumeUSD
  const sym1 = blockData && blockData.tokenDayDatas[0].token.symbol
  const vol2 = blockData && blockData.tokenDayDatas[time].dailyVolumeUSD

const dataL1 = blockData && blockData.tokenDayDatas.length;
var dayChangeVol = 0
var dayChangeLiq = 0

if(!blockLoading){
  dayChangeVol = ((vol1/vol2)-1)*100
  dayChangeLiq = ((liq1/liq2)-1)*100
}




function statArrow(props){
  if (props<0){
    return (
      <div>{timeNum}<StatArrow type="decrease"/></div>
      )  
  }
  else{
    return  <div>{timeNum}<StatArrow type="increase"/></div>
  }
}

  function alertHandlerVol(props){
      if (props>30){
        return (
         <Alert status="warning" variant="subtle">
        <AlertIcon />
      <Text> Volume is up over 30% this {timeW} - {" "} 
      <Link color="blue.500" href="/Info"> click here </Link> 
      {" "} for more info </Text>
       </Alert>    
       )}}

     function alertHandlerLiq(props){
      if (props<-30){
        return (
         <Alert status="warning" variant="subtle">
        <AlertIcon />
         <Text> Liquidity is down over 30% this {timeW} - {" "} <Link color="blue.500" href="/Info"> click here </Link> {" "} for more info </Text>
        </Alert>
       
       )}}

 

  if(blockLoading){
    return(
        <Center bg="pink" h="100%" w="100%" color="black" bgGradient={[
    "linear(to-tr, pink.300,purple.400)",
    "linear(to-t, black.200, teal.500)",
    "linear(to-b, purple.100, pink.300)",
  ]}>
    <Box h="100vh" w="100%">
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
    </Center>
    )
  }

  let props1 = {
    tokID:tok,
    time:time
  }

  return (
    <Center bg="pink" h="100%" w="100%" color="black" bgGradient={[
    "linear(to-tr, pink.300,purple.400)",
    "linear(to-t, black.200, teal.500)",
    "linear(to-b, purple.100, pink.300)",
  ]}>
     <Stack>
    <Navbar/>
     <Box boxShadow="md" pt="10px" borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" border='white' borderWidth="1px" width="100%">
 
    <Tabs size="md" variant="enclosed" pl="10px" pr="10px" colorScheme="pink">
    <TabList>
    <Tab>Statistics</Tab>
    <Tab>Search</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      
    <HStack spacing="50px"> 
    <Stat>
      <StatLabel>Daily Volume {sym1}</StatLabel>
      <StatNumber>{parseFloat(vol1).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</StatNumber>
      <StatHelpText>
      {statArrow(dayChangeVol)}
      {dayChangeVol.toFixed(1)+"%"}
      </StatHelpText>
    </Stat>
   <Stat>
    <StatLabel>Total Liquidity {sym1}</StatLabel>
    <StatNumber>{parseFloat(liq1).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</StatNumber>
    <StatHelpText>
    {statArrow(dayChangeLiq)}
      {dayChangeLiq.toFixed(1)+"%"}
    </StatHelpText>
  </Stat>
<ErrorBoundary>
  <TokenPrice {...props1}/>
  </ErrorBoundary>
  </HStack>
    </TabPanel>
    <TabPanel>
        <Formik
        boxShadow="base"
    initialValues={{ token: "0x6b175474e89094c44da98b954eedeac495271d0f" }}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        setTok(values.token)
      }, 1000)
    }}
    >
    {(props) => (
    <Form>
      <Field name="token" validate={validateToken}>
        {({ field, form }) => (
        <FormControl isInvalid={form.errors.token && form.touched.token}>
          <FormLabel htmlFor="/Token">Token Search</FormLabel>
          <Input {...field} id="token" placeholder="Enter ERC20 Token Address" />
          <FormErrorMessage>{form.errors.token}</FormErrorMessage>
        </FormControl>
        )}
      </Field>
      <Button
      mt={3}
      size="sm"
      colorScheme="teal"
      isLoading={props.isSubmitting}
      type="submit"
      >
      Submit
    </Button>
  </Form>
  )}
</Formik>
    </TabPanel>
  </TabPanels>
</Tabs>
    


 
  {alertHandlerLiq(dayChangeLiq)}
  {alertHandlerVol(dayChangeVol)}
  </Box>
  <HStack>
    
  <ButtonGroup variant="solid"  pr = "10px" size = "md" colorScheme="pink">
  <Button onClick = {setTimeAnalyticsW} > 1W </Button>
  <Button onClick = {setTimeAnalyticsM} > 1M </Button>  
  <Button onClick = {setTimeAnalyticsY} > 1Y </Button>  
  </ButtonGroup>

</HStack>
<VStack>
    <Analyser {...props1}/> 
    </VStack>
     
    </Stack>
    </Center>
    

  );

}





export default Token;


