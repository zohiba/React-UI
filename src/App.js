import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {Logo, Header, Navigation, Link, Label, HeaderBar} from '@bandwidth/shared-components';


import "./App.css";
import Routes from "./Routes";

class App extends Component {
    render() {
        return (
            <div >
                <Navigation>
                    <Link.Wrap to="/">
                        <Navigation.Title>Bandwidth Censer</Navigation.Title>
                    </Link.Wrap>
                    <Nav pullRight>
                        <LinkContainer to="/login">
                            <NavItem>Login</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/scenario">
                            <NavItem>Scenario</NavItem>
                        </LinkContainer>
                    </Nav>
                </Navigation>
                <Routes />
            </div>
        );
    }


}

export default App;
