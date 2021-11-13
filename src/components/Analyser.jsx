 import React, {useState, useEffect } from "react";

  import axios from 'axios'
  import Plot from 'react-plotly.js';
  import { ApolloClient } from 'apollo-client'
  import { HttpLink } from 'apollo-link-http'
  import { InMemoryCache } from 'apollo-cache-inmemory'
  import gql from 'graphql-tag'
  import { useQuery } from '@apollo/react-hooks'
  import {std} from 'mathjs'
  import { Stack, 
        Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
  Link,
  VStack, 
  HStack, 
  Button, 
  ButtonGroup, 
  useToast, 
  Box, 
  Heading, 
  Center,
  Spacer } from "@chakra-ui/react"

  export const client = new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
    }),
    fetchOptions: {
      mode: 'no-cors'
    },
    cache: new InMemoryCache()
  })

  function getDayOfYear(){
    //https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
  }

  function mean(arr, l)
{
    let sum = 0;
    for(let i = 0; i < l; i++)
        sum = sum + parseFloat(arr[i]);

         
    return sum / l;
}

function covariance(a1, a2, l)
{
    let sum = 0;
    for(let i = 0; i < l; i++){
        sum = sum + (a1[i] - mean(a1, l)) *
                    (parseFloat(a2[i]) - mean(a2, l));}              
    return sum / (l - 1);
}


  const tokenDay_QUERY = gql`
  query 
  tokens($tokenAddress: Bytes!){
    tokenDayDatas(first:1000 orderBy: date, orderDirection: desc,
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
    const Analyser = (props) => {

      const tokID = props.tokID;
      const time1 = props.time;

      const [totalData, setData] = useState([]);
      const [loading, setLoading] = useState(false);
      let data = { date: [], prices: []};
      
      const [time, setTime] = useState(7)
      const [corPP, setCorPP] = useState('')

      const toast = useToast()
        
      useEffect(() => { if(time1===1){
        if(dataL>7){
      setTime(7);}
    else{
      setTime(dataL)
      return (
        toast({
          title: "Incomplete data",
          description: "This asset is less than 7D old on Uniswap - consider researching",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
        )
    }
      }
       if(time1===2){
         if(dataL>30){
      setTime(30);}
    else{
      setTime(dataL)
      return (
        toast({
          title: "Incomplete data",
          description: "This asset is less than 30D old on Uniswap - consider researching",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
        )
    }
      }
       if(time1===3){
            if(365<dataL){
      setTime(365);}
    else{
      setTime(dataL)
    }
      } }, [time1])
     

      const { data: dayData, refetch } = useQuery(tokenDay_QUERY,
        { variables: {tokenAddress: tokID}});
      useEffect(() => { refetch() }, [tokID])

      const tokenName = dayData && dayData.tokenDayDatas[0].token.name
  
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    var arr4 = [];

    for (var i = 0; i < time; i++) {
      
      const data = dayData && dayData.tokenDayDatas[i].dailyVolumeUSD
     arr1.push(data)
    };
    
    
    //Convert epoch date to human readable date - https://stackoverflow.com/questions/34149664/how-to-convert-epoch-to-javascript-date-and-date-to-epoch/34149721
    for (var j = 0; j < time; j++) {
      let data = dayData && dayData.tokenDayDatas[j].date
      if (data < 10000000000)
          data *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
      var data1 = data + (new Date().getTimezoneOffset() * -1); //for timeZone        
      var data2 = new Date(data1);

      arr2.push(data2)
    };

    //Assign data to match the length of time passed to component
    for (var k = 0; k < time; k++) {
      let data = dayData && dayData.tokenDayDatas[k].totalLiquidityToken
      let dataUSD = dayData && dayData.tokenDayDatas[k].totalLiquidityUSD
      arr3.push(data)
      arr4.push(dataUSD)
    };

    const dataL = dayData && dayData.tokenDayDatas.length;
 
    const handleTime2021 = () => {
        var day = getDayOfYear();
      if(dataL>day){
      setTime(day);}
    else{
      setTime(dataL)
    }}


        const handleTimeMax = () => {
      setTime(dataL)
    }

  useEffect(() => { 
    const fetchData = async () => {
    const result = await axios('https://api.coingecko.com/api/v3/coins/ethereum/contract/'
      +tokID+'/market_chart/?vs_currency=usd&days='+time)
    setData(result.data.prices);
    setLoading(true)

  };
  fetchData();
  setLoading(false)
}, [time]);

    for (const item of totalData) {
      data.prices.push(item[1]);
      if (item[0] < 10000000000)
          item[0] *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
      var data3 = item[0] + (new Date().getTimezoneOffset() * -1); //for timeZone        
      var data4 = new Date(data3);
      data.date.push(data4);
    }

//Correlation Calculation
  useEffect(() => { 
   if(typeof arr3[0] !=="undefined"){
    var l = data.prices.length
    var l2 = arr3.length
    if(l2<l){
      l=l2
    }
    var a1 = data.prices;
    var a2 = arr3;
     if(l>0){ 

    setCorPP((((covariance(a1,a2,l)/(std(a1)*std(a2)))*100).toFixed(2))+"%")
}}
}
,[data])



    return (
     <div><HStack>
          <ButtonGroup size = "md" variant="solid" colorScheme="pink">
          <Button onClick = {handleTime2021} > 2021 </Button>
           <Button onClick = {handleTimeMax} > Max </Button>        
          </ButtonGroup>
      
           <Spacer />
            <Popover trigger="hover">
  <PopoverTrigger >
          <Heading size="md" ml="650px"
                  >Correlation: {corPP}</Heading>
  </PopoverTrigger>
  <Portal>
    <PopoverContent>
      <PopoverArrow />
      <PopoverHeader>Liquidity / price correlation for {tokenName}</PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <Link href="/info" colorScheme="blue">More info</Link>
      </PopoverBody>
    </PopoverContent>
  </Portal>
</Popover>

</HStack>
      <Stack spacing={4}>
      <Center>
      <Heading size="md" p="5px">
      Daily volume and liquidity in USD for {tokenName} {' '}
      </Heading>
      </Center>
      <div style={{ width: "100%", height: "100%" }}>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" >
      <Plot 
      key = {tokID}
      displaylogo = {false}
      style={{
        position: 'relative'
      }}
      data={[
        {
          x: arr2,
          y: arr3,
          type: "line",
          name: "Total Liquidity Token",
          yaxis:'y2',
        },
        {
          type: 'bar',
          x: arr2, 
          y: arr1,
          name: "Daily Volume USD",
        },
           {
          type: 'line',
          x: arr2,
          y: arr4,
          name: "Total Liquidity USD",
        }

        ]}
        layout={
          { 
            showlegend: true,
             legend: {
    x: 1,
    xanchor: 'right',
    y: 1.25,
    bgcolor: 'white',
    bordercolor: 'pink',
    borderwidth: 2
  },
  
  width: 1000, height: 500,
          xaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false,
          },
           yaxis: { title: 'USD'},
          yaxis2: {
    title: 'Total Liquidity Token',
    titlefont: {color: 'rgb(148, 103, 189)'},
    tickfont: {color: 'rgb(148, 103, 189)'},
    overlaying: 'y',
    side: 'right'
  }}}
          />
          </Box>
               </div>

     
          <Center>
          <Heading size="md" p="5px">
      Daily price in USD for {tokenName} {' '}
      </Heading>
      </Center>
      <div style={{ width: "100%", height: "100%" }}>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" >
  <Plot 
      style={{
        position: 'relative'
      }}
      data={[
        {
          type: 'line',
          x: data.date, 
          y: data.prices,
          name: "Daily Prices"
        }

        ]}
        layout={{ width: 1000, height: 500,
          xaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false,
          },
          yaxis:{
            tickformat:'.5f'
          }}}
          />
          </Box>
          </div>
</Stack>
</div>

          );


  };
  export default Analyser;