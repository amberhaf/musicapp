import React, { Component } from "react";
import Navbar from "./NavBar";

class About extends React.Component {

  render() {
    return (
      <div className="App">
        <Navbar/>
        <p>
            Welcome to Music Guessing game.
            <br/>
            Choose a genre to play with or enter your own youtube playlist
            <br/>
            Choose from single player or two player mode
        </p>
      </div>
    )
  }
}

export default About;