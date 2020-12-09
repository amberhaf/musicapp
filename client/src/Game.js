import React, { Component } from "react";
import { Songs } from "./Songs.js";
import Pizzicato from 'pizzicato';
import { Link } from "react-router-dom";

const localSpotify = Songs;
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
speed:30
});

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      random: "",
      correct: 0,
      rounds: 0,
      globalArray: localSpotify,
      play: false,
    };
    this.onGuessChange = this.onGuessChange.bind(this);
    this.start = this.start.bind(this);
    this.begin = this.begin.bind(this);
    this.clear = this.clear.bind(this);
  }
  
  onGuessChange(event) {
    let random = this.state.random;
    let correct = this.state.correct;
    let round = this.state.rounds;
    correct = correct + 1;
    if (random.toLowerCase() === event.target.value.toLowerCase()) {
      this.setState({ correct: correct });
      if(round < 6)
      {
        this.start();
      }
      else
      {
        audio.stop();
        this.setState({ rounds: 6 });
      }
    }
    this.setState({ searchTerm: event.target.value });
  }
  begin() {
    this.setState({ rounds: 0});
    this.setState({ correct: 0});
    this.start();
    audio.stop();
  }
  clear() {
    var _this = this;
    var boo = true;
    fetch('/api/clear' , {
    method: "POST",
    headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify({genre: boo})
  }).then(response => response.json())
  .then(function(data){
    console.log('Success:', data[0].downloaded);
    _this.setState({ downloaded: data[0].downloaded});
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  }
  start() {
    let round = this.state.rounds;
    round = round + 1;
    this.setState({rounds: round });
    audio.stop();
    if(round<6)
    {
    let num = Math.floor(Math.random() * 5);
    //let random = localSpotify[num].title;
   // this.setState({ random: random });
    this.setState({ play: false})
    audio.removeEffect(ringModulator);
    audio.removeEffect(tremolo);
    audio.removeEffect(stereoPanner);
    var _this = this;
    fetch('/api/getDetails')
    .then(function(response) {
      return response.json();
      })
      .then(function(random){
        _this.setState({ random: random[0].title });
    });
      audio = new Pizzicato.Sound('/api/getSong', function() {
      num = Math.floor(Math.random() * 3);
      if(num===0)
      {
        audio.addEffect(ringModulator);
      }
      else if(num===1)
      {
        audio.addEffect(tremolo);
      }
      else if(num===2)
      {
        audio.addEffect(stereoPanner);
      }
      audio.play();
    });
  }
  }

  render() {
    return (
      <div className="App">
        <h1>Song guessing app</h1> <br />
        <Play random={this.state.random} audio={this.state.audio} clear={this.clear} start={this.start} begin={this.begin} rounds={this.state.rounds} correct={this.state.correct}/>
        <Guess
          searchTerm={this.state.searchTerm}
          correct={this.state.correct}
          rounds={this.state.rounds}
          onChange={this.onGuessChange}
          globalArray={this.state.globalArray}
        />
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
        {(rounds<6) && (
        <div>
         {(rounds===0) &&
        (<button onClick={begin}>Start</button>)}
        {(rounds!==0 && rounds<6) &&
        (<button onClick={start}>Next</button>)}
        <button> <Link to="/">New Game</Link></button>
        <p>
         Random Song:<b>{random}</b>
        </p>
        <p>The song will play with random effects applied to it</p>
        </div>
        )}

        {(rounds===6) && (
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

class Guess extends Component {
  filterFunction(searchTerm) {
    return function (addrObject) {
      // convert everything to lower case for string matching
      let title = addrObject.title.toLowerCase();
      let artist = addrObject.artist.toLowerCase();

      return (
        searchTerm.length >= 3 &&
        (title.includes(searchTerm.toLowerCase()) ||
          artist.includes(searchTerm.toLowerCase()))
      );
    };
  }
  render() {
    const searchTermFromProps = this.props.searchTerm;
    const onChangeFromProps = this.props.onChange;
    const arrayPassedAsParameter = this.props.globalArray;
    const searchTerm = this.props.searchTerm;
    const correct = this.props.correct;
    const rounds = this.props.rounds;
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
        <h3>round: {rounds}</h3>

        <h3>Suggestions</h3>
        {arrayPassedAsParameter
          .filter(this.filterFunction(searchTerm))
          .map((a) => (
            <div key={a.id}>
              <b>{a.title} </b>
              {a.artist}
            </div>
          ))}
      </div>
    );
  }
}

export default Game;
