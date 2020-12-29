import React, { Component } from "react";
import Pizzicato from 'pizzicato';
import { Link } from "react-router-dom";
import Navbar from "./NavBar";

{/*default pizzicato global sound variable*/}
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
    //default prop state variables
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

  //checks if download is complete inorder for game to be played
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

  //handles form input change
  onGuessChange(event) {
    let random = this.state.random.toLowerCase();
    let correct = this.state.correct;
    let round = this.state.rounds;
    correct = correct + 1;
    //if song name is correct increment correct and start new round
    if ((event.target.value.length >= 8 && (random.includes(event.target.value.toLowerCase()))) || (random.toLowerCase() === event.target.value.toLowerCase())) {
      this.setState({ correct: correct });
      this.setState({ searchTerm: "" });
      this.setState({ guessed: true });
      if (round < 9) {
        this.start();
      }
      //if rounds equals 9 end game
      else {
        audio.stop();
        this.setState({ rounds: 9 });
      }
    }
    //update text-area input
    else {
      this.setState({ searchTerm: event.target.value });
    }
  }
  //reset game and call start
  begin() {
    this.setState({ rounds: 0 });
    this.setState({ correct: 0 });
    this.start();
    audio.stop();
  }
  //stop sounds before leaving page
  clear() {
    audio.stop();
    noise.stop();
    this.props.history.push("/");
  }
  //plays new song
  start() {
    //resets text-area input
    this.setState({ searchTerm: "" });
    //stop last song
    audio.stop();
    noise.stop();
    //temporarily disable next button
    this.setState({ canClick: false });
    var ran=this.state.random;
    //store previous song before changing
    this.setState({ lastSong: ran });
    let round = this.state.rounds;
    round = round + 1;
    //increment rounds
    this.setState({ rounds: round });
    //remove all effects
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
    //if game in play play new song
    if (round < 9) {
      let num = Math.floor(Math.random() * 15);
      this.setState({ play: false })
      var _this = this;
    //fetch next song details from server
      fetch('/api/getDetails')
        .then(function (response) {
          return response.json();
        })
        .then(function (random) {
          //set next song name
          _this.setState({ random: random[0].title });
        })
        .then(function () {
          //get song from server and apply pizzicato effects
          audio = new Pizzicato.Sound({ 
            source: 'file',
            options: { path: '/api/getSong' }
        }, function() {
        if (audio !== undefined) {
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
        //set colour depending on whether guessed right or wrong
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
     //re-enable next button
      _this.setState({ canClick: true });
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        {/*Display scoring information */}
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
        {/* If there was a last song display this */}
        {( this.state.rounds > 1) && ( <p className={(this.state.right)}>The last song was <b>{this.state.lastSong}</b></p> )}
        <Play random={this.state.random} audio={this.state.audio} clear={this.clear} start={this.start} begin={this.begin} rounds={this.state.rounds} correct={this.state.correct} ready={this.state.ready} canClick={this.state.canClick} />
        {/*If game in play display input form*/}
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
        {/*If game is ready to be played show options*/}
        {(rounds < 9 && ready === true) && (
          <div>
            {/*Start game if not started yet*/}
            {(rounds === 0) &&
              (<button className="b1" onClick={begin}>Start</button>)}
            {/*Next round if already in play*/}
            {(rounds !== 0 && rounds < 9 && canClick === true) &&
              (<button className="b1"  onClick={start}>Next</button>)}
            {/*Next is disabled here temporarily*/}
            {(rounds !== 0 && rounds < 9 && canClick === false) &&
              (<button className="b1" >Next</button>)}
            <button  className="b1" onClick={clear}>New Genre</button>
            <p>The song will play with random effects applied to it</p>
          </div>
        )}
        {/*If game over show link back to genre page*/}
        {(rounds === 9 || ready === false) && (
            <div>
              {/*If game over display score*/}
              {(rounds === 9) && (
              <div>
            <b>Game Over</b><br/>
            <b>You got {correct} out of 8</b > 
            </div>)}
            <Link to="/"><button className="b1" onClick={clear}>New Genre</button></Link>
            </div>
        )}
      </div>
    );
  }
}

export default Game;
