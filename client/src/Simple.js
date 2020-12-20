import React, { Component } from "react";
import { Songs } from "./Songs.js";
import Navbar from "./NavBar";

const localSpotify = Songs;

class Simple extends Component {
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
    let random = localSpotify[num].name;
    this.setState({ random: random });
  }

  render() {
    return (
      <div className="App">
        <Navbar />
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
      </div>
    );
  }
}

class Guess extends Component {
  filterFunction(searchTerm) {
    return function (addrObject) {
      // convert everything to lower case for string matching
      let name = addrObject.name.toLowerCase();
      let artist = addrObject.artist.toLowerCase();

      return (
        searchTerm.length >= 3 &&
        (name.includes(searchTerm.toLowerCase()) ||
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
              <b>{a.name} </b>
              {a.artist}
            </div>
          ))}
      </div>
    );
  }
}

export default Simple;