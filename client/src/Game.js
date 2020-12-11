import React, { Component } from "react";
import Pizzicato from 'pizzicato';
import { Link } from "react-router-dom";
import Navbar from "./NavBar";

var audio = new Pizzicato.Sound('./wait.mp3');

var ringModulator = new Pizzicato.Effects.RingModulator({
  speed: 30,
  distortion: 2,
  mix: 0.5
});
var tremolo = new Pizzicato.Effects.Tremolo({
  speed: 30,
  depth: 0.8,
  mix: 0.8
});
var stereoPanner = new Pizzicato.Effects.StereoPanner({
  pan: 1.0,
  speed: 30
});

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      random: "",
      correct: 0,
      rounds: 0,
      play: false,
    };
    this.onGuessChange = this.onGuessChange.bind(this);
    this.start = this.start.bind(this);
    this.begin = this.begin.bind(this);
    this.clear = this.clear.bind(this);
  }

  onGuessChange(event) {
    let random = this.state.random.toLowerCase();
    let correct = this.state.correct;
    let round = this.state.rounds;
    correct = correct + 1;
    if ((event.target.value.length >= 8 &&(random.includes(event.target.value.toLowerCase()))) || (random.toLowerCase() === event.target.value.toLowerCase())) {
      this.setState({ correct: correct });
      this.setState({ searchTerm: "" });
      if (round < 6) {
        this.start();
      }
      else {
        audio.stop();
        this.setState({ rounds: 6 });
      }
    }
    else{
    this.setState({ searchTerm: event.target.value });
    }
  }
  begin() {
    this.setState({ rounds: 0 });
    this.setState({ correct: 0 });
    this.start();
    audio.stop();
  }
  clear() {
    audio.stop();
    this.props.history.push("/");
  }
  start() {
    let round = this.state.rounds;
    round = round + 1;
    this.setState({ rounds: round });
    audio.stop();
    if (round < 6) {
      let num = Math.floor(Math.random() * 5);
      //let random = localSpotify[num].title;
      // this.setState({ random: random });
      this.setState({ play: false })
      audio.removeEffect(ringModulator);
      audio.removeEffect(tremolo);
      audio.removeEffect(stereoPanner);
      var _this = this;
      fetch('/api/getDetails')
        .then(function (response) {
          return response.json();
        })
        .then(function (random) {
          _this.setState({ random: random[0].title });
        });
      audio = new Pizzicato.Sound('/api/getSong', function () {
        num = Math.floor(Math.random() * 3);
        if (num === 0) {
          audio.addEffect(ringModulator);
        }
        else if (num === 1) {
          audio.addEffect(tremolo);
        }
        else if (num === 2) {
          audio.addEffect(stereoPanner);
        }
        audio.play();
      });
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar/>
        <div className="wrapper correct">
          <span className="dot">Correct {this.state.correct}</span>
          <img className="record" src="./record2.png" />
        </div>
        <h1 className="title">Melodify</h1>
        <div className="wrapper round">
          <span className="dot">Round {this.state.rounds}</span>
          <img className="record" src="./record2.png" />
        </div>
         <br />
        <Play random={this.state.random} audio={this.state.audio} clear={this.clear} start={this.start} begin={this.begin} rounds={this.state.rounds} correct={this.state.correct} />
        <form>
        <b>Type your guess here: </b>
          <input
            type="text"
            value={this.state.searchTerm}
            onChange={this.onGuessChange}
          />
        </form>
      </div>
    );
  }
}

class Play extends Component {
  render() {
    const random = this.props.random;
    const start = this.props.start;
    const clear = this.props.clear;
    const begin = this.props.begin;
    const audio = this.props.audio;
    const rounds = this.props.rounds;
    const correct = this.props.correct;

    return (
      <div className="PlayDisplay">
        {(rounds < 6) && (
          <div>
            {(rounds === 0) &&
              (<button onClick={begin}>Start</button>)}
            {(rounds !== 0 && rounds < 6) &&
              (<button onClick={start}>Next</button>)}
            <button onClick={clear}>New Game</button>
            <p>The song will play with random effects applied to it</p>
          </div>
        )}

        {(rounds === 6) && (
          <div>
            <p>Game Over</p>
            <p>You got {correct} out of {rounds}</p>
            <button onClick={clear}> <Link to="/">New Game</Link></button>
          </div>
        )}

      </div>
    );
  }
}

export default Game;
