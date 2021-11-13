import React, { useState } from "react";
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import {useHistory} from 'react-router-dom'

import '../components/App.css'

import {useToast, 
  Text, 
  Link, 
  Alert, 
  AlertIcon, 
  Spinner, 
  Center, 
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
} from "@chakra-ui/react"

const PairsAnalyser = React.lazy(() => import('../components/PairsAnalyser.jsx'))
const Navbar = React.lazy(() => import('../components/Navbar.js'))


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


  const pairs_QUERY = gql`
  query pairs($pairAddress: Bytes!, $date: [Int!]){
    pairDayDatas(orderBy: date, orderDirection: desc,
    where: {
      date_in: $date
      pairAddress: $pairAddress
    }
    ) 
    {
      id
      token0{
        name
        symbol
        id

      }
      token1{
        name
        symbol
        id
      }  
      date
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolumeUSD
      reserveUSD
      pairAddress
      dailyTxns
      reserve0
      reserve1
    }
  }`




  function TokenPairs(props) {


    const tokPairsID = props.location.state.props;
    const [time, setTime] = useState(0)
    const [timeW, setTimeW] = useState('week')
    const [timeNum, setTimeNum] = useState('1W')
    const history = useHistory();
    const toast = useToast();

    const openToken = (props) => {

      history.push({
        pathname:"/Token",
        state: {props},
      })}

      function setTimeAnalyticsW(){
        if(l<2){
          return (
        toast({
          title: "Incomplete data",
          description: "This asset is less than 1W old on Uniswap - consider researching",
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
           if(l<3){
          return (
        toast({
          title: "Incomplete data",
          description: "This asset is less than 1M old on Uniswap - consider researching",
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

      const { loading: todayLoading, data: todayData } = useQuery(pairs_QUERY, {
        variables: {
          pairAddress: tokPairsID,
          date: dates
        }
      })

      const symbol = todayData && todayData.pairDayDatas[0].token0.symbol
      const symbol1 = todayData && todayData.pairDayDatas[0].token1.symbol
      const id = todayData && todayData.pairDayDatas[0].token0.id
      const id1 = todayData && todayData.pairDayDatas[0].token1.id
      const vol1 = todayData && todayData.pairDayDatas[0].dailyVolumeUSD
      const vol2 = todayData && todayData.pairDayDatas[time].dailyVolumeUSD
      const txn1 = todayData && todayData.pairDayDatas[0].dailyTxns
      const txn2 = todayData && todayData.pairDayDatas[time].dailyTxns
      const res1 = todayData && todayData.pairDayDatas[0].reserveUSD
      const res2 = todayData && todayData.pairDayDatas[time].reserveUSD
      const l = todayData && todayData.pairDayDatas.length

      const dayChangeVol = ((vol1/vol2)-1)*100
      const dayChangeTxn = ((txn1/txn2)-1)*100
      const dayChangeRes = ((res1/res2)-1)*100


      function statArrow(props){
        if (props<0){
          return ( <div>{timeNum}<StatArrow type="decrease"/></div> ) 
        }
        else{
                  return ( <div>{timeNum}<StatArrow type="increase"/></div> )
        }
      }

      function alertHandlerVol(props){
        if (props>30){
          return (
            <Alert status="warning" variant="subtle">
            <AlertIcon />
            <Text> Volume is up over 30% this {timeW} - {" "} <Link color="blue.500" href="/Info"> click here </Link> {" "} for more info </Text>
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



          if(todayLoading){
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
            tokPairsID:tokPairsID,
            tokID1:id,
            tokID2: id1,
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
              <Box boxShadow="md" pt="10px" borderRadius="lg" overflow="hidden" bg="white" border='white' borderWidth="1px" width="100%">
              <HStack spacing="100px"> 
              <Stat>
              <StatLabel>Daily Volume {symbol} & {symbol1}</StatLabel>
              <StatNumber>{parseFloat(vol1).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</StatNumber>
              <StatHelpText>
              {statArrow(dayChangeVol)}
              {dayChangeVol.toFixed(1)+"%"}

              </StatHelpText>
              </Stat>
              <Stat>
              <StatLabel>Total Liquidity {symbol} & {symbol1}</StatLabel>
              <StatNumber>{parseFloat(res1).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</StatNumber>
              <StatHelpText>
              {statArrow(dayChangeRes)}
              {dayChangeRes.toFixed(1)+"%"}

              </StatHelpText>
              </Stat>
              <Stat>
              <StatLabel>Daily Transactions {symbol} & {symbol1}</StatLabel>
              <StatNumber>{parseFloat(txn1).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</StatNumber>
              <StatHelpText>
              {statArrow(dayChangeTxn)}
              {dayChangeTxn.toFixed(1)+"%"}

              </StatHelpText>
              </Stat>
              
              </HStack>
              {alertHandlerVol(dayChangeVol)}
              {alertHandlerLiq(dayChangeRes)}
              </Box>
              <ButtonGroup pr = "10px" size = "md" variant="solid">
              <Button colorScheme="pink" onClick = {setTimeAnalyticsW} > 1W </Button>
              <Button colorScheme="pink" onClick = {setTimeAnalyticsM} > 1M </Button>
              <Button colorScheme="purple" onClick = {() => {openToken(id)}} > {symbol} </Button>
              <Button colorScheme="purple" onClick = {() => {openToken(id1)}} > {symbol1} </Button>

              </ButtonGroup>
              <ButtonGroup>
              <VStack>
              <PairsAnalyser {...props1}/>
              </VStack>
              </ButtonGroup>
              </Stack>
              </Center>
              );

        }





        export default TokenPairs;
