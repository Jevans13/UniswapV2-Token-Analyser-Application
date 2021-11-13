import axios from 'axios'
import React, {useState, useEffect} from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  Alert,
  useToast,
  AlertIcon,
  Text
} from "@chakra-ui/react"
  import { useQuery } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
  import { HttpLink } from 'apollo-link-http'
  import { InMemoryCache } from 'apollo-cache-inmemory'
  import gql from 'graphql-tag'
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

function AvgPrice(totalDataPast){
  var total = 0;
  for(var i = 0; i < totalDataPast.length; i++) {
    total += parseInt(totalDataPast[i][1] * 100) / 100;
  }
  var avg = total / totalDataPast.length;
  return avg;
}

function statArrow(props){
      if (props<0){
        return (
        <div>1D<StatArrow type="decrease"/></div>
       )  
      }
      else{
        return <div>1D<StatArrow type="increase"/></div>
      }
  }


  function alertHandler(props){
      if (props===0){
        return (
         <Alert status="alert" variant="subtle">
        <AlertIcon />
      <Text> Select timeframe to initialise data</Text>
       </Alert>)}}

    const tokenDay_QUERY = gql`
  query 
  tokens($tokenAddress: Bytes!){
    tokenDayDatas(first:365 orderBy: date, orderDirection: desc,
    where: {
      token: $tokenAddress
    }

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

const TokenPrice = (props) => {

	const tokID = props.tokID;
  const time1 = props.time;
  
  const toast = useToast();
	const [time, setTime] = useState(365)
	const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [timeW, setTimeW] = useState('')
	const [totalData, setData] = useState([]);
	const [totalDataYday, setDataYday] = useState();
	const [totalDataPast, setDataPast] = useState([]);


  const { loading: dayLoading, data: dayData, refetch } = useQuery(tokenDay_QUERY,
        { variables: {tokenAddress: tokID}});

  useEffect(() => { refetch() }, [tokID])

	useEffect(() => { if(time1===1){
        setTime(7)
        setTimeW('1W')
      }
       if(time1===2){
        setTime(30)
        setTimeW('1M')
      }
       if(time1===3){
        setTime(365)
        setTimeW('1Y')
      } }, [time1])
	  
	useEffect(() => { 
		const fetchData = async () => {
      try{
    const result = await axios('https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses='
      +tokID+
      '&vs_currencies=usd&include_market_cap=true')
    setData(result.data[tokID])
    setIsLoadingPage(true)
 }
   catch (error) {
       return(toast({
          title: "Error fetching price data for this token",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
       )
    }
}
  fetchData();
}, []);


	useEffect(() => { 
		const fetchData = async () => {
      try{
    const result = await axios('https://api.coingecko.com/api/v3/coins/ethereum/contract/'+tokID+'/market_chart/?vs_currency=usd&days=1')
    setDataYday(result.data.prices[0][1])
    setIsLoadingPage(true)   
  }
  catch(error){
    console.log(error)
  }}
  fetchData();
}, []);

	useEffect(() => { 
		const fetchData = async () => {
      try{
    const result = await axios('https://api.coingecko.com/api/v3/coins/ethereum/contract/'
      +tokID+'/market_chart/?vs_currency=usd&days='+time)
    setDataPast(result.data.prices);
    setIsLoadingPage(true)
  }
  catch(error){
    console.log(error)
  }}
  setIsLoadingPage(false)
  fetchData();
}, [time]);

var average = AvgPrice(totalDataPast);  

const dayChangePrice = ((totalData.usd/totalDataYday)-1)*100

const dataL = dayData && dayData.tokenDayDatas.length;
var totalVol = 0;

for (var k = 0; k < dataL; k++) {
const data = dayData && dayData.tokenDayDatas[k].dailyVolumeUSD
totalVol += parseFloat(data)
};

var avgVol = totalVol/dataL


if(typeof totalData.usd==="undefined"){
  return(
    {...isLoadingPage ? (
        <p>Loading ...</p>
      ) : (
    <div>
    <Navbar/>
    <Alert>Price data for this token cannot be found - this may be due to the token being new. Consider researching</Alert>
    </div>
    )
})}

else if(parseFloat(totalData.usd>0.1)){
	return (
		
		{...isLoadingPage ? (
        <p>Loading ...</p>
      ) : (
      <div>
      <HStack spacing="50px">
      <Stat>
    <StatLabel>Price </StatLabel>
    <StatNumber>${parseFloat(totalData.usd).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</StatNumber>
  	<StatHelpText>
    {statArrow(dayChangePrice)}
      {dayChangePrice.toFixed(1)+"%"}
    
    </StatHelpText>
  </Stat>
  <Stat color="purple">
    <StatLabel>Average Price: </StatLabel>
     <StatNumber>${parseFloat(average).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</StatNumber>

     </Stat>
     <Stat color="purple">
    <StatLabel>Average Daily Volume: </StatLabel>
      <StatNumber>${parseFloat(avgVol).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</StatNumber>  
     </Stat>
     </HStack>
     {alertHandler(average)}
  </div>
	

	)
	
  })}

else{

    return (
    
    
      <div>
      <HStack spacing="50px">
      <Stat>
    <StatLabel>Price </StatLabel>
    <StatNumber>${parseFloat(totalData.usd).toFixed(5).toString()}</StatNumber>
    <StatHelpText>
    {statArrow(dayChangePrice)}
      {dayChangePrice.toFixed(1)+"%"}
    
    </StatHelpText>
  </Stat>
  <Stat color="purple">
    <StatLabel>Average Price: {timeW}</StatLabel>
     <StatNumber>${parseFloat(average).toFixed(5).toString()}</StatNumber>

     </Stat>
     <Stat color="purple">
    <StatLabel>Average Daily Volume: {timeW} </StatLabel>
      <StatNumber>${parseFloat(avgVol).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</StatNumber>  
     </Stat>
     </HStack>
     {alertHandler(average)}
  </div>
)
  


  }}


export default TokenPrice;
