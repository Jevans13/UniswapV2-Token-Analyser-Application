import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.js';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo'
import { Spinner } from "@chakra-ui/react"
const client = React.lazy(() => import('./App.js'))


ReactDOM.render(
  <Suspense fallback={<Spinner />}>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  </Suspense>  ,
  document.getElementById('root')
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();