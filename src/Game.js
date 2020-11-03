import React, { Component } from "react";
import { Songs } from "./Songs.js";

const localSpotify = Songs;

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = { searchTerm: "", random: "", correct:0, globalArray: localSpotify };
    this.onGuessChange = this.onGuessChange.bind(this);
    this.start = this.start.bind(this);
  } 
  onGuessChange(event) {
    let random= this.state.random;
    let correct= this.state.correct;
    correct=correct+1;
    if(random===event.target.value)
    {
      this.setState({ correct: correct});
    }
    this.setState({ searchTerm: event.target.value });
  }
  start() {
    let num=Math.floor(Math.random() * localSpotify.length)  
    let random= localSpotify[num].title; 
    this.setState({ random: random});
  }

  render() {
    return (
      <div className="App">
        <h1>Song guessing app</h1> <br />
        <Play
          random={this.state.random}
          start={this.start}
        />
        <Guess
          searchTerm={this.state.searchTerm}
          correct={this.state.correct}
          onChange={this.onGuessChange}
        />
      </div>
    ); 
  } 
} 

class Play extends Component {

  render() {
    const random = this.props.random;
    const start = this.props.start;

    return (
      <div className="PlayDisplay">
        <button onClick={start}>Start</button>
        <p>
          Random Song:<b>{random}</b>
        </p>
        <p>
          The song will play with random effects applied to it
        </p>
      </div>
    );
  }
}

class Guess extends Component {
  render() {
    // this.props are the properties which are provided or passed
    // to this component. We have the searchTerm and we have the
    // onChange function.
    const searchTermFromProps = this.props.searchTerm;
    const onChangeFromProps = this.props.onChange;
    const correct = this.props.correct;
    return (
      <div className="GuessForm">
        <form>
          <b>Type your guess here: </b>
          <input
            type="text"
            value={searchTermFromProps}
            onChange={onChangeFromProps}
          />
        </form>
        <h3>Correct guesses: {correct}</h3>
      </div>
    );
  }
}

export default Game;
