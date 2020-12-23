import React, { Component } from "react";
import Pizzicato from 'pizzicato';
import { Link } from "react-router-dom";
import Navbar from "./NavBar";

var audio = new Pizzicato.Sound({ 
  source: 'file',
  options: { path: './noise.mp3' }
});

//REVERBS REVERBS REVERBS REVERBS REVERBS REVERBS REVERBS REVERBS REVERBS REVERBS//
var shortVerb = new Pizzicato.Effects.Reverb({
  time: 1.32,
  decay: 1.3,
  reverse: false,
  mix: 0.6
});

var longVerb = new Pizzicato.Effects.Reverb({
  time: 3,
  decay: 3,
  reverse: false,
  mix: 0.7
});

var reverseVerb = new Pizzicato.Effects.Reverb({
  time: 2,
  decay: 2,
  reverse: true,
  mix: 0.8
});




//DELAYS DELAYS DELAYS DELAYS DELAYS DELAYS DELAYS DELAYS DELAYS DELAYS DELAYS//
var dubDelay = new Pizzicato.Effects.DubDelay({
  feedback: 0.75,
  time: 3.5,
  cutoff: 2700,
  mix: 0.5
});

var elvis = new Pizzicato.Effects.Delay({
  feedback: 0.1,
  time: 0.1,
  mix: 0.5,
})

var extremeDelay = new Pizzicato.Effects.Delay({
  feedback: 0.5,
  time: 0.3,
  mix: 0.5
});

var pingPong = new Pizzicato.Effects.PingPongDelay({
  feedback: 0.6,
  time: 1,
  mix: 0.7
});




//FILTERS FILTERS FILTERS FILTERS FILTERS FILTERS FILTERS FILTERS FILTERS FILTERS//
var telephoneLowPass = new Pizzicato.Effects.LowPassFilter({
  //Combine with telephoneHighPass for telephone effect
  frequency: 2000,
  peak: 10
});

var telephoneHighPass = new Pizzicato.Effects.HighPassFilter({
  //Combine with telephoneLowPass for telephone effect
  frequency: 700,
  peak: 10
});

var regLowPass = new Pizzicato.Effects.LowPassFilter({
  frequency: 12000,
  peak: 10
});

var regHighPass = new Pizzicato.Effects.HighPassFilter({
  frequency: 200,
  peak: 10
});

var extremeLowPass = new Pizzicato.Effects.LowPassFilter({
  frequency: 100,
  peak: 10
});




//DISTORTION DISTORTION DISTORTION DISTORTION DISTORTION DISTORTION DISTORTION//
var distortion = new Pizzicato.Effects.Distortion({
  gain: 0.95
});

var distortionRingMod = new Pizzicato.Effects.RingModulator({
  speed: 125,
  distortion: 6,
  mix: 0.1
});

var pitchRingMod = new Pizzicato.Effects.RingModulator({
  speed: 2000,
  distortion: 2.6,
  mix: 0.3
});

var quadraFuzz = new Pizzicato.Effects.Quadrafuzz({
  lowGain: 1,
  midLowGain: 1,
  midHighGain: 1,
  highGain: 0.2,
  mix: 0.9
});

//OTHER OTHER OTHER OTHER OTHER OTHER OTHER OTHER OTHER OTHER OTHER OTHER//
var noise = new Pizzicato.Sound('./noise.mp3');
noise.volume = 0.3;

var slowFlang = new Pizzicato.Effects.Flanger({
  time: 1,
  speed: 0.2,
  depth: 1,
  feedback: 0.45,
  mix: 1
});

var fastFlang = new Pizzicato.Effects.Flanger({
  time: 1,
  speed: 0.8,
  depth: 1,
  feedback: 0.6,
  mix: 1
});

var slowTremolo = new Pizzicato.Effects.Tremolo({
  speed: 1.2,
  depth: 1,
  mix: 1
});

