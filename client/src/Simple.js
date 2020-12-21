import React, { Component } from "react";
import { Songs } from "./Songs.js";
import Navbar from "./NavBar";
import ReactPlayer from 'react-player'

const localSpotify = Songs;

class Simple extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            random: "",
            url: "",
            correct: 0,
            globalArray: localSpotify,
            correct: 0,
            rounds: 0,
            play: false,
            lastSong: "",
        };
        this.onGuessChange = this.onGuessChange.bind(this);
        this.start = this.start.bind(this);
        this.begin = this.begin.bind(this);
    }
    onGuessChange(event) {
        let random = this.state.random;
        let correct = this.state.correct;
        let round = this.state.rounds;
        correct = correct + 1;
        if (random.toLowerCase() === event.target.value.toLowerCase()) {
            this.setState({ correct: correct });
            this.setState({ searchTerm: "" });
            if (round < 9) {
                this.start();
            }
            else {
                this.setState({ rounds: 9 });
            }
        }
        else {
            this.setState({ searchTerm: event.target.value });
        }
    }
    begin() {
        this.setState({ rounds: 0 });
        this.setState({ correct: 0 });
        if(this.state.rounds===0)
        {
            this.start();
        }
    }
    start() {
        this.setState({ searchTerm: "" });
        var ran=this.state.random;
        this.setState({ lastSong: ran });
        let num = Math.floor(Math.random() * localSpotify.length);
        let random = localSpotify[num].name;
        let url = localSpotify[num].url;
        this.setState({ url: url });
        this.setState({ random: random });
        let round = this.state.rounds;
        round = round + 1;
        this.setState({ rounds: round });
        if(round===9){
            this.setState({ url: "" });
        }
    }

    render() {
        return (
            <div className="App">
                <Navbar />
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
                {( this.state.rounds > 1) && ( <p>The last song was <b>{this.state.lastSong}</b></p> )}
                <Play random={this.state.random} start={this.start} url={this.state.url} start={this.start} begin={this.begin} rounds={this.state.rounds} />
                {(this.state.rounds < 9 && this.state.rounds > 0) && (
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
        const url = this.props.url;
        const begin = this.props.begin;
        const rounds = this.props.rounds;
        const correct = this.props.correct;

        return (
            <div className="PlayDisplay">
                {(
                    <div>
                        {(rounds < 9 && rounds !== 0) &&
                        (<button onClick={start}>Next</button>)}
                        <button onClick={begin}>New Game</button>
                    </div>
                )}

                {(rounds === 9) && (
                    <div>
                        <p>Game Over</p>
                        <p>You got {correct} out of 8</p>
                    </div>
                )}
                <ReactPlayer
                    url={url}
                    playing={true}
                    width="0"
                    height="0"
                />
            </div>
        );
    }
}

export default Simple;