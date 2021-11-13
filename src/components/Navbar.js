import React from "react";
import uniswapLogo from '../uniswap-logo.png'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/react-hooks'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Collapse,
  useDisclosure,
  Box,
  VStack
} from "@chakra-ui/react"
import { Formik, Form, Field } from 'formik';

import {useHistory} from 'react-router-dom'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})

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

const Navbar = () => {

    const { isOpen, onToggle } = useDisclosure()

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
    const handleRouteToken = (props) => {
  history.push({
    pathname:"/Token",
    state: {props},
})}

  const history = useHistory();
    const handleRoute = () => {
      history.goBack();
    }

    const handleRouteTT = () => {
    history.push("/top-tokens");
  }


  const handleRouteTP = () => {
    history.push("/top-pairs");
  }

    const handleRouteH = () => {
    history.push("/");
  }

   const handleRouteI = () => {
    history.push("/info");
  }

    const [getCheck, { loading: checkLoading, data: checkData }] = useLazyQuery(tokCheck_QUERY)
   

  return(
    <VStack>
    <div className = "background-color1">
    <div className="container-fluid mt-5"/>
    <div className="row"/>
    <main role="main" className="col-lg-12 d-flex text-center"/>
    <div className="content mr-auto ml-auto"/>
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
    <a
    className="navbar-brand col-sm-3 col-md-2 mr-0"
    href="/"
    >
    <img src={uniswapLogo} width="30" height="30" className="d-inline-block align-top" alt="" />
    &nbsp; Uniswap Token Analyser
    </a>
    
    <Breadcrumb separator="-" color="pink" pr="20px">
    <BreadcrumbItem>
    <BreadcrumbLink onClick = {onToggle} > Search </BreadcrumbLink>
  </BreadcrumbItem>
    <BreadcrumbItem>
    <BreadcrumbLink onClick = {handleRouteTT} > Top Tokens </BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink  onClick = {handleRouteTP} > Top Pairs</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink onClick = {handleRouteI} > Info </BreadcrumbLink>
  </BreadcrumbItem>

  <BreadcrumbItem>
    <BreadcrumbLink onClick = {handleRouteH} > Home </BreadcrumbLink>
  </BreadcrumbItem>

  <BreadcrumbItem>
    <BreadcrumbLink onClick={handleRoute} >Back</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>   
    </nav>
    </div>
        <Collapse in={isOpen} animateOpacity>
        <Box
          p="40px"
          w="500px"
          color="white"
          mt="4"
          bg="teal.500"
          rounded="md"
          shadow="md"
        >
       <Formik
    initialValues={{ token: "0x6b175474e89094c44da98b954eedeac495271d0f" }}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        handleRouteToken(values.token)
      }, 1000)
    }}
    >
    {(props) => (
    <Form>
      <Field name="token" validate={validateToken}>
        {({ field, form }) => (
        <FormControl isInvalid={form.errors.token && form.touched.token}>
          <FormLabel htmlFor="/Token">Token Search</FormLabel>
          <Input {...field} id="token" placeholder="ERC20 Token Address" />
          <FormErrorMessage>{form.errors.token}</FormErrorMessage>
        </FormControl>
        )}
      </Field>
      <Button
      mt={4}
      colorScheme="blue"
      isLoading={props.isSubmitting}
      type="submit"
      >
      Submit
    </Button>
  </Form>
  )}
</Formik>
</Box>
    </Collapse>
    </VStack>
    )
}

export default Navbar;