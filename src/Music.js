import React, { Component } from "react";
import Pizzicato from "pizzicato";

class Music extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      play: false,
      pause: true,
    }
    this.audio = new Pizzicato.Sound('./wait.mp3');
    this.ringModulator = new Pizzicato.Effects.RingModulator({
        speed: 30,
        distortion: 1,
        mix: 0.5
    });
  }

  play = () => {
  this.setState({ play: true, pause: false })
  this.audio.addEffect(this.ringModulator);
    this.audio.play();
  }
  
  pause = () => {
  this.setState({ play: false, pause: true })
    this.audio.pause();
  }
  
  render() {
    
  return (
    <div>
      <button onClick={this.play}>Play</button>
      <button onClick={this.pause}>Pause</button>
    </div>
    );
  }
}

export default Music;