var fastTremolo = new Pizzicato.Effects.Tremolo({
  speed: 20,
  depth: 1,
  mix: 1
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
      ready: false,
      canClick: true,
      right: "red",
      guessed: true,
      lastSong: "",
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
        if(back[0].ready){
          window.setTimeout(myFunction, 2000)
        }
      function myFunction() {
        _this.setState({ ready: true });
      }
      });
  }

  onGuessChange(event) {
    let random = this.state.random.toLowerCase();
    let correct = this.state.correct;
    let round = this.state.rounds;
    correct = correct + 1;
    if ((event.target.value.length >= 8 && (random.includes(event.target.value.toLowerCase()))) || (random.toLowerCase() === event.target.value.toLowerCase())) {
      this.setState({ correct: correct });
      this.setState({ searchTerm: "" });
      this.setState({ guessed: true });
      if (round < 9) {
        this.start();
      }
      else {
        audio.stop();
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
    this.start();
    audio.stop();
  }
  clear() {
    audio.stop();
    noise.stop();
    this.props.history.push("/");
  }
  start() {
    this.setState({ searchTerm: "" });
    audio.stop();
    noise.stop();
    this.setState({ canClick: false });
    var ran=this.state.random;
    this.setState({ lastSong: ran });
    let round = this.state.rounds;
    round = round + 1;
    this.setState({ rounds: round });
    audio.removeEffect(fastFlang);
    audio.removeEffect(slowFlang);
    audio.removeEffect(pitchRingMod);
    audio.removeEffect(regHighPass);
    audio.removeEffect(distortionRingMod);
    audio.removeEffect(regHighPass);
    audio.removeEffect(dubDelay);
    audio.removeEffect(reverseVerb);
    audio.removeEffect(telephoneHighPass);
    audio.removeEffect(telephoneLowPass);
    audio.removeEffect(slowTremolo);
    audio.removeEffect(shortVerb);
    audio.removeEffect(longVerb);
    audio.removeEffect(reverseVerb);
    audio.removeEffect(elvis);
    audio.removeEffect(distortion);
    audio.removeEffect(extremeDelay);
    audio.removeEffect(quadraFuzz);
    audio.removeEffect(fastTremolo);
    audio.removeEffect(slowFlang);
    audio.removeEffect(telephoneLowPass);
    audio.removeEffect(extremeLowPass);
    audio.removeEffect(elvis);
    audio.removeEffect(reverseVerb);
    audio.stop();
    if (round < 9) {
      let num = Math.floor(Math.random() * 15);
      audio.stop();
      this.setState({ play: false })
      var _this = this;
      fetch('/api/getDetails')
        .then(function (response) {
          _this.setState({ canClick: false });
          return response.json();
        })
        .then(function (random) {
          _this.setState({ random: random[0].title });
        })
        .then(function () {
          audio = new Pizzicato.Sound({ 
            source: 'file',
            options: { path: '/api/getSong' }
        }, function() {
            console.log('sound file loaded!');
        if (audio !== undefined) {
          console.log(audio);
        num = Math.floor(Math.random() * 15);
        if (num === 0) { //Fast Flanger
          audio.addEffect(fastFlang);
        }
        else if (num === 1) { //Slow Flanger
          audio.addEffect(slowFlang);
        }
        else if (num === 3) { //Ring Modulator + High-Pass
          audio.addEffect(pitchRingMod);
          audio.addEffect(regHighPass);
        }
        else if (num === 4) { //Ring Modulator + High-Pass
          audio.addEffect(distortionRingMod);
          audio.addEffect(regHighPass);
        }
        else if (num === 5) { //Dub Delay + Reversed Reverb
          audio.addEffect(dubDelay);
          audio.addEffect(reverseVerb);
        }
        else if (num === 6) { //Telephone Effect
          audio.addEffect(telephoneHighPass);
          audio.addEffect(telephoneLowPass);
        }
        else if (num === 7) { //Tremolo + White Noise
          audio.addEffect(slowTremolo);
          noise.play();
        }
        else if (num === 8) { //All 3 Reverbs
          audio.addEffect(shortVerb);
          audio.addEffect(longVerb);
          audio.addEffect(reverseVerb);
          audio.volume = 4.0;
        }
        else if (num === 9) { //Distortion + Slap Delay
          audio.addEffect(elvis);
          audio.addEffect(distortion);
        }
        else if (num === 10) { //High Feedback Delay
          audio.addEffect(extremeDelay);
        }
        else if (num === 11) { //Quadrafuzz + Fast Tremelo
          audio.addEffect(quadraFuzz);
          audio.addEffect(fastTremolo);
        }
        else if (num === 12) { //Slow Flanger + Telephone Low Pass
          audio.addEffect(slowFlang);
          audio.addEffect(telephoneLowPass);
        }
        else if (num === 13) { //Extreme Low-Pass Filter
          audio.addEffect(extremeLowPass);
        }
        else if (num === 14) { //Slap Delay + Reversed Reverb
          audio.addEffect(elvis);
          audio.addEffect(reverseVerb);
        }
        if(_this.state.guessed===true){
          _this.setState({ right: "green" });
        }
        else
        {
          _this.setState({ right: "red" });          
        }
        _this.setState({ guessed: false });
      } else {
          console.log("this was undefined");
      }
      audio.play();
    });
    }).then(function () {
      window.setTimeout(myFunction, 5000)
    });
    }
    function myFunction() {
      _this.setState({ canClick: true });
    }
  }
  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('do validate');
    }
  }


  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="wrapper correct">
          <span className="dot">Correct<br/>{this.state.correct}</span>
          <img className="record" src="./record2.png" alt="record" />
        </div>
        <h1 className="title">Melodify</h1>
        <div className="wrapper round">
          <span className="dot">Round<br/>{this.state.rounds}</span>
          <img className="record" src="./record2.png"  alt="record"/>
        </div>
        <br />
        {( this.state.rounds > 1) && ( <p className={(this.state.right)}>The last song was <b>{this.state.lastSong}</b></p> )}
        <Play random={this.state.random} audio={this.state.audio} clear={this.clear} start={this.start} begin={this.begin} rounds={this.state.rounds} correct={this.state.correct} ready={this.state.ready} canClick={this.state.canClick} />
        {(this.state.rounds < 9 && this.state.rounds > 0) && (
          <div>
            <textarea
              className="form"
              placeholder="Type your guess here"
              value={this.state.searchTerm}
              onChange={this.onGuessChange}
              type="text"
              cols="80"
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
    const start = this.props.start;
    const clear = this.props.clear;
    const begin = this.props.begin;
    const rounds = this.props.rounds;
    const correct = this.props.correct;
    const ready = this.props.ready;
    const canClick = this.props.canClick;

    return (
      <div className="PlayDisplay">
        {(rounds < 9 && ready === true) && (
          <div>
            {(rounds === 0) &&
              (<button className="b1" onClick={begin}>Start</button>)}
            {(rounds !== 0 && rounds < 9 && canClick === true) &&
              (<button className="b1"  onClick={start}>Next</button>)}
            {(rounds !== 0 && rounds < 9 && canClick === false) &&
              (<button className="b1" >Next</button>)}
            <button  className="b1" onClick={clear}>New Genre</button>
            <p>The song will play with random effects applied to it</p>
          </div>
        )}

        {(rounds === 9 || ready === false) && (
          <div>
            <p>Game Over</p>
            <p>You got {correct} out of 8</p>
            <Link to="/"><button className="b1" onClick={clear}>New Genre</button></Link>
          </div>
        )}

      </div>
    );
  }
}

export default Game;
