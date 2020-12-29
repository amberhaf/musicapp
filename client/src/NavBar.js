import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'

class NavBar extends React.Component {

  render() {
    return (
      <div>
        {/*Makes use of react-bootstrap so that it is both responsive on mobile and desktop*/}
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Navbar.Brand href="/"><img src="logo2.png" className="logo" alt="M"/>Melodify</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="navbar" id="basic-navbar-nav">
            <Nav>
            </Nav>
            {/*Page links*/}
            <Nav className="mr-sm-2 navbar">
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/">Effect Game</Nav.Link>
              <Nav.Link href="/simple">Simple Game</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}

export default NavBar;