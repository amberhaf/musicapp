import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'

class NavBar extends React.Component {

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Navbar.Brand href="/"><img src="logo2.png" className="logo"/>Melodify</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="navbar" id="basic-navbar-nav">
            <Nav>
            </Nav>
            <Nav className="mr-sm-2 navbar">
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/">Effects Game</Nav.Link>
              <Nav.Link href="/simple">Simple Game</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}

export default NavBar;