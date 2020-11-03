import React, { Component } from "react";
import { Songs } from "./Songs.js";

const localSpotify = Songs;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      random: "",
      correct: 0,
      globalArray: localSpotify
    };
    this.onGuessChange = this.onGuessChange.bind(this);
    this.start = this.start.bind(this);
  }
  onGuessChange(event) {
    let random = this.state.random;
    let correct = this.state.correct;
    correct = correct + 1;
    if (random.toLowerCase() === event.target.value.toLowerCase()) {
      this.setState({ correct: correct });
    }
    this.setState({ searchTerm: event.target.value });
  }
  start() {
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
