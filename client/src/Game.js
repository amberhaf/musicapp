import React, { Component } from "react";
import { Songs } from "./Songs.js";
import Pizzicato from 'pizzicato';
const axios = require('axios');

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
      globalArray: localSpotify,
      play: false,
    };
    this.onGuessChange = this.onGuessChange.bind(this);
    this.start = this.start.bind(this);
  }
  
  onGuessChange(event) {
      fetch('http://localhost:5000/api/addUser' , {
    method: "POST",
    headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
      }
      ,
      body: JSON.stringify({fileName: 'dnkf'})
    });
    let random = this.state.random;

    let correct = this.state.correct;
    correct = correct + 1;
    if (random.toLowerCase() === event.target.value.toLowerCase()) {
      this.setState({ correct: correct });
      this.start();
    }
    this.setState({ searchTerm: event.target.value });
  }
  start() {
   let num = Math.floor(Math.random() * 5);
    //let random = localSpotify[num].title;
   // this.setState({ random: random });
    this.setState({ play: false})
    audio.stop();
    var _this = this;
    // this.setState({random: random[0].fileName})}
    fetch('/api/customers')
    .then(function(response) {
      return response.json();
      })
      .then(function(random){
        var title="./"+random[0].fileName+'.mp3';;
        console.log(title);
        _this.setState({ random: random[0].fileName });
      audio = new Pizzicato.Sound(title, function() {
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
  });
  }

  render() {
    return (
      <div className="App">
        <h1>Song guessing app</h1> <br />
        <Play random={this.state.random} audio={this.state.audio} start={this.start} />
        <Guess
          searchTerm={this.state.searchTerm}
          correct={this.state.correct}
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
    const audio = this.props.audio;

    return (
      <div className="PlayDisplay">
        <button onClick={start}>Start</button>
        <p>
         Random Song:<b>{random}</b>
        </p>
        <p>The song will play with random effects applied to it</p>
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
