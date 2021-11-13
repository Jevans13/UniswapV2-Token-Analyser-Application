import React, { Component } from 'react'
import './components/App.css'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { ApolloProvider } from 'react-apollo'
import { ChakraProvider, extendTheme } from "@chakra-ui/react"


/*import Token from "./routes/Token.jsx"
import TopTokens from "./routes/TopTokens.jsx"
import TopPairs from "./routes/TopPairs.jsx"
import TokenPairs from "./routes/TokenPairs.jsx"
import InfoPage from "./routes/InfoPage.jsx"*/
const Token = React.lazy(() => import("./routes/Token.jsx"));
const TopTokens = React.lazy(() => import("./routes/TopTokens.jsx"));
const TopPairs = React.lazy(() => import("./routes/TopPairs.jsx"));
const InfoPage = React.lazy(() => import("./routes/InfoPage.jsx"));
const TokenPairs = React.lazy(() => import("./routes/TokenPairs.jsx"));
const MainPage = React.lazy(() => import("./routes/index.jsx"));

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})

const colors = {
  brand: {
    900: "#E74884",
    800: "#153e75",
    700: "#2a69ac",
  },
}

const theme = extendTheme({ colors })

class App extends Component {
  render() {
    return (
      <ChakraProvider theme = {theme}>
      <ApolloProvider client = {client}>
      <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/Token" component={Token} />
          <Route exact path="/top-pairs" component={TopPairs} />
          <Route exact path="/top-tokens" component={TopTokens} />
          <Route exact path="/token-pairs" component={TokenPairs} />
          <Route exact path="/info" component={InfoPage} />
          </Switch>
      </Router>
      </ApolloProvider>
      </ChakraProvider>




    );
  }
}


export default App
