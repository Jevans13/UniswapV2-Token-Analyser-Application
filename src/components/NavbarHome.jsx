import React from "react";
import uniswapLogo from '../uniswap-logo.png'

const NavbarHome = () => {

  return(
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
    </nav>
    </div>
    )
}

export default NavbarHome;