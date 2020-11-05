import React, { Component } from "react";
import { Songs } from "./Songs.js";
import Pizzicato from "pizzicato";

const localSpotify = Songs;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      random: "",
      correct: 0,
      globalArray: localSpotify,
      play: false,
      pause: true,
    };
    this.onGuessChange = this.onGuessChange.bind(this);
    this.start = this.start.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.audio = new Pizzicato.Sound('./wait.mp3');
    this.ringModulator = new Pizzicato.Effects.RingModulator({
        speed: 30,
        distortion: 1,
        mix: 0.5
    });
    this.tremolo = new Pizzicato.Effects.Tremolo({
        speed: 7,
        depth: 0.8,
        mix: 0.8
    });
    this.stereoPanner = new Pizzicato.Effects.StereoPanner({
      pan: 0.0
    });
  }
  onGuessChange(event) {
    let random = this.state.random;
    let correct = this.state.correct;
    correct = correct + 1;
    if (random.toLowerCase() === event.target.value.toLowerCase()) {
      this.setState({ correct: correct });
      this.pause();
    }
    this.setState({ searchTerm: event.target.value });
  }
  play() {
    let num = Math.floor(Math.random() * 3);
    console.log("NUm is !!!!!!"+ num);
    if(num===0)
    {
      this.audio.addEffect(this.ringModulator);
    }
    else if(num===1)
    {
      this.audio.addEffect(this.tremolo);
    }
    else if(num===2)
    {
      this.audio.addEffect(this.stereoPanner);
    }
    this.setState({ play: true, pause: false })
    this.audio.play();
  }
  pause() {
    this.setState({ play: false, pause: true })
      this.audio.pause();
  }
  start() {
    this.play();
    let num = Math.floor(Math.random() * localSpotify.length);
    let random = localSpotify[num].title;
    this.setState({ random: random });
  }

  render() {
    return (
      <div className="App">
        <h1>Song guessing app</h1> <br />
        <Play random={this.state.random} start={this.start} />
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
