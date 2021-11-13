import React, {useState, useEffect} from "react";
  import Plot from 'react-plotly.js';
  import { ApolloClient } from 'apollo-client'
  import { HttpLink } from 'apollo-link-http'
  import { InMemoryCache } from 'apollo-cache-inmemory'
  import gql from 'graphql-tag'
  import { useQuery } from '@apollo/react-hooks'
  import { 
  Stack, 
  VStack, 
  Button, 
  ButtonGroup, 
  Box, 
  Heading, 
  useToast, 
  Center, 
  Spinner, 
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
  Link,
  HStack,
  Spacer } from "@chakra-ui/react"
  import {std} from 'mathjs'
  import axios from 'axios'

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

  function mean(arr, n)
{
    let sum = 0;
    for(let i = 0; i < n; i++)
        sum = sum + arr[i];
         
    return sum / n;
}

function covariance(arr1, arr2, n)
{
    let sum = 0;
    for(let i = 0; i < n; i++)
        sum = sum + (arr1[i] - mean(arr1, n)) *
                    (arr2[i] - mean(arr2, n));
                     
    return sum / (n - 1);
}


  const tokenDay_QUERY = gql`
query 
  tokens($tokenAddress: Bytes!){
 pairDayDatas( first: 400, 
 orderBy: date, orderDirection: desc,
   where: {
     pairAddress: $tokenAddress,
   }
 ) {
  token0{
    name
  }
  token1{
    name
  }
     date
     dailyVolumeToken0
     dailyVolumeToken1
     dailyVolumeUSD
     reserveUSD
     dailyTxns
 }
}`

    const PairsAnalyser = (props) => {

      const tokPairsID = props.tokPairsID;
      const time1 = props.time
        const ID1 = props.tokID1;
  const ID2 = props.tokID2;
         var total1 = 0;
  var total2 = 0;




    const [totalData1, setData1] = useState([]);
    const [totalData2, setData2] = useState([]);
    const [loading, setLoading] = useState(false);
     const [corPP, setCorPP] = useState(0)
  let dataTok1 = { date: [], prices: []};
  let dataTok2 = { date: [], prices: []};

  const toast = useToast();



      const [time, setTime] = useState(7)
      
      useEffect(() => { 
        if(time1===0){
        setTime(1)
      }
        if(time1===1){
        setTime(7)
      }
       if(time1===2){
        setTime(30)
      }
       if(time1===3){
        setTime(30)
      } }, [time1])
     


      const { loading: dayLoading, data: dayData, refetch } = useQuery(tokenDay_QUERY,
        { variables: {tokenAddress: tokPairsID}});
      useEffect(() => { refetch() }, [tokPairsID])

   
      

      const tokenName1 = dayData && dayData.pairDayDatas[0].token0.name
      const tokenName2 = dayData && dayData.pairDayDatas[0].token1.name
      
   
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    var arr4 = []

    for (var i = 0; i < time; i++) {
      
      const data = dayData && dayData.pairDayDatas[i].reserveUSD
      const data1 = dayData && dayData.pairDayDatas[i].dailyVolumeToken1

     arr1.push(data)
     arr4.push(data1)
    };
    const dataL = dayData && dayData.pairDayDatas.length;

    //Convert epoch date to human readable date - https://stackoverflow.com/questions/34149664/how-to-convert-epoch-to-javascript-date-and-date-to-epoch/34149721
    for (var j = 0; j < time; j++) {
      let data = dayData && dayData.pairDayDatas[j].date
      if (data < 10000000000)
          data *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
      let data1 = data + (new Date().getTimezoneOffset() * -1); //for timeZone        
      let data2 = new Date(data1);

      arr2.push(data2)
    };
    for (var k = 0; k < time; k++) {
      const data = dayData && dayData.pairDayDatas[k].dailyVolumeUSD
      arr3.push(data)
    };

    const handleTime2021 = () => {
        var day = getDayOfYear();
      if(dataL<day){
      setTime(dataL)
      return (
        toast({
          title: "Incomplete data",
          description: "Showing the max time this asset has been on Uniswap - consider researching",
          status: "error",
          duration: 9000,
          isClosable: true,
        }));}
    else{
      setTime(day)
    }

    }
    const handleTimeMax = () => {
      setTime(dataL)
    }


  useEffect(() => { 
    const fetchData = async () => {
      try{
    const result = await axios('https://api.coingecko.com/api/v3/coins/ethereum/contract/'+ID1+'/market_chart/?vs_currency=usd&days='+time)
    setData1(result.data.prices)
  }
  catch (error) {
       return(toast({
          title: "Error fetching price data for token1",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
       )
    }
}
  ;
  fetchData();
}, [time]);

  useEffect(() => { 
    const fetchData = async () => {
      try{
    const result = await axios('https://api.coingecko.com/api/v3/coins/ethereum/contract/'+ID2+'/market_chart/?vs_currency=usd&days='+time)
    setData2(result.data.prices)
  }
   catch (error) {
       return(toast({
          title: "Error fetching price data for token2",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
       )
    }
}
  fetchData()
}, [time]);

    for (const item of totalData1) {
      dataTok1.prices.push(item[1]);
      if (item[0] < 10000000000)
          item[0] *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
      var data1 = item[0] + (new Date().getTimezoneOffset() * -1); //for timeZone        
      var data2 = new Date(data1);
      dataTok1.date.push(data2);
        
    }

      for (const item of totalData2) {
      dataTok2.prices.push(item[1]);
      if (item[0] < 10000000000)
          item[0] *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
      var data1 = item[0] + (new Date().getTimezoneOffset() * -1); //for timeZone        
      var data2 = new Date(data1);
      dataTok2.date.push(data2);}
        


//Correlation Calculation - https://www.investopedia.com/terms/c/correlation.asp
  useEffect(() => { 
    var l = dataTok1.prices.length
    var l2 = dataTok2.prices.length
    if(l2<l){
      l=l2
    }
    var a1 = dataTok1.prices;
    var a2 = dataTok2.prices;
 
    if(l>0){ 
    
   setCorPP((((covariance(a1,a2,l)/(std(a1)*std(a2)))*100).toFixed(2))+"%")
}
}
,[totalData1])
    

    if(dayLoading){
    return(

  
    <Center h="100vh" w="100vh">
    <Spinner
    thickness="4px"
    speed="0.65s"
    emptyColor="gray.200"
    color="pink.500"
    size="xl"
    />
    </Center>


    )
  }

    return (
     <div>
     <HStack>
     <ButtonGroup pr = "10px" size = "md" variant="solid" colorScheme="pink" >
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
      <PopoverHeader>Price correlation between {tokenName1} + {tokenName2}</PopoverHeader>
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
     <Heading size="md"pt="10px">
      Daily volume and total liquidity for {tokenName1}(1) and {tokenName2}(2) 
     </Heading>
     </Center>
        <div style={{ width: "100%", height: "100%" }}>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" >
      <Plot 
      key = {tokPairsID}
      style={{
        position: 'relative'
      }}
      data={[
        {
          x: arr2,
          y: arr1,
          type: "line",
          name: "Liquidity",
          marker: {
             color: 'black'
          }
        },
        
        {
          type: 'bar',
          x: arr2, 
          y: arr3,
          name: "Daily Volume USD",
          marker: {
                  color: 'pink'
                }
              }

              ]}
              layout={{ width: 1000, height: 500,
                legend: {
    x: 1,
    xanchor: 'right',
    y: 1.25,
    bgcolor: 'white',
    bordercolor: 'pink',
    borderwidth: 2
  },
                xaxis: {
                  autorange: true,
                  showgrid: false,
            zeroline: false,
            showline: false,
                
        }}}
          />
          </Box>
          <Center height="10px">
  <Divider orientation="horizontal" />
</Center>
<Center>
<Heading size="md" p="10px">
      Daily price for {tokenName1}(1) and {tokenName2}(2) 
     </Heading>
</Center>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" >
  <Plot 
      style={{
        position: 'relative'
      }}
      data={[
        {
          type: 'line',
          x: dataTok1.date, 
          y: dataTok1.prices,
          name: "Tok1 Price"
        },
        {
          type: 'line',
          x: dataTok2.date, 
          y: dataTok2.prices,
          name: "Tok2 Price",
          yaxis: 'y2'
        }

        ]}
        layout={{ width: 1000, height: 500,
          legend: {
    x: 1,
    xanchor: 'right',
    y: 1.25,
    bgcolor: 'white',
    bordercolor: 'pink',
    borderwidth: 2
  },
          xaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false,
          },
          yaxis: { title: 'Token1 Price'},
          yaxis2: {
    title: 'Token2 Price',
    titlefont: {color: 'rgb(148, 103, 189)'},
    tickfont: {color: 'rgb(148, 103, 189)'},
    overlaying: 'y',
    side: 'right'
  }

          }}
          />
          </Box>       
          </div>
          </Stack>
          </div>
          

          );


  };
  export default PairsAnalyser;