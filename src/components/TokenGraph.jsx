import axios from 'axios'
import React, {useState, useEffect} from "react";
import Plot from 'react-plotly.js';
import {std} from 'mathjs'
  import { Center, Square, Circle } from "@chakra-ui/react"


const TokenGraph = (props) => {

  var total = 0;

  const tokID = props.tokID;
    const time1 = props.time;
    const [time, setTime] = useState(365)

	  const [totalData, setData] = useState([]);
    const [loading, setLoading] = useState(false);
	let data = { date: [], prices: []};

  useEffect(() => { if(time1===1){
        setTime(7)
      }
       if(time1===2){
        setTime(30)
      }
       if(time1===3){
        setTime(30)
      } }, [time1])

	useEffect(() => { 
    const fetchData = async () => {
    const result = await axios('https://api.coingecko.com/api/v3/coins/ethereum/contract/'+tokID+'/market_chart/?vs_currency=usd&days='+time)
    setData(result.data.prices);
    setLoading(true)

  };
  fetchData();
}, [time]);

		for (const item of totalData) {
      data.prices.push(item[1]);
      total += item[1];
      if (item[0] < 10000000000)
          item[0] *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
      var data1 = item[0] + (new Date().getTimezoneOffset() * -1); //for timeZone        
      var data2 = new Date(data1);
      data.date.push(data2);
        
    }


  useEffect(() => { 
    if(data.prices.length>0){
    console.log(total / totalData.length)
    console.log(std(data.prices))
}},[loading]);
    

	return (
    <Center>
	<Plot 
      style={{
        position: 'relative'
      }}
      data={[
        {
          type: 'line',
          x: data.date, 
          y: data.prices,
          name: "Daily Price"
        }

        ]}
        layout={{ width: 1000, height: 500,
          xaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false,
          }}}
          />
          </Center>
  )
  


  }
;




export default TokenGraph;