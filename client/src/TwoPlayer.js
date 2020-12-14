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
      correct1: 0,
      correct2: 0,
      rounds: 0,
      play: false,
      ready: false,
      canClick: true,
    };
    this.onGuessChange = this.onGuessChange.bind(this);
    this.start = this.start.bind(this);
    this.begin = this.begin.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    var _this = this;
    fetch('/api/getReady')
    .then(function (response) {
      return response.json();
    })
    .then(function (back) {
      console.log(back[0].ready);
      _this.setState({ ready: back[0].ready });
    });
  }

  onGuessChange(event) {
    let random = this.state.random.toLowerCase();
    let round = this.state.rounds;
    if ((event.target.value.length >= 8 &&(random.includes(event.target.value.toLowerCase()))) || (random.toLowerCase() === event.target.value.toLowerCase())) {
      if(round%2===0)
      {
        let correct2 = this.state.correct2;
        correct2 = correct2 + 1;
        this.setState({ correct2: correct2 });
      }
      else{
        let correct1 = this.state.correct1;
        correct1 = correct1 + 1;
        this.setState({ correct1: correct1 });
      }
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
    this.setState({ correct1: 0 });
    this.start();
    audio.stop();
  }
  clear() {
    audio.stop();
    this.props.history.push("/");
  }
  start() {
    this.setState({ canClick: false});
    let round = this.state.rounds;
    round = round + 1;
    this.setState({ rounds: round });
    audio.stop();
    if (round < 6) {
      let num = Math.floor(Math.random() * 5);
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
        _this.setState({ canClick: true});
      });
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar/>
        <div className="wrapper correct">
          <span className="dot">Player1 {this.state.correct1}</span>
          <img className="record" src="./record2.png" />
        </div>
        <h1 className="title">Melodify</h1>
        <div className="wrapper round">
          <span className="dot">Player2 {this.state.correct2}</span>
          <img className="record" src="./record2.png" />
        </div>
         <br />
        {(this.state.rounds % 2!==0 && this.state.rounds <= 6) && (<h3>Player 1's go</h3>)}
        {(this.state.rounds % 2===0 && this.state.rounds !== 0) && (<h3>Player 2's go</h3>)}
        <Play random={this.state.random} audio={this.state.audio} clear={this.clear} start={this.start} begin={this.begin} rounds={this.state.rounds} correct1={this.state.correct1} ready={this.state.ready} canClick={this.state.canClick} />
        {(this.state.rounds < 6 && this.state.rounds>0) && (
          <div>
          <textarea 
            className="form-control"
            placeholder="Type your guess here"
            value={this.state.searchTerm}
            onChange={this.onGuessChange}
            type="text"
            cols="20"
            rows="1"
            />
        </div>
        )}
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
    const correct1 = this.props.correct1;
    const correct2 = this.props.correct2;
    const ready = this.props.ready;
    const canClick = this.props.canClick;

    return (
      <div className="PlayDisplay">
        {(rounds < 6 && ready==true) && (
          <div>
            {(rounds === 0) &&
              (<button onClick={begin}>Start</button>)}
            {(rounds !== 0 && rounds < 6 && canClick == true) &&
              (<button onClick={start}>Next</button>)}
            {(rounds !== 0 && rounds < 6 && canClick == false) &&
              (<button>Next</button>)}
            <button onClick={clear}>New Game</button>
            <p>The song will play with random effects applied to it</p>
          </div>
        )}

        {(rounds === 6 || ready==false) && (
          <div>
            <p>Game Over</p>
            {(correct1>correct2) && (
            <p>Player 1 won</p>
            )}
            {(correct1<correct2) && (
            <p>Player 2 won</p>
            )}
            {(correct1===correct2) && (
            <p>It's a draw</p>
            )}
            <button onClick={clear}> <Link to="/">New Game</Link></button>
          </div>
        )}

      </div>
    );
  }
}

export default Game;
