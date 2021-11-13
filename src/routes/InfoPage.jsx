import React from "react";
import {
  UnorderedList,
  ListItem, 
  Link, 
  Text,  
  Divider,
  Center, Box, VStack, Heading } from "@chakra-ui/react"
import Navbar from '../components/Navbar.js'


const InfoPage = () => {

return (
     <Box
  w="100%"
  h="100%"
  bgGradient={[
    "linear(to-tr, pink.300,purple.400)",
    "linear(to-t, black.200, teal.500)",
    "linear(to-b, purple.100, pink.300)",
  ]}
>
<Center>
<VStack>
<Navbar/>
<Box w = '60%' p={5} orderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" border='white' borderWidth="1px">
<Heading size="2xl" as="h1"> Using this application </Heading>
  <br />  
<Text> This app acts as a tool for users of the Uniswap DEX.</Text> 
  <br />
<Text> Browse the top tokens and top pairs features or search for any ERC20 token hosted on Uniswap using the Navbar.</Text>
  <br />
<Heading size="xl" as="h2" > Making sense of the numbers </Heading>
<br />
<Heading size="lg"> Correlation </Heading>
  <br />
<Text fontSize="md">Correlation statistics describe the relationship between 2 or more variables.

Correlation values can range between -1 and 1. The values can also be displayed in percentages (as they are in this application) ranging from -100% to +100%. </Text>
  <br />
<Text>A value of +100% meaning that two variables are directly correlated - an increase in one would also mean an increase in the other for example.

A correlation value of -100% would suggest the two variables move in the opposite direction - e.g. an increase in one variable would mean a decrease in the other variable of the same proportion</Text>
  <br />
<Heading size="md"> Population Correlation </Heading>
  <br />
<Text> The chosen correlation formula used for this application is the  <Text as="em">population correlation</Text> formula. You can read more about the mathematics behind this formula <Link Href="https://en.wikipedia.org/wiki/Pearson_correlation_coefficient">here.</Link></Text>
  <br />

 <Heading size="md">  Using the correlation values: </Heading>
 <br />
 <Text fontSize="md"> Correlation values can be useful metrics for investors. They've long been used by fund and investment managers in traditional finance to aid in the creation of diversified portfolios. </Text>
<br /> 
<Heading size="md"> Pairs - Price Correlation </Heading>
   <br />
  <Text fontSize="md">Price Correlation describes the relationship between the two tokens as labelled at the top of the page.

  Price Correlation can be a useful indicator for investors looking to build a diversified portfolio of tokens. Investors can decrease the total risk of their portfolio by having a range of tokens with low correlations.</Text>

  <br />
  <Text fontSize="md">A diversified portfolio is one in which the risk of the portfolio is spread across a number of uncorrelated assets. This is so that the risk of the whole portfolio collapsing at the same time is less.</Text>
<br /> 
<Text fontSize="md">Investors can use negatively correlated assets to hedge their portfolios, therefore, reducing the market risk due to volatility. Crypto markets are inherently more volatile than traditional stock markets and many assets move in line with the price of Bitcoin. However, that isn't to say that benefits can be gained from seeking out the rare negatively correlated asset.</Text>
<br /> 
<Heading size="md"> Token - Liquidity Correlation </Heading>
  <br />
<Text fontSize="md">There is evidence within the literature (<Link Href="https://www.sciencedirect.com/science/article/pii/S1544612321001124">see link</Link>) to suggest that cryptocurrency investors demand a premium for a high variation in liquidity volatility.</Text>
  <br />
  <Text fontSize="md">The paper also describes how the correlation between returns and the level of liquidity is mostly positive, thus, when liquidity is low, expected returns are high.</Text>
  <br />
   <Text fontSize="md">These findings can be used alongside the liquidity correlation provided by this application to help with investing decisions.</Text>
  <br />
   <Text fontSize="md">The plots displayed on the TokenPairs page allow users to assess the trends in liquidity and price. The axis includes both liquidity in token terms as well as USD.</Text>
  <br />
   <Text fontSize="md">The explanation for this is that as the token price increases, liquidity in USD will increase inline. However, we are interested in the token liquidity for this correlation statistic. As such, this is the figure the correlation is calculated using.</Text>
  <br />
   <Text fontSize="md">As you can see from analysing some of the larger cap tokens (WBTC and WETH), these both have strong positive correlations over the maximum time frames - as noted in the above research.</Text>
  <br />
   <Text fontSize="md">As with any indicator, this should be used in conjunction with many other factors when making decisions.</Text>
  <br />
<Heading> Volume Basics </Heading>
  <br />
<Text fontSize="md">Volume describes the amount of money (dollars in the case of this application) that are moving though an address. This web application has pair and individual token features.
The Pairs volume will show the amount traded of the pair address during the specified </Text>
  <br />
<Text>
For more information on avoiding Uniswap scams - take a look at {" "}<Link Href="https://coinmarketcap.com/alexandria/article/how-to-identify-and-avoid-uniswap-scams">this link</Link>
</Text>
  <br />
<Heading as="h2" size="lg" color="red"> Alerts </Heading>
  <br />
<Heading as="h3" size="md" > Liquidity </Heading>
  <br />
<Text>
A sharp decrease in the amount of liquidity of a token would suggest that the liquidity providers have been removing their assets from the liquidity pools on the Uniswap platform. The could be due to a few reasons such as:
</Text>
  <br />
<UnorderedList>
<ListItem> Moving them to exchanges to trade </ListItem>
<ListItem> Chasing yield - have noticed they can receive higher rewards elsewhere </ListItem>
<ListItem> Adjusting their allocation - possibly due to over / underpricing </ListItem>
</UnorderedList>
  <br />
<Text>
Suggested actions:
</Text>
  <br />
<UnorderedList>
<ListItem> Check price analysis - sharp increase/decrease in price would suggest a change in liquidity due to selling/buying  </ListItem>
<ListItem> Analyse yield on underlying token/tokens - check competing DEX's and yield pools/farms </ListItem>
</UnorderedList>
  <br />
<Heading as="h3" size="md" > Volume </Heading>
  <br />
<Text>
A sharp increase in the amount of volume of a token would suggest users of Uniswap are trading an above average amount of the token.
</Text>
 <br />
<Text>
Whilst this may not initially appear as risky and may be assumed as just natural growth during the lifecycle of a token. The risk comes when there is an unusual spike in the volume level. This is suggesting thers is some unusual trading activities happening in the market.
</Text>
  <br />
  <Text>
The could be due to a few reasons such as:
</Text>
  <br />
<UnorderedList>
<ListItem> Fundamental reasons - news released regarding updates/partnerships etc </ListItem>
<ListItem> Whales  purchasing (high net worth individuals/institutions) </ListItem>
<ListItem> Pump and dump groups attempting to artificially increase the price </ListItem>
</UnorderedList>
</Box>
</VStack>
</Center>
</Box>
	);

}


export default InfoPage;